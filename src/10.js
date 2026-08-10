'use strict';
window.GameTest={
 state:()=>window.__battleSim.state(),
 advance:(seconds)=>window.__battleSim.step(seconds),
 setSeed:(value)=>window.__battleSim.setSeed(value),
 forceReload:(team)=>{for(const a of activeMusketeers(team))a.reload=MUSKET_RELOAD_TIME;return window.__battleSim.state()},
 forceStance:(team,stance,commit=0)=>{const g=generals[team];g.stance=stance;g.targetX=strategicTarget(team,stance);g.siegeCommit=stance==='SIEGE'?Math.max(commit||SIEGE_COMMIT_DURATION,g.siegeCommit):0;for(const c of g.companies){c.command=stance==='SIEGE'?'SIEGE':stance==='DEFEND'?'DEFEND':'ADVANCE';c.targetX=g.targetX;c.commandTimer=.01}return window.__battleSim.state()},
 killCommander:(team,companyId=0)=>{const c=companyFor(team,companyId),a=commanderFor(c);if(a)killActor(a,null,'test');return window.__battleSim.state()},
 damageFortress:(team,amount)=>{const f=fortresses[team];f.hp=Math.max(0,f.hp-Math.max(0,amount));if(f.hp<=0&&warWinner===-1)endWar(1-team);return window.__battleSim.state()},
 forceBreach:(team,companyId=0,clearLane=false)=>{const g=generals[team],c=companyFor(team,companyId),cmd=commanderFor(c),dir=team===0?1:-1,enemyFort=fortresses[1-team];if(!c||!cmd)return window.__battleSim.state();g.stance='SIEGE';g.siegeCommit=SIEGE_COMMIT_DURATION;g.targetX=strategicTarget(team,'SIEGE');g.breachCompanyId=c.id;const men=companyMusketeers(team,c.id),baseX=enemyFort.x-dir*(FORT_ATTACK_RANGE-35);if(clearLane){for(const e of actors){if(!e.alive||e.team===team)continue;e.x=W/2+(e.isCommander?0:((e.slot||0)%7-3)*6);e.y=formationY(e);e.chargeTimer=0;e.chargeTarget=0;e.rearEngaged=false}g.decision=Math.max(g.decision,2);generals[1-team].decision=Math.max(generals[1-team].decision,2)}cmd.x=baseX-dir*24;cmd.y=formationY(cmd);for(const a of men){a.x=baseX-dir*(a.slot%4)*4;a.y=formationY(a);a.reload=0;a.rejoining=false}c.command='BREACH';c.targetX=g.targetX;c.commandTimer=.01;return window.__battleSim.state()},
 sampleSeeds:(seeds,seconds=300)=>{const out=[];for(const value of seeds){reset(value);window.__battleSim.step(seconds);out.push({seed:value,state:window.GameTest.snapshot(),validation:window.GameTest.validate()})}return out},
 validate:()=>{const state=window.__battleSim.state(),companyMax=Math.max(0,...state.companies.flat().map(c=>c.men)),finite=[...state.money,...state.fortresses.flatMap(f=>[f.hp,f.maxHp]),state.frontline].every(Number.isFinite),negativeTreasury=state.money.some(v=>v<-.001),overCapacity=companyMax>MAX_PER_COMMANDER,overArmyCapacity=state.musketeers.some(v=>v>MAX_MUSKETEERS),tooManyCompanies=state.companies.some(cs=>cs.length>MAX_COMPANIES),invalidCompanyTarget=state.companies.flat().some(c=>!Number.isFinite(c.targetSize)||c.targetSize<MIN_PER_COMMANDER||c.targetSize>MAX_PER_COMMANDER),invalidFort=state.fortresses.some(f=>f.hp<-.001||f.hp>f.maxHp+.001),invalidRank=actors.some(a=>a.alive&&!a.isCommander&&!PURCHASABLE_RANKS.includes(classOf(a)));return{ok:finite&&!negativeTreasury&&!overCapacity&&!overArmyCapacity&&!tooManyCompanies&&!invalidCompanyTarget&&!invalidFort&&!invalidRank,finite,negativeTreasury,overCapacity,overArmyCapacity,tooManyCompanies,invalidCompanyTarget,invalidFort,invalidRank,companyMax,minPerCommander:MIN_PER_COMMANDER,maxPerCommander:MAX_PER_COMMANDER,maxCompanies:MAX_COMPANIES,maxPerArmy:MAX_MUSKETEERS,roadmapCount:roadmap.length,version:state.version,patchVersion:state.patchVersion}},
 snapshot:()=>JSON.parse(JSON.stringify(window.__battleSim.state()))
};
const v31State=window.__battleSim.state;
window.__battleSim.state=()=>{const state=v31State();state.patchVersion='3.1.1';state.rework='command-continuity-coordinated-withdrawal';state.commandProximityIntegrity=[commandProximityIntegrity(0),commandProximityIntegrity(1)];state.command.commandAuthority={model:'original living commander preserves authority while the company regroups or withdraws; commander death disrupts command until a physical replacement joins',deathDisrupts:true,livingRetreatDisrupts:false,replacementRequiresPhysicalJoin:true,withdrawalFacesMovement:true};state.companies.forEach((side,t)=>side.forEach(c=>{const company=companyFor(t,c.id);c.commandSourceActive=!!activeCommandSource(company);c.proximityInCommand=!!commanderInCommand(company)}));return state};
Object.assign(window.__battleSim.test,{activeCommandSource,commandProximityIntegrity});
document.title='Musketeer Battle Simulator — Phase 3 v3.1.1';const patchLabel=document.querySelector('header .muted');if(patchLabel)patchLabel.textContent='Phase 3 · v3.1.1 · Command Continuity / Coordinated Withdrawal';const patchRules=[...document.querySelectorAll('#side .card')].find(card=>card.querySelector('b')?.textContent==='Phase 3 Rules');if(patchRules&&!patchRules.dataset.commandContinuity){patchRules.dataset.commandContinuity='1';const a=document.createElement('div'),b=document.createElement('div'),c=document.createElement('div');a.textContent='• A living original commander keeps command authority while regrouping or withdrawing; temporary spacing alone does not make the soldiers panic or become uncommanded.';b.textContent='• Commander death causes real command disruption. A replacement commander must physically reach the company before command and BREACH viability return.';c.textContent='• RALLY/withdrawal is a company movement: commander and soldiers move together, and units moving backward turn to face their movement direction rather than moonwalking.';patchRules.append(a,b,c)}
reset();requestAnimationFrame(frame);

