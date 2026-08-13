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

// Phase 4 v3.4.2 candidate — BREACH continuity hysteresis.
// Initial spearhead selection still requires the established six musketeers. Once selected, the same living,
// commanded spearhead may remain assigned down to three musketeers while it remains near the forward lead.
// A healthy six-man company takes over only after it moves materially farther forward. No soldier is moved,
// no recruit is rerouted, and the six-man fieldwork blockade threshold remains unchanged.
const V342_BREACH_RETAIN_MIN=3,V342_BREACH_HANDOFF_LEAD=120;
function v342ForwardCoordinate(team,c){const center=c?companyCenter(team,c.id):null;if(!center)return-Infinity;return center.x*(team===0?1:-1)}
function v342RetainedBreachViable(team,c){
 if(!c||companyMusketeers(team,c.id).length<V342_BREACH_RETAIN_MIN||!activeCommandSource(c))return false;
 const g=generals[team],current=v342ForwardCoordinate(team,c),challengers=g.companies.filter(x=>x.id!==c.id&&assignedBreachStillViable(team,x));
 if(!challengers.length)return true;
 const best=Math.max(...challengers.map(x=>v342ForwardCoordinate(team,x)));
 return current+V342_BREACH_HANDOFF_LEAD>=best
}
const v34BaseSiegeSpearhead=siegeSpearhead;
siegeSpearhead=function(team){
 const g=generals[team];
 if(g.stance==='SIEGE'){
  const current=companyFor(team,g.breachCompanyId);
  if(current&&!assignedBreachStillViable(team,current)&&v342RetainedBreachViable(team,current))return current
 }
 return v34BaseSiegeSpearhead(team)
};
const v34ContinuityState=window.__battleSim.state;
window.__battleSim.state=()=>{const state=v34ContinuityState();state.siegeResolution.breachContinuityCandidate={id:'v3.4.2-breach-continuity-hysteresis',selectionMinimum:BREACH_MIN_MEN,retentionMinimum:V342_BREACH_RETAIN_MIN,handoffLead:V342_BREACH_HANDOFF_LEAD,requiresActiveCommand:true,movesExistingSoldiers:false,routesNewRecruits:false,fieldworkBlockMinimumUnchanged:true};return state};
Object.assign(window.__battleSim.test,{siegeSpearhead,v342RetainedBreachViable,v342ForwardCoordinate});window.GameTest.state=()=>window.__battleSim.state();
