'use strict';
// v3.5 candidate integrity patch: enforce roadmap locks in the actual purchase API,
// keep veteran labels within the currently unlocked ladder, and expose aggregate live resources.
const v350BuyMusketeer=buyMusketeer;
buyMusketeer=function(team,rank='F',free=false){
 if(typeof rank==='boolean'){free=rank;rank='F'}
 if(!PURCHASABLE_RANKS.includes(rank))return null;
 return v350BuyMusketeer(team,rank,free)
};
rankLabelXP=function(xp){let rank='F';for(const name of PURCHASABLE_RANKS)if(xp>=(V35_RANK_PROFILES[name].promotionXP||0))rank=name;return `${rank}·${Math.max(0,xp-(V35_RANK_PROFILES[rank].promotionXP||0))}`};
function v35ArmyResources(team){const men=activeMusketeers(team);return{hp:men.reduce((n,a)=>n+(a.hp||0),0),maxHp:men.reduce((n,a)=>n+(a.maxHp||rankProfileOf(a).hp),0),mana:men.reduce((n,a)=>n+(a.mana||0),0),maxMana:men.reduce((n,a)=>n+(a.maxMana||rankProfileOf(a).mana),0),minRange:men.length?Math.min(...men.map(rankRangeOf)):0,maxRange:men.length?Math.max(...men.map(rankRangeOf)):0}}
function ensureV35ResourceUI(){const anchor=document.getElementById('eclassStat');if(!anchor||document.getElementById('armyHpStat'))return;for(const[id,label]of[['armyHpStat','Army HP'],['armyManaStat','Army Mana'],['rankRangeStat','Range span']]){const row=document.createElement('div');row.className='metric';row.id=id;row.innerHTML=`<span>${label}</span><span data-side="left">—</span><span data-side="right">—</span>`;anchor.parentNode.insertBefore(row,anchor)}}
const v350UpdateUI=updateUI;
updateUI=function(){v350UpdateUI();ensureV35ResourceUI();const r=[v35ArmyResources(0),v35ArmyResources(1)],ratio=(x,a,b)=>x[b]?`${Math.round(x[a])}/${Math.round(x[b])}`:'—',span=x=>x.maxRange?`${x.minRange}–${x.maxRange}`:'—';setPair('armyHpStat',ratio(r[0],'hp','maxHp'),ratio(r[1],'hp','maxHp'));setPair('armyManaStat',ratio(r[0],'mana','maxMana'),ratio(r[1],'mana','maxMana'));setPair('rankRangeStat',span(r[0]),span(r[1]))};
const v350State=window.__battleSim.state;
window.__battleSim.state=()=>{const state=v350State();state.rankSystem.purchaseLockEnforced=true;state.rankSystem.highestUnlocked=PURCHASABLE_RANKS[PURCHASABLE_RANKS.length-1];state.rankSystem.liveResources=[v35ArmyResources(0),v35ArmyResources(1)];return state};
Object.assign(window.__battleSim.test,{buyMusketeer,rankLabelXP,v35ArmyResources});window.GameTest.state=()=>window.__battleSim.state();ensureV35ResourceUI();updateUI();