// Phase 3 v3.2 — Form II Makashi + tactical combat continuity.
const V32_CROSS_LANE_X=240,V32_CROSS_LANE_SCAN=310,V32_CROSS_LANE_Y_MIN=65,V32_CROSS_LANE_Y_LEASH=120,V32_CROSS_LANE_Y_SPEED=105;
const MAKASHI_SCAN_RANGE=160,MAKASHI_CROWD_RADIUS=110,MAKASHI_CROWD_LIMIT=2,MAKASHI_RANGE=42,MAKASHI_APPROACH=118,MAKASHI_DAMAGE=58,MAKASHI_COOLDOWN=1.05,MAKASHI_STEP_SPEED=34;

function v32EnemyFor(a,command){return command==='BREACH'?breachEnemy(a):command==='SIEGE'?siegeEnemy(a):combatEnemy(a)}
function v32SoldierCommand(a,c){if(!c)return'NO COMMAND';const authority=activeCommandSource(c),local=soldierCommander(a),withdrawal=c.command==='RALLY'||c.command==='DEFEND';return local?c.command:authority&&withdrawal?c.command:authority?'REGROUP':'NO COMMAND'}
function v32RearwardMovement(a,c,command){if(!c)return false;const dir=a.team===0?1:-1;if(command==='RALLY')return true;if(command==='DEFEND'||command==='HOLD'){const destination=c.targetX+(a.team===0?-10:10);return(destination-a.x)*dir<-2}return false}
function tacticalCrossLaneTarget(a,e,c,command){if(!a||!e||!c||!soldierCommander(a))return null;if(['BREACH','SIEGE','CHARGE','BRACE','VOLLEY','RALLY','REGROUP'].includes(command)||v32RearwardMovement(a,c,command))return null;const dx=Math.abs(e.x-a.x),dy=Math.abs(e.y-a.y),d=Math.hypot(dx,dy);if(dx>V32_CROSS_LANE_X||dy<V32_CROSS_LANE_Y_MIN||d>V32_CROSS_LANE_SCAN||d<=BASE_RANGE*.82)return null;const fy=formationY(a),targetY=Math.max(32,Math.min(H-32,Math.max(fy-V32_CROSS_LANE_Y_LEASH,Math.min(fy+V32_CROSS_LANE_Y_LEASH,e.y))));return{enemy:e,targetY,dx,dy,d}}
function restoreMovementFacing(a,beforeX){const delta=a.x-beforeX;if(Math.abs(delta)>0.25)faceToward(a,a.x+Math.sign(delta)*10)}

