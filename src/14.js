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

'use strict';
// Phase 4 v3.4.3 economy/rank foundation candidate — rank resources, zero maintenance, ranged screens.
// Public release metadata remains v3.4.0 until export-led balance verification accepts this system.
const V35_ECONOMY_ID='rank-resources-zero-maintenance-v1';
const V35_FREE_RANGE=BASE_RANGE,V35_RANGE_MANA_STEP=50,V35_SHIELD_LANE=70;
const V35_RANK_ORDER=['F','E','D','C','B','A','S','SS','SSS','SSS+','SSS+ Type I','SSS+ Type II','SSS+ Type III','SSS+ Type IV','SSS+ Type V'];
const V35_RANK_PROFILES={
 F:{cost:15,hp:100,mana:20,range:215,manaRegen:.12,role:'line shield'},
 E:{cost:30,hp:115,mana:30,range:230,manaRegen:.16,role:'veteran shield'},
 D:{cost:45,hp:130,mana:42,range:245,manaRegen:.20,role:'assault support'},
 C:{cost:60,hp:145,mana:55,range:260,manaRegen:.24,role:'volley support'},
 B:{cost:75,hp:165,mana:70,range:275,manaRegen:.28,role:'protected marksman'},
 A:{cost:90,hp:190,mana:90,range:290,manaRegen:.32,role:'protected marksman'},
 S:{cost:150,hp:230,mana:120,range:315,manaRegen:.40,role:'elite rear line'},
 SS:{cost:300,hp:290,mana:170,range:345,manaRegen:.50,role:'elite rear line'},
 SSS:{cost:450,hp:360,mana:230,range:380,manaRegen:.62,role:'strategic rear line'},
 'SSS+':{cost:600,hp:450,mana:310,range:420,manaRegen:.76,role:'strategic rear line'},
 'SSS+ Type I':{cost:750,hp:560,mana:400,range:460,manaRegen:.92,role:'specialist rear line'},
 'SSS+ Type II':{cost:900,hp:700,mana:510,range:505,manaRegen:1.10,role:'specialist rear line'},
 'SSS+ Type III':{cost:1500,hp:900,mana:680,range:560,manaRegen:1.35,role:'siege specialist'},
 'SSS+ Type IV':{cost:3000,hp:1250,mana:950,range:635,manaRegen:1.70,role:'siege specialist'},
 'SSS+ Type V':{cost:15000,hp:2200,mana:1800,range:750,manaRegen:2.50,role:'final strategic unit'}
};
for(const rank of V35_RANK_ORDER)RANK_PRICE[rank]=V35_RANK_PROFILES[rank].cost;

const v35RankScoreOf=rankScoreOf;
rankScoreOf=function(a){const rank=typeof a==='string'?a:classOf(a),index=V35_RANK_ORDER.indexOf(rank);return index>=0?index+1:v35RankScoreOf(a)};
function rankProfileOf(a){const rank=typeof a==='string'?a:classOf(a);return V35_RANK_PROFILES[rank]||V35_RANK_PROFILES.F}
function syncRankResources(a,refill=false){
 if(!a||a.isCommander)return a;
 const rank=classOf(a),p=rankProfileOf(rank),oldMaxHp=Number.isFinite(a.maxHp)?a.maxHp:100,oldMaxMana=Number.isFinite(a.maxMana)?a.maxMana:0,changed=a.resourceRank!==rank;
 a.maxHp=p.hp;a.maxMana=p.mana;a.resourceRank=rank;
 if(refill||!Number.isFinite(a.hp))a.hp=p.hp;else if(changed)a.hp=Math.min(p.hp,Math.max(0,a.hp)+Math.max(0,p.hp-oldMaxHp));else a.hp=Math.min(p.hp,Math.max(0,a.hp));
 if(refill||!Number.isFinite(a.mana))a.mana=p.mana;else if(changed)a.mana=Math.min(p.mana,Math.max(0,a.mana)+Math.max(0,p.mana-oldMaxMana));else a.mana=Math.min(p.mana,Math.max(0,a.mana));
 return a
}
function rankAttackRange(a){return a&&a.isCommander?BASE_RANGE:rankProfileOf(a).range}
function rangedManaCost(a,d){if(!a||a.isCommander||d<=V35_FREE_RANGE)return 0;return Math.max(1,Math.ceil((d-V35_FREE_RANGE)/V35_RANGE_MANA_STEP))}
function hasRangedMana(a,d){syncRankResources(a,false);return !a||a.isCommander||a.mana+1e-9>=rangedManaCost(a,d)}
function spendRangedMana(a,d){const cost=rangedManaCost(a,d);if(a&&!a.isCommander&&cost>0)a.mana=Math.max(0,a.mana-cost);return cost}

