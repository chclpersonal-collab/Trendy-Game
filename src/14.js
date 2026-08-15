'use strict';
// v3.4 verification correction: protect early rank ecology from training spend and stop mature sieges
// from repeatedly expiring before the spearhead can cross the defended final approach.
const V34_TRAINING_MATURITY=900,V34_LONG_WAR_COMMIT=420;
const v34BaseTryArmyTraining=tryArmyTraining;
tryArmyTraining=function(team){if(currentWarAge()<V34_TRAINING_MATURITY)return false;return v34BaseTryArmyTraining(team)};
const v34BaseEnterLongWarSiege=enterLongWarSiege;
enterLongWarSiege=function(team){const entered=v34BaseEnterLongWarSiege(team);if(entered){const g=generals[team];g.siegeCommit=Math.max(g.siegeCommit||0,V34_LONG_WAR_COMMIT)}return entered};
const v34BaseGeneralDecision=generalDecision;
generalDecision=function(team){const out=v34BaseGeneralDecision(team),g=generals[team];if(warWinner===-1&&currentWarAge()>=V34_TRAINING_MATURITY&&g.stance==='SIEGE')g.siegeCommit=Math.max(g.siegeCommit||0,V34_LONG_WAR_COMMIT);return out};
const v34CorrectedState=window.__battleSim.state;
window.__battleSim.state=()=>{const state=v34CorrectedState();state.statTraining.aiMaturitySeconds=V34_TRAINING_MATURITY;state.siegeResolution.longWarCommitSeconds=V34_LONG_WAR_COMMIT;state.siegeResolution.matureSiegePolicy='any General decision that remains SIEGE after 900s retains the mature-war commitment; normal strategy can still abort to DEFEND/CONTEST';return state};
Object.assign(window.__battleSim.test,{tryArmyTraining,enterLongWarSiege,generalDecision});window.GameTest.state=()=>window.__battleSim.state();
// Phase 4 v3.5 — ranked economy, HP/mana/range profiles, and layered shielding.
// This is a deliberately large, user-authorized economy contract change. Only F/E/D/C remain unlocked;
// later ranks receive authoritative profiles and prices now so future phases share one data model.
const V35_VERSION='3.5.0',V35_BAYONET_MANA_COST=8,V35_VOLLEY_MANA_COST=3;
const V35_RANK_ORDER=['F','E','D','C','B','A','S','SS','SSS','SSS+','SSS+ Type I','SSS+ Type II','SSS+ Type III','SSS+ Type IV','SSS+ Type V'];
const V35_RANK_PROFILES={
 F:{cost:15,hp:100,mana:0,manaRegen:0,range:205,screenOffset:30,promotionXP:0},
 E:{cost:30,hp:115,mana:24,manaRegen:.40,range:220,screenOffset:22,promotionXP:4},
 D:{cost:45,hp:135,mana:36,manaRegen:.55,range:235,screenOffset:14,promotionXP:10},
 C:{cost:60,hp:160,mana:52,manaRegen:.75,range:250,screenOffset:6,promotionXP:18},
 B:{cost:75,hp:190,mana:70,manaRegen:.95,range:265,screenOffset:-4,promotionXP:28},
 A:{cost:90,hp:225,mana:90,manaRegen:1.15,range:280,screenOffset:-14,promotionXP:40},
 S:{cost:150,hp:280,mana:120,manaRegen:1.45,range:300,screenOffset:-26,promotionXP:55},
 SS:{cost:300,hp:360,mana:160,manaRegen:1.85,range:325,screenOffset:-38,promotionXP:75},
 SSS:{cost:450,hp:460,mana:210,manaRegen:2.30,range:350,screenOffset:-50,promotionXP:100},
 'SSS+':{cost:600,hp:600,mana:280,manaRegen:2.90,range:380,screenOffset:-62,promotionXP:130},
 'SSS+ Type I':{cost:750,hp:760,mana:360,manaRegen:3.60,range:410,screenOffset:-74,promotionXP:165},
 'SSS+ Type II':{cost:900,hp:950,mana:460,manaRegen:4.50,range:445,screenOffset:-86,promotionXP:205},
 'SSS+ Type III':{cost:1500,hp:1250,mana:620,manaRegen:6.00,range:485,screenOffset:-100,promotionXP:250},
 'SSS+ Type IV':{cost:3000,hp:1750,mana:900,manaRegen:8.50,range:535,screenOffset:-115,promotionXP:300},
 'SSS+ Type V':{cost:15000,hp:3000,mana:1600,manaRegen:14.00,range:620,screenOffset:-135,promotionXP:400}
};
for(const rank of V35_RANK_ORDER){RANK_PRICE[rank]=V35_RANK_PROFILES[rank].cost;RANK_XP_FLOOR[rank]=V35_RANK_PROFILES[rank].promotionXP}