const v311UpdateMusketeer=updateMusketeer;
updateMusketeer=function(a,dt){
 const c=companyFor(a.team,a.company),command=v32SoldierCommand(a,c),authority=c?activeCommandSource(c):null,beforeX=a.x,initialEnemy=v32EnemyFor(a,command),intercept=tacticalCrossLaneTarget(a,initialEnemy,c,command),withdrawal=v32RearwardMovement(a,c,command);
 v311UpdateMusketeer(a,dt);
 if(!a.alive)return;
 let e=initialEnemy&&initialEnemy.alive?initialEnemy:v32EnemyFor(a,command);
 if(intercept&&e&&e.alive&&!a.rejoining&&(a.disarm||0)<=0&&a.panic<=0&&a.chargeTimer<=0&&soldierCommander(a)){
  const current=tacticalCrossLaneTarget(a,e,c,command);
  if(current){a.y=approachValue(a.y,current.targetY,V32_CROSS_LANE_Y_SPEED,dt);a.y=Math.max(32,Math.min(H-32,a.y));const d=Math.hypot(e.x-a.x,e.y-a.y);if(a.reload<=0&&d<=BASE_RANGE)fire(a,e,d)}
 }
 if(authority&&e&&e.alive&&!a.rejoining&&(a.disarm||0)<=0&&a.panic<=0&&(withdrawal||command==='REGROUP')){
  const d=Math.hypot(e.x-a.x,e.y-a.y);
  if(rankAtLeast(a,'E')&&d<=E_MELEE_RANGE+4&&a.chargeCooldown<=0){a.chargeCooldown=E_CHARGE_COOLDOWN+rand(0,1.6);bayonetStrike(a,e)}else if(a.reload<=0&&d<=BASE_RANGE)fire(a,e,d);
  restoreMovementFacing(a,beforeX)
 }
};

function makashiOpportunity(a,c){
 if(!a||!a.isCommander||!c||activeCommandSource(c)!==a)return null;
 let target=null,best=Infinity,crowd=0;
 for(const e of actors){if(!e.alive||e.team===a.team)continue;const d=Math.hypot(e.x-a.x,e.y-a.y);if(d<=MAKASHI_CROWD_RADIUS)crowd++;if(e.isCommander&&d<=MAKASHI_SCAN_RANGE&&d<best){best=d;target=e}}
 if(!target||crowd>MAKASHI_CROWD_LIMIT)return null;
 if((c.command==='BREACH'||c.command==='SIEGE')&&best>MAKASHI_RANGE+8)return null;
 return target
}
function selectCommanderForm(a,c){const target=makashiOpportunity(a,c);a.form=target?'II':'I';return target}
function makashiStrike(a,target){if(!a||!a.isCommander||!target||!target.alive||!target.isCommander||a.saberCooldown>0)return false;const d=Math.hypot(target.x-a.x,target.y-a.y);if(d>MAKASHI_RANGE)return false;faceToward(a,target.x);a.saberCooldown=MAKASHI_COOLDOWN+rand(0,.15);a.saberFlash=.24;a.meleeFlash=.15;target.hp-=MAKASHI_DAMAGE+rand(-3,3);if(target.hp<=0)killActor(target,a,'formII');return true}

