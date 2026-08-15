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