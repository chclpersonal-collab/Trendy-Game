'use strict';
// v3.4 verification correction: training starts only after the rank ecology has had time to mature,
// and long-war siege commitments last long enough to fight through a defended front instead of pulsing for ~110s.
const V34_TRAINING_MATURITY=900,V34_LONG_WAR_COMMIT=420;
const v34BaseTryArmyTraining=tryArmyTraining;
tryArmyTraining=function(team){if(currentWarAge()<V34_TRAINING_MATURITY)return false;return v34BaseTryArmyTraining(team)};
const v34BaseEnterLongWarSiege=enterLongWarSiege;
enterLongWarSiege=function(team){const entered=v34BaseEnterLongWarSiege(team);if(entered){const g=generals[team];g.siegeCommit=Math.max(g.siegeCommit||0,V34_LONG_WAR_COMMIT)}return entered};
const v34CorrectedState=window.__battleSim.state;
window.__battleSim.state=()=>{const state=v34CorrectedState();state.statTraining.aiMaturitySeconds=V34_TRAINING_MATURITY;state.siegeResolution.longWarCommitSeconds=V34_LONG_WAR_COMMIT;return state};
Object.assign(window.__battleSim.test,{tryArmyTraining,enterLongWarSiege});window.GameTest.state=()=>window.__battleSim.state();