const v35BaseBuyMusketeer=buyMusketeer;
buyMusketeer=function(team,rank='F',free=false){const a=v35BaseBuyMusketeer(team,rank,free);if(a)syncRankResources(a,true);return a};
const v35BaseAwardKill=awardKill;
awardKill=function(killer,victim,method='musket'){
 if(!killer)return v35BaseAwardKill(killer,victim,method);
 syncRankResources(killer,false);const beforeHp=killer.hp,beforeMana=killer.mana,beforeMaxMana=killer.maxMana,healingBefore=healingDone[killer.team];
 const out=v35BaseAwardKill(killer,victim,method);const afterRank=classOf(killer),p=rankProfileOf(afterRank),promotionMana=Math.max(0,p.mana-beforeMaxMana),desiredHp=Math.min(p.hp,beforeHp+XP_HEAL);
 killer.maxHp=p.hp;killer.hp=desiredHp;killer.maxMana=p.mana;killer.mana=Math.min(p.mana,beforeMana+promotionMana);killer.resourceRank=afterRank;healingDone[killer.team]=healingBefore+Math.max(0,desiredHp-beforeHp);return out
};

function segmentDistance(ax,ay,bx,by,px,py){const dx=bx-ax,dy=by-ay,l2=dx*dx+dy*dy;if(l2<=1e-9)return{distance:Math.hypot(px-ax,py-ay),t:0};const t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/l2)),x=ax+t*dx,y=ay+t*dy;return{distance:Math.hypot(px-x,py-y),t}}
function findShieldingTarget(attacker,target){
 if(!attacker||!target||target.isCommander)return target;
 const targetScore=rankScoreOf(target);if(targetScore<=1)return target;
 let shield=null,bestT=2;
 for(const ally of actors){
  if(!ally.alive||ally.isCommander||ally.team!==target.team||ally.id===target.id||rankScoreOf(ally)>=targetScore)continue;
  const line=segmentDistance(attacker.x,attacker.y,target.x,target.y,ally.x,ally.y);
  if(line.t<=.08||line.t>=.92||line.distance>V35_SHIELD_LANE)continue;
  if(line.t<bestT){bestT=line.t;shield=ally}
 }
 return shield||target
}
const shieldingInterceptions=[0,0];
const v35BaseFire=fire;
fire=function(a,target,d,volley=false){
 const actual=findShieldingTarget(a,target),actualD=actual?Math.hypot(actual.x-a.x,actual.y-a.y):d;
 if(!a.isCommander&&actualD>rankAttackRange(a)+1e-9)return false;
 if(!hasRangedMana(a,actualD))return false;
 const fired=v35BaseFire(a,actual,actualD,volley);
 if(fired){spendRangedMana(a,actualD);if(actual&&target&&actual.id!==target.id)shieldingInterceptions[actual.team]++}
 return fired
};
const v35BaseFireFortress=fireFortress;
fireFortress=function(a,fort,d){if(!a.isCommander&&d>rankAttackRange(a)+1e-9)return false;if(!hasRangedMana(a,d))return false;const fired=v35BaseFireFortress(a,fort,d);if(fired)spendRangedMana(a,d);return fired};