function rankProfileOf(a){const rank=typeof a==='string'?a:classOf(a);return V35_RANK_PROFILES[rank]||V35_RANK_PROFILES.F}
rankScoreOf=function(a){const rank=typeof a==='string'?a:classOf(a),i=V35_RANK_ORDER.indexOf(rank);return i<0?1:i+1};
rankLabelXP=function(xp){let rank='F';for(const name of V35_RANK_ORDER)if(PURCHASABLE_RANKS.includes(name)&&xp>=(V35_RANK_PROFILES[name].promotionXP||0))rank=name;return `${rank}·${Math.max(0,xp-(V35_RANK_PROFILES[rank].promotionXP||0))}`};
function rankRangeOf(a){return rankProfileOf(a).range}
function ensureRankVitals(a,fill=false){
 if(!a||a.isCommander)return a;
 const p=rankProfileOf(a),oldMax=Number.isFinite(a.maxHp)?a.maxHp:p.hp;
 a.maxHp=p.hp;a.maxMana=p.mana;
 if(fill||!Number.isFinite(a.hp))a.hp=p.hp;else a.hp=Math.max(0,Math.min(p.hp,a.hp+(p.hp-oldMax)));
 if(fill||!Number.isFinite(a.mana))a.mana=p.mana;else a.mana=Math.max(0,Math.min(p.mana,a.mana));
 return a
}

const v35BaseBuyMusketeer=buyMusketeer;
buyMusketeer=function(team,rank='F',free=false){const a=v35BaseBuyMusketeer(team,rank,free);if(a)ensureRankVitals(a,true);return a};
const v35BaseAwardKill=awardKill;
awardKill=function(killer,victim,method='musket'){
 if(!killer||killer.isCommander)return v35BaseAwardKill(killer,victim,method);
 ensureRankVitals(killer,false);const oldRank=classOf(killer),oldProfile=rankProfileOf(oldRank),oldHp=killer.hp,oldMana=killer.mana;
 const out=v35BaseAwardKill(killer,victim,method),newProfile=rankProfileOf(killer),promoted=classOf(killer)!==oldRank;
 killer.maxHp=newProfile.hp;killer.maxMana=newProfile.mana;
 killer.hp=Math.min(newProfile.hp,Math.min(oldProfile.hp,oldHp+XP_HEAL)+(promoted?Math.max(0,newProfile.hp-oldProfile.hp):0));
 killer.mana=Math.min(newProfile.mana,oldMana+(promoted?Math.max(0,newProfile.mana-oldProfile.mana):0));
 return out
};

const v35BaseBeginCharge=beginCharge;
beginCharge=function(a,target){
 ensureRankVitals(a,false);if(!a||a.isCommander||!rankAtLeast(a,'E')||a.mana<V35_BAYONET_MANA_COST)return false;
 const started=v35BaseBeginCharge(a,target);if(started)a.mana=Math.max(0,a.mana-V35_BAYONET_MANA_COST);return started
};
const v35BaseFire=fire;
fire=function(a,target,d,volley=false){
 ensureRankVitals(a,false);let formalVolley=volley;
 if(volley&&rankAtLeast(a,'C')){if(a.mana<V35_VOLLEY_MANA_COST)formalVolley=false;else a.mana=Math.max(0,a.mana-V35_VOLLEY_MANA_COST)}
 return v35BaseFire(a,target,d,formalVolley)
};

// Economy v2: purchase price + flat income + kill bounty. Soldier maintenance and rank-quality income are removed.
incomeRate=function(team){return PASSIVE_INCOME+(fortresses[team].rank==='E'?E_FORT_INCOME_BONUS:0)};
upkeepRate=function(){return 0};
upkeepPressure=function(){return 0};
netIncomeRate=function(team){return incomeRate(team)};