// v3.5 verification hardening: make range a real hard limit and keep healing telemetry honest.
const v351AwardKill=awardKill;
awardKill=function(killer,victim,method='musket'){
 if(!killer||killer.isCommander)return v351AwardKill(killer,victim,method);
 ensureRankVitals(killer,false);const beforeHp=killer.hp,beforeProfile=rankProfileOf(killer),healingBefore=healingDone[killer.team],out=v351AwardKill(killer,victim,method),afterProfile=rankProfileOf(killer),promotionHpGrant=Math.max(0,afterProfile.hp-beforeProfile.hp),actualXpHeal=Math.max(0,Math.min(XP_HEAL,killer.hp-beforeHp-promotionHpGrant));
 healingDone[killer.team]=healingBefore+actualXpHeal;return out
};
const v351Fire=fire;
fire=function(a,target,d,volley=false){if(a&&!a.isCommander&&Number.isFinite(d)&&d>rankRangeOf(a)+1e-9)return false;return v351Fire(a,target,d,volley)};
const v351FireFortress=fireFortress;
fireFortress=function(a,fort,d){if(a&&!a.isCommander&&Number.isFinite(d)&&d>rankRangeOf(a)+1e-9)return false;return v351FireFortress(a,fort,d)};
const v351State=window.__battleSim.state;
window.__battleSim.state=()=>{const state=v351State();state.rankSystem.rangeHardLimitEnforced=true;state.rankSystem.healingTelemetryExcludesPromotionCapacity=true;state.rankSystem.veteranLabelsUseUnlockedRanksOnly=true;return state};
Object.assign(window.__battleSim.test,{awardKill,fire,fireFortress,rankLabelXP});window.GameTest.state=()=>window.__battleSim.state();
'use strict';
// v3.5 performance stabilization — preserve rank shielding while removing cubic target scans.
// The v3.5 export reached 95 living actors at 4x speed. The original shield-aware selector sorted every
// enemy list and rescanned that full list for every comparison, then repeated the work several times per
// actor per simulation step. This layer builds one shield index per step, uses single-pass minima, caches
// each actor/mode result for that step, and refreshes the text UI at 10 Hz instead of every render frame.
const V351_UI_INTERVAL_MS=100;
const V351_TARGET_MODES=['enemy','combat','siege','breach'];
let v351TargetingActive=false,v351TargetEpoch=0,v351NextUiAt=0,v351FrameWindowStart=performance.now(),v351FrameWindowCount=0;
let v351ActorsByTeam=[[],[]],v351NonCommandersByTeam=[[],[]],v351CommandersByTeam=[[],[]],v351ShieldCandidates=new Map();
let v351TargetCache=Object.fromEntries(V351_TARGET_MODES.map(mode=>[mode,new Map()])),v351PoolToken=0,v351ScorePoolToken=0;
const v351Perf={
  candidateScores:0,shieldChecks:0,targetSelections:0,cacheHits:0,cacheMisses:0,fullPoolSorts:0,
  lastStepMs:0,maxStepMs:0,lastStepCandidateScores:0,lastStepShieldChecks:0,lastStepSelections:0,lastStepCacheHits:0,
  frames:0,uiUpdates:0,lastFps:0,lastFrameMs:0,maxFrameMs:0
};

