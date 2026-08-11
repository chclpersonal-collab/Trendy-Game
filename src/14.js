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

// Phase 4 v3.4.1 — BREACH reinforcement priority.
// The playtest export showed viable spearheads repeatedly capped below the SIEGE company band while depleted
// rear companies absorbed replacement purchases. Only newly purchased soldiers are redirected; live soldiers
// are never transferred between companies.
const V341_BREACH_REINFORCE_TARGET=12,V341_BREACH_REINFORCE_MAX_PRESSURE=.98;
const v341BreachReinforcementPurchases=[0,0];
function activeBreachReinforcement(team){
 const g=generals[team];
 if(warWinner!==-1||g.stance!=='SIEGE'||activeMusketeers(team).length>=MAX_MUSKETEERS)return null;
 const c=companyFor(team,g.breachCompanyId);
 if(!assignedBreachStillViable(team,c))return null;
 const men=companyMusketeers(team,c.id).length;
 if(men>=V341_BREACH_REINFORCE_TARGET||men>=MAX_PER_COMMANDER)return null;
 return{g,c,men}
}
function breachReinforcementNeeded(team){return !!activeBreachReinforcement(team)}
function breachReinforcementCompany(team){
 const need=activeBreachReinforcement(team);if(!need)return null;
 const{c,men}=need;
 if(c.targetSize<=men){const next=Math.min(V341_BREACH_REINFORCE_TARGET,MAX_PER_COMMANDER,men+1);if(next<=c.targetSize)return null;c.targetSize=next;c.sizeChanges=(c.sizeChanges||0)+1}
 return c
}
const v34CompanyWithRoom=companyWithRoom;
companyWithRoom=function(team){return breachReinforcementCompany(team)||v34CompanyWithRoom(team)};
const v34BuyMusketeer=buyMusketeer;
buyMusketeer=function(team,rank='F',free=false){
 const need=activeBreachReinforcement(team),breachId=need?need.c.id:-1,paid=!(typeof rank==='boolean'?rank:free),a=v34BuyMusketeer(team,rank,free);
 if(a&&paid&&a.company===breachId)v341BreachReinforcementPurchases[team]++;
 return a
};
function tryBreachReinforcement(team){
 const need=activeBreachReinforcement(team);if(!need)return false;
 const{g}=need,cost=RANK_PRICE.F,reserve=Math.max(BASE_WAR_CHEST,g.reserveTarget||0);
 if(fieldworkMusterBlocked(team)||upkeepPressure(team)>=V341_BREACH_REINFORCE_MAX_PRESSURE||g.money<reserve+cost)return false;
 const a=buyMusketeer(team,'F');if(!a||a.company!==need.c.id)return false;
 g.budgetPlan='REINFORCE BREACH';return a
}
const v34MatureTryArmyTraining=tryArmyTraining;
tryArmyTraining=function(team){if(breachReinforcementNeeded(team))return false;return v34MatureTryArmyTraining(team)};
const v34CommittedGeneralDecision=generalDecision;
generalDecision=function(team){
 const before=v341BreachReinforcementPurchases[team],out=v34CommittedGeneralDecision(team);
 if(warWinner===-1&&breachReinforcementNeeded(team)&&v341BreachReinforcementPurchases[team]===before)tryBreachReinforcement(team);
 if(v341BreachReinforcementPurchases[team]>before)generals[team].budgetPlan='REINFORCE BREACH';
 return out
};
const v34ReinforcementReset=reset;
reset=function(fixedSeed=null){v341BreachReinforcementPurchases[0]=v341BreachReinforcementPurchases[1]=0;const out=v34ReinforcementReset(fixedSeed);updateUI();return out};
window.__battleSim.reset=reset;document.getElementById('restartBtn').onclick=()=>reset();
const v34ReinforcementState=window.__battleSim.state;
window.__battleSim.state=()=>{const state=v34ReinforcementState();state.patchVersion='3.4.1';state.rework='breach-new-recruit-priority';state.siegeResolution.breachReinforcement={targetSize:V341_BREACH_REINFORCE_TARGET,priorityAppliesToAllNewPurchases:true,independentTopOffRank:'F',newRecruitsOnly:true,transfersExistingSoldiers:false,trainingDeferredWhileNeeded:true,upkeepPressureCeiling:V341_BREACH_REINFORCE_MAX_PRESSURE,purchases:[...v341BreachReinforcementPurchases]};state.command.siegeEscalation.breachReinforcementTarget=V341_BREACH_REINFORCE_TARGET;return state};
Object.assign(window.__battleSim.test,{companyWithRoom,buyMusketeer,tryArmyTraining,generalDecision,activeBreachReinforcement,breachReinforcementNeeded,breachReinforcementCompany,tryBreachReinforcement});window.GameTest.state=()=>window.__battleSim.state();
document.title='Musketeer Battle Simulator — Phase 4 v3.4.1';const v341Badge=document.querySelector('.version');if(v341Badge)v341Badge.textContent='v3.4.1';