const V35_SHIELD_DEPTH=125,V35_SHIELD_LANE=90,V35_SHIELD_PENALTY=260;
function screenedTargetScore(attacker,target,pool){
 const d=Math.hypot(target.x-attacker.x,target.y-attacker.y),dir=attacker.team===0?1:-1,targetForward=(target.x-attacker.x)*dir,targetRank=rankScoreOf(target);let penalty=0;
 if(!target.isCommander&&targetForward>0)for(const shield of pool){
  if(shield===target||shield.isCommander||rankScoreOf(shield)>=targetRank)continue;
  const shieldForward=(shield.x-attacker.x)*dir,gap=targetForward-shieldForward;
  if(shieldForward>=-12&&gap>0&&gap<=V35_SHIELD_DEPTH&&Math.abs(shield.y-target.y)<=V35_SHIELD_LANE)penalty=Math.max(penalty,V35_SHIELD_PENALTY+(targetRank-rankScoreOf(shield))*18)
 }
 return d+penalty+(target.isCommander?35:0)
}
function chooseScreenedTarget(attacker,pool){if(!pool.length)return null;return [...pool].sort((x,y)=>screenedTargetScore(attacker,x,pool)-screenedTargetScore(attacker,y,pool)||x.id-y.id)[0]}
enemyOf=function(a){return chooseScreenedTarget(a,actors.filter(e=>e.alive&&e.team!==a.team))};
combatEnemy=function(a){const pool=actors.filter(e=>e.alive&&e.team!==a.team),rear=pool.filter(e=>rearThreat(a,e));return chooseScreenedTarget(a,rear.length?rear:pool)};
siegeEnemy=function(a){
 const pool=actors.filter(e=>e.alive&&e.team!==a.team&&!e.isCommander&&Math.hypot(e.x-a.x,e.y-a.y)<=REAR_ALERT_RANGE),rear=pool.filter(e=>rearThreat(a,e)),commander=actors.filter(e=>e.alive&&e.team!==a.team&&e.isCommander&&Math.hypot(e.x-a.x,e.y-a.y)<=92);
 return chooseScreenedTarget(a,rear.length?rear:pool)||chooseScreenedTarget(a,commander)
};
breachEnemy=function(a){
 const pool=actors.filter(e=>e.alive&&e.team!==a.team&&Math.hypot(e.x-a.x,e.y-a.y)<=BREACH_THREAT_RANGE),rear=pool.filter(e=>rearThreat(a,e)&&Math.hypot(e.x-a.x,e.y-a.y)<=BREACH_REAR_EMERGENCY_RANGE);
 return chooseScreenedTarget(a,rear.length?rear:pool)
};
function applyRankScreenFormation(a,dt){
 if(!a||!a.alive||a.isCommander||a.rejoining||a.chargeTimer>0||(a.disarm||0)>0||(a.panic||0)>0)return;
 const c=companyFor(a.team,a.company),authority=c&&activeCommandSource(c);if(!c||!authority||['SIEGE','BREACH','CHARGE','TURN','RALLY','REGROUP'].includes(c.command))return;
 const e=combatEnemy(a);if(e&&Math.hypot(e.x-a.x,e.y-a.y)<85)return;
 const center=companyCenter(a.team,a.company);if(!center)return;const dir=a.team===0?1:-1,target=center.x+dir*rankProfileOf(a).screenOffset;
 a.x=approachValue(a.x,target,10,dt);a.x=Math.max(28,Math.min(W-28,a.x))
}
const v35BaseUpdateMusketeer=updateMusketeer;
updateMusketeer=function(a,dt){
 v35BaseUpdateMusketeer(a,dt);if(!a||!a.alive)return;ensureRankVitals(a,false);applyRankScreenFormation(a,dt);
 if(a.reload>0||a.rejoining||(a.disarm||0)>0||(a.panic||0)>0||a.chargeTimer>0||!soldierCommander(a))return;
 const c=companyFor(a.team,a.company),command=c?.command||'NO COMMAND';if(command==='VOLLEY'&&c?.volleyTimer>0)return;const e=command==='BREACH'?breachEnemy(a):command==='SIEGE'?siegeEnemy(a):combatEnemy(a),range=rankRangeOf(a);
 if(e){const d=Math.hypot(e.x-a.x,e.y-a.y);if(d>BASE_RANGE&&d<=range)fire(a,e,d);return}
 const fort=fortresses[1-a.team],d=Math.abs(fort.x-a.x);if((command==='SIEGE'||command==='BREACH')&&d>FORT_ATTACK_RANGE&&d<=range)fireFortress(a,fort,d)
};
const v35BaseUpdateActors=updateActors;
updateActors=function(dt){for(const a of actors)if(a.alive&&!a.isCommander){ensureRankVitals(a,false);const p=rankProfileOf(a);a.mana=Math.min(a.maxMana,a.mana+p.manaRegen*dt)}v35BaseUpdateActors(dt)};

