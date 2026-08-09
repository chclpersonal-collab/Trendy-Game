'use strict';
window.GameTest={
 state:()=>window.__battleSim.state(),
 advance:(seconds)=>window.__battleSim.step(seconds),
 setSeed:(value)=>window.__battleSim.setSeed(value),
 forceReload:(team)=>{for(const a of activeMusketeers(team))a.reload=MUSKET_RELOAD_TIME;return window.__battleSim.state()},
 forceStance:(team,stance,commit=0)=>{const g=generals[team];g.stance=stance;g.targetX=strategicTarget(team,stance);g.siegeCommit=stance==='SIEGE'?Math.max(commit||SIEGE_COMMIT_DURATION,g.siegeCommit):0;for(const c of g.companies){c.command=stance==='SIEGE'?'SIEGE':stance==='DEFEND'?'DEFEND':'ADVANCE';c.targetX=g.targetX;c.commandTimer=.01}return window.__battleSim.state()},
 killCommander:(team,companyId=0)=>{const c=companyFor(team,companyId),a=commanderFor(c);if(a)killActor(a,null,'test');return window.__battleSim.state()},
 damageFortress:(team,amount)=>{const f=fortresses[team];f.hp=Math.max(0,f.hp-Math.max(0,amount));if(f.hp<=0&&warWinner===-1)endWar(1-team);return window.__battleSim.state()},
 validate:()=>{const state=window.__battleSim.state(),companyMax=Math.max(0,...state.companies.flat().map(c=>c.men)),finite=[...state.money,...state.fortresses.flatMap(f=>[f.hp,f.maxHp]),state.frontline].every(Number.isFinite),negativeTreasury=state.money.some(v=>v<-.001),overCapacity=companyMax>MAX_PER_COMMANDER,invalidFort=state.fortresses.some(f=>f.hp<-.001||f.hp>f.maxHp+.001);return{ok:finite&&!negativeTreasury&&!overCapacity&&!invalidFort,finite,negativeTreasury,overCapacity,invalidFort,companyMax,maxPerCommander:MAX_PER_COMMANDER,roadmapCount:roadmap.length,version:state.version}},
 snapshot:()=>JSON.parse(JSON.stringify(window.__battleSim.state()))
};

reset();requestAnimationFrame(frame);