const v311UpdateCommander=updateCommander;
updateCommander=function(a,dt){
 const c=companyFor(a.team,a.company),men=companyMusketeers(a.team,a.company),dir=a.team===0?1:-1,avgX=men.length?men.reduce((n,s)=>n+s.x,0)/men.length:fortresses[a.team].x+dir*85,withdrawal=!!(c&&(c.command==='RALLY'||(c.command==='DEFEND'&&(c.targetX-avgX)*dir<-8))),beforeX=a.x,ready=a.saberCooldown<=0,duel=selectCommanderForm(a,c),savedCooldown=a.saberCooldown;
 if(duel)a.saberCooldown=Math.max(999,savedCooldown);
 v311UpdateCommander(a,dt);
 if(duel)a.saberCooldown=savedCooldown;
 if(!a.alive)return;
 if(duel&&duel.alive){
  let d=Math.hypot(duel.x-a.x,duel.y-a.y);
  if(ready&&d<=MAKASHI_RANGE)makashiStrike(a,duel);else if(!withdrawal&&d<=MAKASHI_APPROACH&&commanderInCommand(c)){if(d>FORM_I_APPROACH)a.x=approachValue(a.x,duel.x,MAKASHI_STEP_SPEED,dt);a.y=approachValue(a.y,duel.y,MAKASHI_STEP_SPEED,dt);a.x=Math.max(28,Math.min(W-28,a.x));a.y=Math.max(32,Math.min(H-32,a.y))}
  if(withdrawal&&a.reload<=0&&duel.alive){d=Math.hypot(duel.x-a.x,duel.y-a.y);if(d>MAKASHI_RANGE&&d<=BASE_RANGE)fire(a,duel,d)}
 }else if(withdrawal){
  const e=combatEnemy(a);if(e&&e.alive){const d=Math.hypot(e.x-a.x,e.y-a.y);if(ready&&d<=FORM_I_RANGE)formISweep(a);else if(a.reload<=0&&d<=BASE_RANGE)fire(a,e,d)}
 }
 if(withdrawal)restoreMovementFacing(a,beforeX)
};

const v311Draw=draw;
draw=function(){v311Draw();for(const a of actors){if(!a.alive||!a.isCommander||a.form!=='II')continue;const c=companyFor(a.team,a.company);ctx.save();ctx.translate(a.x,a.y);ctx.font='bold 7px monospace';const prefix=`C${a.company+1}:${c?c.command.slice(0,3):'---'}·`,x=-15+ctx.measureText(prefix).width;ctx.fillStyle=a.x<frontX?'#121212':'#0d0d0d';ctx.fillRect(x-1,-20,13,10);ctx.fillStyle=a.team===0?'#ddd':'#929292';ctx.fillText('II',x,-12);ctx.restore()}};

const v311StateForV32=window.__battleSim.state;
window.__battleSim.state=()=>{const state=v311StateForV32();state.version='3.2';state.patchVersion='3.2.0';state.rework='makashi-tactical-combat-continuity';state.command.combatContinuity={crossLaneAwareness:{horizontalRange:V32_CROSS_LANE_X,totalScan:V32_CROSS_LANE_SCAN,formationLeash:V32_CROSS_LANE_Y_LEASH,requiresLocalCommand:true},withdrawal:{rangedFireWhileMoving:true,commanderSelfDefense:true,eliteContactBayonet:true,genericFMelee:false,panicBehaviorUnchanged:true}};state.command.lightsaberForm={...state.command.lightsaberForm,current:'I / II adaptive',name:'Shii-Cho / Makashi',status:'v3.2',unlocked:['I Shii-Cho','II Makashi'],next:'III Soresu',projectileDeflection:false,formII:{name:'Makashi',role:'precise single-target anti-commander duel',scanRange:MAKASHI_SCAN_RANGE,range:MAKASHI_RANGE,approach:MAKASHI_APPROACH,damage:MAKASHI_DAMAGE,cooldown:MAKASHI_COOLDOWN,crowdLimit:MAKASHI_CROWD_LIMIT,noDisarm:true,projectileDeflection:false}};state.command.activeForms=[0,1].map(t=>({I:activeCommanders(t).filter(a=>(a.form||'I')==='I').length,II:activeCommanders(t).filter(a=>a.form==='II').length}));return state};
Object.assign(window.__battleSim.test,{updateMusketeer,updateCommander,tacticalCrossLaneTarget,makashiOpportunity,selectCommanderForm,makashiStrike});
document.title='Musketeer Battle Simulator — Phase 3 v3.2';const versionBadge=document.querySelector('.version');if(versionBadge)versionBadge.textContent='v3.2';