const v35BaseActorDiagnostic=actorDiagnostic;
actorDiagnostic=function(a){const d=v35BaseActorDiagnostic(a);if(a&&!a.isCommander){ensureRankVitals(a,false);d.maxHp=a.maxHp;d.mana=+a.mana.toFixed(2);d.maxMana=a.maxMana;d.range=rankRangeOf(a)}return d};
const v35BasePayload=currentDiagnosticPayload;
currentDiagnosticPayload=function(){const p=v35BasePayload();p.version=V35_VERSION;p.state=window.__battleSim.state();p.economyRevision='zero-maintenance-ranked-economy';return p};
exportCurrentState=function(){const payload=currentDiagnosticPayload(),t=Math.floor(simTime),name=`musketeer-state-v${V35_VERSION}-seed-${seed>>>0}-war-${warNumber}-t-${t}s.json`;downloadJson(name,payload);return payload};

const v35BaseState=window.__battleSim.state;
window.__battleSim.state=()=>{
 const state=v35BaseState();state.version='3.5';state.phase=4;state.patchVersion=V35_VERSION;state.rework='ranked-economy-hp-mana-range-screening';
 state.economy.rankPrices=Object.fromEntries(V35_RANK_ORDER.map(r=>[r,RANK_PRICE[r]]));state.economy.purchasableRanks=[...PURCHASABLE_RANKS];state.economy.upkeepRate=0;state.economy.upkeepRates=[0,0];state.economy.netIncomeRates=[netIncomeRate(0),netIncomeRate(1)];state.economy.incomeRates=[incomeRate(0),incomeRate(1)];state.economy.maintenanceRemoved=true;state.economy.rankQualityIncomeRemoved=true;state.economy.incomeFormula='gross = flat passive income + fortress bonus; net = gross; kills pay 50% of defeated rank purchase price; soldiers have no recurring maintenance cost';
 state.rankSystem={order:[...V35_RANK_ORDER],unlocked:[...PURCHASABLE_RANKS],futureRanksLocked:true,correctedFinalRank:'SSS+ Type V',profiles:Object.fromEntries(V35_RANK_ORDER.map(r=>[r,{...V35_RANK_PROFILES[r]}])),manaUses:{bayonetCharge:V35_BAYONET_MANA_COST,formalVolleyShot:V35_VOLLEY_MANA_COST,basicMusket:0},shielding:{lowerRanksForward:true,targetScreenDepth:V35_SHIELD_DEPTH,targetScreenLane:V35_SHIELD_LANE,formationExcludedOrders:['SIEGE','BREACH','CHARGE','TURN','RALLY','REGROUP']},rangePolicy:'each higher rank has a strictly longer musket and organized fortress-fire range'};
 state.classProgression.futurePolicy='every unlocked rank may be bought or earned; future ranks remain locked to their roadmap phase even though their economy/HP/mana/range profiles are defined';
 return state
};
const v35BaseValidate=window.GameTest.validate;
window.GameTest.validate=()=>{const v=v35BaseValidate(),invalidRankVitals=actors.some(a=>a.alive&&!a.isCommander&&(!V35_RANK_PROFILES[classOf(a)]||!Number.isFinite(a.hp)||!Number.isFinite(a.maxHp)||a.hp<-.001||a.hp>a.maxHp+.001||!Number.isFinite(a.mana)||!Number.isFinite(a.maxMana)||a.mana<-.001||a.mana>a.maxMana+.001));return{...v,invalidRankVitals,ok:v.ok&&!invalidRankVitals,patchVersion:V35_VERSION}};

Object.assign(window.__battleSim.test,{buyMusketeer,awardKill,beginCharge,fire,updateMusketeer,updateActors,enemyOf,combatEnemy,siegeEnemy,breachEnemy,rankProfileOf,rankRangeOf,ensureRankVitals,screenedTargetScore,chooseScreenedTarget,applyRankScreenFormation,incomeRate,upkeepRate,upkeepPressure,netIncomeRate});
window.__battleSim.exportState=exportCurrentState;window.__battleSim.diagnosticPayload=currentDiagnosticPayload;window.GameTest.state=()=>window.__battleSim.state();window.GameTest.exportPayload=currentDiagnosticPayload;
const exportButton=document.getElementById('exportStateBtn');if(exportButton)exportButton.onclick=exportCurrentState;
const upkeepLabel=document.querySelector('#upkeepStat span:first-child');if(upkeepLabel){upkeepLabel.textContent='Maintenance / s';upkeepLabel.title='Soldiers have no recurring maintenance cost in v3.5.'}
document.title='Musketeer Battle Simulator — Phase 4 v3.5';const v35Badge=document.querySelector('.version');if(v35Badge)v35Badge.textContent='v3.5';
updateUI();
