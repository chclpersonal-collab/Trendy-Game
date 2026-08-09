'use strict';
window.GameTest={
 state:()=>window.__battleSim.state(),
 advance:(seconds)=>window.__battleSim.step(seconds),
 setSeed:(value)=>window.__battleSim.setSeed(value),
 forceReload:(team)=>{for(const a of activeMusketeers(team))a.reload=MUSKET_RELOAD_TIME;return window.__battleSim.state()},
 forceStance:(team,stance,commit=0)=>{const g=generals[team];g.stance=stance;g.targetX=strategicTarget(team,stance);g.siegeCommit=stance==='SIEGE'?Math.max(commit||SIEGE_COMMIT_DURATION,g.siegeCommit):0;for(const c of g.companies){c.command=stance==='SIEGE'?'SIEGE':stance==='DEFEND'?'DEFEND':'ADVANCE';c.targetX=g.targetX;c.commandTimer=.01}return window.__battleSim.state()},
 killCommander:(team,companyId=0)=>{const c=companyFor(team,companyId),a=commanderFor(c);if(a)killActor(a,null,'test');return window.__battleSim.state()},
 damageFortress:(team,amount)=>{const f=fortresses[team];f.hp=Math.max(0,f.hp-Math.max(0,amount));if(f.hp<=0&&warWinner===-1)endWar(1-team);return window.__battleSim.state()},
 forceBreach:(team,companyId=0)=>{const g=generals[team],c=companyFor(team,companyId),cmd=commanderFor(c),dir=team===0?1:-1,enemyFort=fortresses[1-team];if(!c||!cmd)return window.__battleSim.state();g.stance='SIEGE';g.siegeCommit=SIEGE_COMMIT_DURATION;g.targetX=strategicTarget(team,'SIEGE');g.breachCompanyId=c.id;const men=companyMusketeers(team,c.id),baseX=enemyFort.x-dir*(FORT_ATTACK_RANGE-35);cmd.x=baseX-dir*24;cmd.y=formationY(cmd);for(const a of men){a.x=baseX-dir*(a.slot%4)*4;a.y=formationY(a);a.reload=0;a.rejoining=false}c.command='BREACH';c.targetX=g.targetX;c.commandTimer=.01;return window.__battleSim.state()},
 sampleSeeds:(seeds,seconds=300)=>{const out=[];for(const value of seeds){reset(value);window.__battleSim.step(seconds);out.push({seed:value,state:window.GameTest.snapshot(),validation:window.GameTest.validate()})}return out},
 validate:()=>{const state=window.__battleSim.state(),companyMax=Math.max(0,...state.companies.flat().map(c=>c.men)),finite=[...state.money,...state.fortresses.flatMap(f=>[f.hp,f.maxHp]),state.frontline].every(Number.isFinite),negativeTreasury=state.money.some(v=>v<-.001),overCapacity=companyMax>MAX_PER_COMMANDER,invalidFort=state.fortresses.some(f=>f.hp<-.001||f.hp>f.maxHp+.001);return{ok:finite&&!negativeTreasury&&!overCapacity&&!invalidFort,finite,negativeTreasury,overCapacity,invalidFort,companyMax,maxPerCommander:MAX_PER_COMMANDER,roadmapCount:roadmap.length,version:state.version}},
 snapshot:()=>JSON.parse(JSON.stringify(window.__battleSim.state()))
};

reset();requestAnimationFrame(frame);