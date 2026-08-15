'use strict';
// Phase 3 v3.2.1 — rank ecology balance patch.
// F remains the majority. E is a regularly visible veteran tier; D is rare but no longer siege-only/mythical.
const V321_E_TARGETS={BUILD:.18,DEFEND:.18,CONTEST:.20,ATTACK:.24,SIEGE:.26};
const V321_D_TARGETS={BUILD:.03,DEFEND:.03,CONTEST:.04,ATTACK:.05,SIEGE:.06};
const V321_D_MIN_ARMY=18,V321_SIEGE_D_MIN_ARMY=12,V321_E_SEVERE_DEFICIT=.72,V321_E_MAX_PRESSURE=.95,V321_D_MAX_PRESSURE=.90;
function v321TargetEShare(stance){return V321_E_TARGETS[stance]??.20}
function v321TargetDShare(stance){return V321_D_TARGETS[stance]??.04}
function v321ProcurementRank(team,stance,reserve,desired){
 const g=generals[team],men=activeMusketeers(team),e=men.filter(a=>classOf(a)==='E').length,d=men.filter(a=>classOf(a)==='D').length,n=men.length,eShare=n?e/n:0,dShare=n?d/n:0,eTarget=v321TargetEShare(stance),dTarget=v321TargetDShare(stance),pressure=upkeepPressure(team),canE=g.money-RANK_PRICE.E>=reserve,canD=g.money-RANK_PRICE.D>=reserve,dMin=stance==='SIEGE'?V321_SIEGE_D_MIN_ARMY:V321_D_MIN_ARMY;
 if(n<7||pressure>=1.02)return'F';
 // Preserve the established early funded SIEGE top-off while removing the old siege-only restriction later in army growth.
 if(stance==='SIEGE'&&canD&&n>=dMin&&dShare<dTarget&&pressure<V321_D_MAX_PRESSURE)return'D';
 // Build the veteran layer first if it has collapsed well below its stance target.
 if(canE&&eShare<eTarget*V321_E_SEVERE_DEFICIT&&pressure<V321_E_MAX_PRESSURE)return'E';
 // Outside siege, D appears only after a mature F/E foundation exists.
 if(canD&&n>=dMin&&dShare<dTarget&&pressure<V321_D_MAX_PRESSURE)return'D';
 if(canE&&eShare<eTarget&&pressure<V321_E_MAX_PRESSURE)return'E';
 if(pressure>=.78)return'F';
 // Wealth may modestly top off E, but never beyond a bounded extension of the stance target.
 if(canE&&g.money>=reserve+RANK_PRICE.E*8&&eShare<Math.min(.30,eTarget+.05))return'E';
 return'F'
}
targetEShare=v321TargetEShare;
targetDShare=v321TargetDShare;
procurementRank=v321ProcurementRank;

// More E/D troops exposed an old order conflict: autonomous bayonet initiation ran before SIEGE/BREACH movement.
// Existing charges may finish, but a fresh autonomous charge may not override an explicit siege order.
function v321EliteSiegeDiscipline(a){const c=a&&!a.isCommander?companyFor(a.team,a.company):null;return !!(a&&a.alive&&rankAtLeast(a,'E')&&c&&(c.command==='SIEGE'||c.command==='BREACH')&&a.chargeTimer<=0)}
const v32UpdateMusketeerForV321=updateMusketeer;
updateMusketeer=function(a,dt){
 const disciplined=v321EliteSiegeDiscipline(a),savedCooldown=a?.chargeCooldown;
 if(disciplined)a.chargeCooldown=Math.max(a.chargeCooldown||0,999);
 v32UpdateMusketeerForV321(a,dt);
 if(disciplined&&a&&a.alive&&a.chargeTimer<=0&&a.chargeCooldown>900)a.chargeCooldown=savedCooldown;
};

const v32StateForV321=window.__battleSim.state;
window.__battleSim.state=()=>{
 const state=v32StateForV321();
 state.patchVersion='3.2.1';
 state.rework='rank-ecology-balance';
 state.classProgression.rankEcology={model:'F majority / E regular / D rare-visible',separateETarget:true,eTargets:{...V321_E_TARGETS},dTargets:{...V321_D_TARGETS},dMinimumArmy:V321_D_MIN_ARMY,siegeDMinimumArmy:V321_SIEGE_D_MIN_ARMY,eSevereDeficitRatio:V321_E_SEVERE_DEFICIT,eMaxUpkeepPressure:V321_E_MAX_PRESSURE,dMaxUpkeepPressure:V321_D_MAX_PRESSURE,promotionThresholdsUnchanged:true};
 state.classProgression.dClass.targetShareRange=[.03,.06];
 state.classProgression.dClass.aiPurchaseMode='rare-visible mature-army procurement across stances; SIEGE retains early top-off and the highest target';
 state.classProgression.eliteSiegeDiscipline={freshAutonomousChargeDuringSiege:false,existingChargeMayFinish:true,orders:['SIEGE','BREACH'],ordinaryAutonomousBayonetPreserved:true};
 return state
};
Object.assign(window.__battleSim.test,{procurementRank,targetEShare:v321TargetEShare,targetDShare:v321TargetDShare,updateMusketeer,v321EliteSiegeDiscipline});
document.title='Musketeer Battle Simulator — Phase 3 v3.2.1';
const v321Badge=document.querySelector('.version');if(v321Badge)v321Badge.textContent='v3.2.1';