const V35_EXTENDED_FIRE_ORDERS=new Set(['ADVANCE','HOLD','DEFEND','SIEGE','BREACH','TURN']);
const v35BaseUpdateMusketeer=updateMusketeer;
updateMusketeer=function(a,dt){
 v35BaseUpdateMusketeer(a,dt);if(!a.alive||a.reload>0||(a.disarm||0)>0||a.panic>0||a.chargeTimer>0)return;
 syncRankResources(a,false);const c=companyFor(a.team,a.company),command=c?.command||'NO COMMAND';if(!V35_EXTENDED_FIRE_ORDERS.has(command)||!soldierCommander(a))return;
 const maxRange=rankAttackRange(a);if(maxRange<=BASE_RANGE)return;
 const enemy=combatEnemy(a),enemyD=enemy?Math.hypot(enemy.x-a.x,enemy.y-a.y):Infinity;
 if(enemy&&enemyD>BASE_RANGE&&enemyD<=maxRange){fire(a,enemy,enemyD);return}
 if(command==='SIEGE'||command==='BREACH'){const fort=fortresses[1-a.team],fortD=Math.abs(fort.x-a.x);if(fortD>FORT_ATTACK_RANGE&&fortD<=maxRange&&(enemyD>maxRange||!enemy))fireFortress(a,fort,fortD)}
};
const v35BaseUpdateActors=updateActors;
updateActors=function(dt){for(const a of actors)if(a.alive&&!a.isCommander){syncRankResources(a,false);const p=rankProfileOf(a);a.mana=Math.min(a.maxMana,a.mana+p.manaRegen*dt)}v35BaseUpdateActors(dt)};

incomeRate=function(team){return PASSIVE_INCOME+(fortresses[team].rank==='E'?E_FORT_INCOME_BONUS:0)};
upkeepRate=function(){return 0};
netIncomeRate=function(team){return incomeRate(team)};
upkeepPressure=function(){return 0};

function teamResourceTotals(team){const men=activeMusketeers(team);return men.reduce((r,a)=>{syncRankResources(a,false);r.hp+=Math.max(0,a.hp);r.maxHp+=a.maxHp;r.mana+=a.mana;r.maxMana+=a.maxMana;return r},{hp:0,maxHp:0,mana:0,maxMana:0})}
function ensureV35UI(){
 const anchor=document.getElementById('reloadingStat');if(anchor&&!document.getElementById('hpPoolStat')){const hp=document.createElement('div'),mana=document.createElement('div');hp.className=mana.className='metric';hp.id='hpPoolStat';mana.id='manaPoolStat';hp.innerHTML='<span>Total HP</span><span data-side="left">0/0</span><span data-side="right">0/0</span>';mana.innerHTML='<span>Mana</span><span data-side="left">0/0</span><span data-side="right">0/0</span>';anchor.parentNode.insertBefore(hp,anchor);anchor.parentNode.insertBefore(mana,anchor)}
 const upkeep=document.querySelector('#upkeepStat span:first-child'),paid=document.querySelector('#upkeepPaidStat span:first-child');if(upkeep)upkeep.textContent='Maintenance / s';if(paid)paid.textContent='Maintenance paid';const pricing=document.getElementById('pricingStat');if(pricing)pricing.textContent='Rank table v1'
}
const v35BaseUpdateUI=updateUI;
updateUI=function(){v35BaseUpdateUI();ensureV35UI();const left=teamResourceTotals(0),right=teamResourceTotals(1);setPair('hpPoolStat',`${Math.round(left.hp)}/${left.maxHp}`,`${Math.round(right.hp)}/${right.maxHp}`);setPair('manaPoolStat',`${Math.round(left.mana)}/${left.maxMana}`,`${Math.round(right.mana)}/${right.maxMana}`)};