function v351ResetTargetCaches(){v351TargetCache=Object.fromEntries(V351_TARGET_MODES.map(mode=>[mode,new Map()]))}
function v351BuildTargetIndex(){
  v351TargetEpoch++;v351ActorsByTeam=[[],[]];v351NonCommandersByTeam=[[],[]];v351CommandersByTeam=[[],[]];v351ShieldCandidates=new Map();v351ResetTargetCaches();
  for(const a of actors){if(!a.alive)continue;v351ActorsByTeam[a.team].push(a);(a.isCommander?v351CommandersByTeam:v351NonCommandersByTeam)[a.team].push(a)}
  for(let team=0;team<2;team++){
    const side=v351ActorsByTeam[team],towardEnemy=team===0?1:-1;
    for(const target of side){
      if(target.isCommander||rankScoreOf(target)<=1)continue;
      const targetRank=rankScoreOf(target),near=[];
      for(const shield of side){
        if(shield===target||shield.isCommander||rankScoreOf(shield)>=targetRank)continue;
        const gap=(shield.x-target.x)*towardEnemy;
        if(gap>0&&gap<=V35_SHIELD_DEPTH&&Math.abs(shield.y-target.y)<=V35_SHIELD_LANE)near.push(shield)
      }
      if(near.length)v351ShieldCandidates.set(target.id,near)
    }
  }
}
function v351DirectShieldPool(target,pool){
  if(!target||target.isCommander||rankScoreOf(target)<=1)return[];
  const towardEnemy=target.team===0?1:-1,targetRank=rankScoreOf(target),source=pool||actors,out=[];
  for(const shield of source){
    if(!shield.alive||shield.team!==target.team||shield===target||shield.isCommander||rankScoreOf(shield)>=targetRank)continue;
    const gap=(shield.x-target.x)*towardEnemy;
    if(gap>0&&gap<=V35_SHIELD_DEPTH&&Math.abs(shield.y-target.y)<=V35_SHIELD_LANE)out.push(shield)
  }
  return out
}
screenedTargetScore=function(attacker,target,pool){
  v351Perf.candidateScores++;
  const d=Math.hypot(target.x-attacker.x,target.y-attacker.y),dir=attacker.team===0?1:-1,targetForward=(target.x-attacker.x)*dir,targetRank=rankScoreOf(target);let penalty=0;
  if(!target.isCommander&&targetForward>0){
    const shields=v351TargetingActive?(v351ShieldCandidates.get(target.id)||[]):v351DirectShieldPool(target,pool);
    for(const shield of shields){
      v351Perf.shieldChecks++;
      if(!shield.alive||(v351ScorePoolToken&&shield._v351PoolToken!==v351ScorePoolToken)||rankScoreOf(shield)>=targetRank)continue;
      const shieldForward=(shield.x-attacker.x)*dir;
      if(shieldForward>=-12)penalty=Math.max(penalty,V35_SHIELD_PENALTY+(targetRank-rankScoreOf(shield))*18)
    }
  }
  return d+penalty+(target.isCommander?35:0)
};
chooseScreenedTarget=function(attacker,pool){
  if(!pool||!pool.length)return null;
  v351Perf.targetSelections++;
  const previousToken=v351ScorePoolToken,token=++v351PoolToken;for(const target of pool)if(target)target._v351PoolToken=token;v351ScorePoolToken=token;
  let best=null,bestScore=Infinity;
  try{
    for(const target of pool){
      if(!target||!target.alive||target.team===attacker.team)continue;
      const score=screenedTargetScore(attacker,target,pool);
      if(score<bestScore-1e-9||(Math.abs(score-bestScore)<=1e-9&&(!best||target.id<best.id))){best=target;bestScore=score}
    }
    return best
  }finally{v351ScorePoolToken=previousToken}
};
function v351CachedTarget(mode,a,compute){
  if(!v351TargetingActive)return compute();
  const cache=v351TargetCache[mode],entry=cache.get(a.id);
  if(entry&&entry.epoch===v351TargetEpoch&&(!entry.target||entry.target.alive)){v351Perf.cacheHits++;return entry.target}
  v351Perf.cacheMisses++;const target=compute();cache.set(a.id,{epoch:v351TargetEpoch,target});return target
}
function v351BestAllOrRear(a,pool){const rear=[];for(const target of pool)if(target.alive&&rearThreat(a,target))rear.push(target);return chooseScreenedTarget(a,rear.length?rear:pool)}
enemyOf=function(a){return v351CachedTarget('enemy',a,()=>chooseScreenedTarget(a,v351TargetingActive?v351ActorsByTeam[1-a.team]:actors.filter(e=>e.alive&&e.team!==a.team)))};
combatEnemy=function(a){return v351CachedTarget('combat',a,()=>v351BestAllOrRear(a,v351TargetingActive?v351ActorsByTeam[1-a.team]:actors.filter(e=>e.alive&&e.team!==a.team)))};
siegeEnemy=function(a){return v351CachedTarget('siege',a,()=>{
  const source=v351TargetingActive?v351NonCommandersByTeam[1-a.team]:actors.filter(e=>e.alive&&e.team!==a.team&&!e.isCommander),pool=[];
  for(const e of source)if(Math.hypot(e.x-a.x,e.y-a.y)<=REAR_ALERT_RANGE)pool.push(e);
  const selected=v351BestAllOrRear(a,pool);if(selected)return selected;
  const commanders=v351TargetingActive?v351CommandersByTeam[1-a.team]:actors.filter(e=>e.alive&&e.team!==a.team&&e.isCommander),near=[];
  for(const e of commanders)if(Math.hypot(e.x-a.x,e.y-a.y)<=92)near.push(e);
  return chooseScreenedTarget(a,near)
})};
breachEnemy=function(a){return v351CachedTarget('breach',a,()=>{
  const source=v351TargetingActive?v351ActorsByTeam[1-a.team]:actors.filter(e=>e.alive&&e.team!==a.team),pool=[],rear=[];
  for(const e of source){const d=Math.hypot(e.x-a.x,e.y-a.y);if(d>BREACH_THREAT_RANGE)continue;pool.push(e);if(rearThreat(a,e)&&d<=BREACH_REAR_EMERGENCY_RANGE)rear.push(e)}
  return chooseScreenedTarget(a,rear.length?rear:pool)
})};

