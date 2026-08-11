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