const v35BaseState=window.__battleSim.state;
window.__battleSim.state=()=>{const state=v35BaseState(),profiles=Object.fromEntries(V35_RANK_ORDER.map(rank=>[rank,{...V35_RANK_PROFILES[rank]}]));state.economy.rankPrices=Object.fromEntries(V35_RANK_ORDER.map(rank=>[rank,RANK_PRICE[rank]]));state.economy.upkeepRate=0;state.economy.upkeepRates=[0,0];state.economy.netIncomeRates=[incomeRate(0),incomeRate(1)];state.economy.incomeRates=[incomeRate(0),incomeRate(1)];state.economy.incomeFormula='gross = base passive income + fortress bonus; net = gross; soldier maintenance = $0';state.economy.noSoldierMaintenance=true;state.economy.rankIncomeBonus=false;state.economy.revision=V35_ECONOMY_ID;state.economy.candidateVersion='3.4.3';state.classProgression.rankProfiles=profiles;state.classProgression.locked=V35_RANK_ORDER.filter(x=>!PURCHASABLE_RANKS.includes(x));state.classProgression.correctedFinalRank='SSS+ Type V';state.rankResources={candidateVersion:'3.4.3',revision:V35_ECONOMY_ID,freeFireRange:V35_FREE_RANGE,rangeManaStep:V35_RANGE_MANA_STEP,totals:[teamResourceTotals(0),teamResourceTotals(1)],shieldingInterceptions:[...shieldingInterceptions],shieldDoctrine:'lower-rank musketeers physically between a shooter and a higher-rank ally intercept musket fire',extendedRangeRequiresMana:true};state.command.shieldDoctrine=state.rankResources.shieldDoctrine;return state};

const v35BaseDiagnosticPayload=currentDiagnosticPayload;
currentDiagnosticPayload=function(){const payload=v35BaseDiagnosticPayload();payload.candidateVersion='3.4.3';payload.economyRevision=V35_ECONOMY_ID;payload.rankSystem={profiles:Object.fromEntries(V35_RANK_ORDER.map(rank=>[rank,{...V35_RANK_PROFILES[rank]}])),unlocked:[...PURCHASABLE_RANKS],locked:V35_RANK_ORDER.filter(x=>!PURCHASABLE_RANKS.includes(x)),freeFireRange:V35_FREE_RANGE,shieldingInterceptions:[...shieldingInterceptions],noSoldierMaintenance:true};for(const entry of payload.actors){const a=actors.find(x=>x.id===entry.id);if(!a||a.isCommander)continue;syncRankResources(a,false);entry.maxHp=a.maxHp;entry.mana=+a.mana.toFixed(2);entry.maxMana=a.maxMana;entry.attackRange=rankAttackRange(a);entry.rankRole=rankProfileOf(a).role}return payload};
window.__battleSim.diagnosticPayload=currentDiagnosticPayload;window.GameTest.exportPayload=currentDiagnosticPayload;

const v35BaseValidate=window.GameTest.validate;
window.GameTest.validate=()=>{const v=v35BaseValidate(),invalidRankResources=actors.some(a=>a.alive&&!a.isCommander&&(()=>{const p=rankProfileOf(a);return !Number.isFinite(a.maxHp)||a.maxHp!==p.hp||!Number.isFinite(a.hp)||a.hp<-.001||!Number.isFinite(a.maxMana)||a.maxMana!==p.mana||!Number.isFinite(a.mana)||a.mana<-.001||a.mana>a.maxMana+.001})()),invalidEconomy=Math.abs(upkeepRate(0))>.001||V35_RANK_ORDER.some(rank=>RANK_PRICE[rank]!==V35_RANK_PROFILES[rank].cost);return{...v,invalidRankResources,invalidEconomy,ok:v.ok&&!invalidRankResources&&!invalidEconomy}};

const v35BaseReset=reset;
reset=function(fixedSeed=null){shieldingInterceptions[0]=shieldingInterceptions[1]=0;const out=v35BaseReset(fixedSeed);updateUI();return out};
window.__battleSim.reset=reset;document.getElementById('restartBtn').onclick=()=>reset();
Object.assign(window.__battleSim.test,{buyMusketeer,awardKill,fire,fireFortress,updateMusketeer,updateActors,incomeRate,upkeepRate,netIncomeRate,upkeepPressure,rankScoreOf,rankProfileOf,rankAttackRange,rangedManaCost,hasRangedMana,spendRangedMana,syncRankResources,findShieldingTarget,teamResourceTotals,rankProfiles:()=>V35_RANK_PROFILES,rankOrder:()=>[...V35_RANK_ORDER],shieldingInterceptions:()=>[...shieldingInterceptions]});
window.GameTest.state=()=>window.__battleSim.state();ensureV35UI();updateUI();