const v351BaseUpdateActors=updateActors;
updateActors=function(dt){
  const before={scores:v351Perf.candidateScores,checks:v351Perf.shieldChecks,selections:v351Perf.targetSelections,hits:v351Perf.cacheHits},start=performance.now();
  v351BuildTargetIndex();v351TargetingActive=true;
  try{return v351BaseUpdateActors(dt)}finally{
    v351TargetingActive=false;const elapsed=performance.now()-start;v351Perf.lastStepMs=elapsed;v351Perf.maxStepMs=Math.max(v351Perf.maxStepMs,elapsed);
    v351Perf.lastStepCandidateScores=v351Perf.candidateScores-before.scores;v351Perf.lastStepShieldChecks=v351Perf.shieldChecks-before.checks;v351Perf.lastStepSelections=v351Perf.targetSelections-before.selections;v351Perf.lastStepCacheHits=v351Perf.cacheHits-before.hits
  }
};

// Preserve the simulation-step cap and drawing cadence; only the text-heavy information rail is throttled.
frame=function(now){
  const frameStart=performance.now(),raw=(now-last)/1000;last=now;
  if(!paused){let remaining=Math.min(.12,raw*speed);while(remaining>0){const dt=Math.min(MAX_DT,remaining);update(dt);remaining-=dt}}
  draw();if(now>=v351NextUiAt){updateUI();v351NextUiAt=now+V351_UI_INTERVAL_MS;v351Perf.uiUpdates++}
  v351Perf.frames++;v351FrameWindowCount++;v351Perf.lastFrameMs=performance.now()-frameStart;v351Perf.maxFrameMs=Math.max(v351Perf.maxFrameMs,v351Perf.lastFrameMs);
  if(now-v351FrameWindowStart>=1000){v351Perf.lastFps=v351FrameWindowCount*1000/Math.max(1,now-v351FrameWindowStart);v351FrameWindowStart=now;v351FrameWindowCount=0}
  requestAnimationFrame(frame)
};

function v351PerformanceSnapshot(){return{
  patch:'v3.5-target-cache-hotfix',rootCause:'shield-aware targeting previously sorted full enemy pools and rescanned the full pool inside every comparator',
  complexity:'one shield index per simulation step; single-pass target minima; actor/mode result cache within the step',uiIntervalMs:V351_UI_INTERVAL_MS,
  livingActors:actors.filter(a=>a.alive).length,targetEpoch:v351TargetEpoch,...v351Perf
}}
function v351ResetPerformance(){for(const key of Object.keys(v351Perf))v351Perf[key]=0;v351FrameWindowStart=performance.now();v351FrameWindowCount=0;v351NextUiAt=0;v351TargetingActive=false;v351TargetEpoch=0;v351ResetTargetCaches()}
const v351BaseReset=reset;
reset=function(fixedSeed=null){v351ResetPerformance();const out=v351BaseReset(fixedSeed);updateUI();return out};
window.__battleSim.reset=reset;document.getElementById('restartBtn').onclick=()=>reset();
const v351BaseState=window.__battleSim.state;
window.__battleSim.state=()=>{const state=v351BaseState();state.performance=v351PerformanceSnapshot();return state};
const v351BasePayload=currentDiagnosticPayload;
currentDiagnosticPayload=function(){const payload=v351BasePayload();payload.performance=v351PerformanceSnapshot();return payload};
exportCurrentState=function(){const payload=currentDiagnosticPayload(),t=Math.floor(simTime),name=`musketeer-state-v3.5.0-seed-${seed>>>0}-war-${warNumber}-t-${t}s.json`;downloadJson(name,payload);return payload};
window.__battleSim.exportState=exportCurrentState;window.__battleSim.diagnosticPayload=currentDiagnosticPayload;window.GameTest.exportPayload=currentDiagnosticPayload;const v351ExportButton=document.getElementById('exportStateBtn');if(v351ExportButton)v351ExportButton.onclick=exportCurrentState;
Object.assign(window.__battleSim.test,{screenedTargetScore,chooseScreenedTarget,enemyOf,combatEnemy,siegeEnemy,breachEnemy,updateActors,v351BuildTargetIndex,v351PerformanceSnapshot,v351ResetPerformance});window.GameTest.state=()=>window.__battleSim.state();
document.title='Musketeer Battle Simulator — Phase 4 v3.5 Performance Hotfix';
