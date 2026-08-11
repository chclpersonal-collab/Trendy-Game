'use strict';
// Phase 4 v3.3 — C Class foundation / Volley Drill.
// C extends the established buy-or-earn ecology without introducing a universal raw-stat jump.
const C_PROMOTION_XP=18,C_PRICE=150,C_ECONOMY_PRICE_BONUS=2,C_VOLLEY_AIM_BONUS=.045,C_VOLLEY_RELOAD_BONUS=2.5,C_VOLLEY_RELOAD_MIN=24.5,C_MIN_ARMY=24,C_MAX_UPKEEP_PRESSURE=.84,C_FOUNDATION_RATIO=.72;
const V33_C_TARGETS={BUILD:.015,DEFEND:.025,CONTEST:.02,ATTACK:.025,SIEGE:.015};
const cPromotions=[0,0];
RANK_PRICE.C=C_PRICE;RANK_XP_FLOOR.C=C_PROMOTION_XP;if(!PURCHASABLE_RANKS.includes('C'))PURCHASABLE_RANKS.push('C');for(const g of generals)g.rankPurchases.C=g.rankPurchases.C||0;

const v321ClassOfForC=classOf;
classOf=function(a){if(a&&a.rank)return a.rank;const xp=a?.xp||0;return xp>=C_PROMOTION_XP?'C':v321ClassOfForC(a)};
const v321RankLabelXPForC=rankLabelXP;
rankLabelXP=function(xp){return xp>=C_PROMOTION_XP?`C·${xp-C_PROMOTION_XP}`:v321RankLabelXPForC(xp)};
const v321RankScoreForC=rankScoreOf;
rankScoreOf=function(a){const r=typeof a==='string'?a:classOf(a);return r==='C'?4:v321RankScoreForC(a)};
const v321EconomyPriceBonusForC=economyPriceBonusOf;
economyPriceBonusOf=function(a){return classOf(a)==='C'?C_ECONOMY_PRICE_BONUS:v321EconomyPriceBonusForC(a)};
const v321AssaultDrillForC=dAssaultDrillActive;
dAssaultDrillActive=function(a){if(a&&!a.isCommander&&classOf(a)==='C'){const c=companyFor(a.team,a.company);return !!(c&&(c.command==='SIEGE'||c.command==='BREACH'||c.command==='CHARGE'))}return v321AssaultDrillForC(a)};
const v321VeteranCombatXPForC=veteranCombatXP;
veteranCombatXP=function(a){if(classOf(a)!=='C')return v321VeteranCombatXPForC(a);const extra=Math.max(0,effectiveXP(a)-C_PROMOTION_XP);return(dAssaultDrillActive(a)?D_PROMOTION_XP:E_PROMOTION_XP)+extra};
armyCombatStrength=function(team){const assault=generals[team].stance==='SIEGE';return activeMusketeers(team).reduce((n,a)=>{const r=classOf(a);if(r==='C'||r==='D')return n+(assault?1.45:1.25);if(r==='E')return n+1.25;return n+1},0)};

const v321AwardKillForC=awardKill;
awardKill=function(killer,victim,method='musket'){v321AwardKillForC(killer,victim,method);if(killer&&!killer.isCommander&&classOf(killer)==='D'&&(killer.xp||0)>=C_PROMOTION_XP){killer.rank='C';cPromotions[killer.team]++;killer.promoteFlash=1}return killer};

function cVolleyDrillActive(a){return !!(a&&!a.isCommander&&classOf(a)==='C'&&a.cVolleyDrill)}
const v321ShotAccuracyForC=shotAccuracy;
shotAccuracy=function(a,target,d){const base=v321ShotAccuracyForC(a,target,d);return cVolleyDrillActive(a)?Math.min(.80,base+C_VOLLEY_AIM_BONUS):base};
const v321MusketReloadForC=musketReloadTime;
musketReloadTime=function(a){const base=v321MusketReloadForC(a);return cVolleyDrillActive(a)?Math.max(C_VOLLEY_RELOAD_MIN,base-C_VOLLEY_RELOAD_BONUS):base};
const v321FireForC=fire;
fire=function(a,target,d,volley=false){if(volley&&classOf(a)==='C'&&!a.isCommander){a.cVolleyDrill=true;try{return v321FireForC(a,target,d,volley)}finally{a.cVolleyDrill=false}}return v321FireForC(a,target,d,volley)};

function targetCShare(stance){return V33_C_TARGETS[stance]??.02}
const v321ProcurementForC=procurementRank;
procurementRank=function(team,stance,reserve,desired){const base=v321ProcurementForC(team,stance,reserve,desired);if(base!=='F')return base;const g=generals[team],men=activeMusketeers(team),n=men.length;if(n<C_MIN_ARMY)return base;const pressure=upkeepPressure(team),e=men.filter(a=>classOf(a)==='E').length,d=men.filter(a=>classOf(a)==='D').length,c=men.filter(a=>classOf(a)==='C').length,eShare=e/n,dShare=d/n,cShare=c/n,eFloor=targetEShare(stance)*C_FOUNDATION_RATIO,dFloor=targetDShare(stance)*C_FOUNDATION_RATIO;if(eShare<eFloor||dShare<dFloor||pressure>=C_MAX_UPKEEP_PRESSURE||g.money-RANK_PRICE.C<reserve)return base;return cShare<targetCShare(stance)?'C':base};

const v321GeneralDecisionForC=generalDecision;
generalDecision=function(team){const g=generals[team],before=g.rankPurchases.C||0,result=v321GeneralDecisionForC(team);if((g.rankPurchases.C||0)>before)g.budgetPlan='BUY C';return result};
const v321TeamMetricsForC=teamMetrics;
teamMetrics=function(){const m=v321TeamMetricsForC();m.c=m.living.map(side=>side.filter(a=>classOf(a)==='C').length);return m};
const v321UpdateUIForC=updateUI;
updateUI=function(){v321UpdateUIForC();const m=teamMetrics();setPair('cclassStat',m.c[0],m.c[1]);setPair('cPromotionsStat',cPromotions[0],cPromotions[1]);setPair('rankPurchasesStat',`E ${generals[0].rankPurchases.E||0} · D ${generals[0].rankPurchases.D||0} · C ${generals[0].rankPurchases.C||0}`,`E ${generals[1].rankPurchases.E||0} · D ${generals[1].rankPurchases.D||0} · C ${generals[1].rankPurchases.C||0}`)};
const v321ResetForC=reset;
reset=function(fixedSeed=null){cPromotions[0]=cPromotions[1]=0;const out=v321ResetForC(fixedSeed);for(const g of generals)g.rankPurchases.C=g.rankPurchases.C||0;updateUI();return out};
window.__battleSim.reset=reset;document.getElementById('restartBtn').onclick=()=>reset();

const v32DrawForC=draw;
draw=function(){v32DrawForC();for(const a of actors){if(!a.alive||a.isCommander||classOf(a)!=='C')continue;ctx.save();ctx.translate(a.x,a.y);ctx.strokeStyle=a.team===0?'#fff':'#c8c8c8';ctx.beginPath();ctx.moveTo(0,-16);ctx.lineTo(3,-13);ctx.lineTo(0,-10);ctx.lineTo(-3,-13);ctx.closePath();ctx.stroke();ctx.restore()}};

const v321StateForV33=window.__battleSim.state;
window.__battleSim.state=()=>{const state=v321StateForV33(),m=teamMetrics();state.version='3.3';state.phase=4;state.patchVersion='3.3.0';state.rework='c-class-volley-drill';state.cclass=[...m.c];state.cPromotions=[...cPromotions];state.classProgression.cPromotionXP=C_PROMOTION_XP;state.classProgression.unlocked=['F','E','D','C'];state.classProgression.futurePolicy='every unlocked rank may be bought or earned; Phase 4 unlocks F/E/D/C only';state.classProgression.dClass.inheritedByC=true;state.classProgression.cClass={price:RANK_PRICE.C,promotionXP:C_PROMOTION_XP,role:'formal-volley specialist',inheritsEBayonet:true,inheritsDAssaultDrill:true,ordinaryVeteranBaseline:'D-equivalent outside inherited assault orders and formal VOLLEY',volleyDrill:{order:'VOLLEY',aimBonus:C_VOLLEY_AIM_BONUS,reloadBonus:C_VOLLEY_RELOAD_BONUS,reloadMinimum:C_VOLLEY_RELOAD_MIN},targetShareRange:[.015,.025],minimumArmyForDirectProcurement:C_MIN_ARMY};state.classProgression.rankEcology={...state.classProgression.rankEcology,model:'F majority / E regular / D rare-visible / C scarce-recurring',cTargets:{...V33_C_TARGETS},cMinimumArmy:C_MIN_ARMY,cMaxUpkeepPressure:C_MAX_UPKEEP_PRESSURE,priorEDThresholdsPreserved:true};return state};
Object.assign(window.__battleSim.test,{awardKill,procurementRank,generalDecision,targetCShare,cVolleyDrillActive,musketReloadTime,shotAccuracy,fire,teamMetrics});
window.GameTest.state=()=>window.__battleSim.state();
const roadmapEl=document.getElementById('roadmap');if(roadmapEl)roadmapEl.innerHTML=roadmap.map((x,i)=>`<div class="phase ${i<3?'done':i===3?'current':i===4?'next':'future'}">Phase ${i+1} — ${x}${i<3?' · STABLE':i===3?' · NOW':i===4?' · NEXT':''}</div>`).join('');
document.title='Musketeer Battle Simulator — Phase 4 v3.3';const v33Badge=document.querySelector('.version');if(v33Badge)v33Badge.textContent='v3.3';
for(const g of generals)g.rankPurchases.C=g.rankPurchases.C||0;updateUI();

// Phase 4 v3.3.1 — force-factor telemetry / stats semantics audit.
// These are derived read-only factors. They summarize existing mechanics and do not alter combat, economy, procurement, or RNG.
const V331_LUCK_NEUTRAL=50,V331_LUCK_Z_SCALE=12,V331_LUCK_SHRINK_SHOTS=24;
const forceShotTelemetry=[{shots:0,hits:0,expected:0,variance:0},{shots:0,hits:0,expected:0,variance:0}];
function clamp01(v){return Math.max(0,Math.min(1,Number.isFinite(v)?v:0))}function clamp100(v){return Math.max(0,Math.min(100,Number.isFinite(v)?v:0))}
function factorRankProfile(a){const r=classOf(a);return r==='C'?{offense:.70,defense:.63,skill:.68}:r==='D'?{offense:.66,defense:.60,skill:.62}:r==='E'?{offense:.60,defense:.55,skill:.52}:{offense:.50,defense:.50,skill:.40}}
function forceLuckScoreFrom(t){if(!t||t.shots<=0)return V331_LUCK_NEUTRAL;const variance=Math.max(.25,t.variance),z=(t.hits-t.expected)/Math.sqrt(variance),shrink=Math.sqrt(t.shots/(t.shots+V331_LUCK_SHRINK_SHOTS));return clamp100(V331_LUCK_NEUTRAL+V331_LUCK_Z_SCALE*z*shrink)}
function forceFactorMetrics(team){
 const men=activeMusketeers(team),n=men.length;if(!n)return{offense:0,defense:0,stamina:0,luck:forceLuckScoreFrom(forceShotTelemetry[team]),skill:0,readyShare:0,healthShare:0,authorityShare:0,localCommandShare:0,coverShare:0,cohesion:0};
 const ready=men.filter(a=>a.reload<=0&&(a.disarm||0)<=0&&(a.panic||0)<=0).length/n,health=men.reduce((s,a)=>s+clamp01(a.hp/100),0)/n,authority=men.filter(a=>ownCommanderAlive(a)).length/n,local=men.filter(a=>!!soldierCommander(a)).length/n,cover=men.reduce((s,a)=>s+clamp01(coverFor(a)/.10),0)/n;
 let cohesionWeight=0,cohesionTotal=0;for(const c of generals[team].companies){const count=companyMusketeers(team,c.id).length;if(!count)continue;const normalized=clamp01((companyCohesionFactor(c)-.84)/.38);cohesionTotal+=normalized*count;cohesionWeight+=count}const cohesion=cohesionWeight?cohesionTotal/cohesionWeight:0;
 let rankOffense=0,rankDefense=0,actorSkill=0;for(const a of men){const p=factorRankProfile(a);rankOffense+=p.offense;rankDefense+=p.defense;actorSkill+=Math.min(.90,p.skill+Math.min(.18,(a.earnedXP||0)*.012))}rankOffense/=n;rankDefense/=n;actorSkill/=n;
 const readinessScore=.35+.65*ready,authorityScore=.40+.60*authority,localScore=.40+.60*local,coverScore=.50+.50*cover,cohesionScore=.45+.55*cohesion;
 return{offense:clamp100(100*(.45*rankOffense+.35*readinessScore+.20*localScore)),defense:clamp100(100*(.30*rankDefense+.35*health+.20*authorityScore+.15*coverScore)),stamina:clamp100(100*(.55*health+.25*readinessScore+.20*cohesionScore)),luck:forceLuckScoreFrom(forceShotTelemetry[team]),skill:clamp100(100*(.65*actorSkill+.20*localScore+.15*cohesionScore)),readyShare:ready,healthShare:health,authorityShare:authority,localCommandShare:local,coverShare:cover,cohesion};
}
function ensureForceFactorUI(){
 const label=(id,text,title)=>{const el=document.getElementById(id),first=el?.querySelector('span:first-child');if(first){first.textContent=text;if(title)first.title=title}};label('integrityStat','Authority','Active companies with a living or physically joined command source.');label('uncommandedStat','No authority','Troops whose company has no active command source.');label('budgetStat','Budget','General AI spending/recruitment plan; separate from battlefield strategy.');
 if(document.getElementById('localCommandStat'))return;const anchor=document.getElementById('eclassStat');if(!anchor)return;const rows=[['localCommandStat','Local command','Troops currently within the 350-unit local tactical command radius.'],['offenseFactorStat','Offense','0–100 derived factor: rank quality + firing readiness + local tactical command.'],['defenseFactorStat','Defense','0–100 derived factor: health + rank resilience + command authority + actual cover.'],['staminaFactorStat','Stamina','0–100 derived factor: health + firing readiness + company cohesion.'],['skillFactorStat','Skill','0–100 derived factor: rank/earned XP + local command + company cohesion.'],['luckFactorStat','Luck','Observed musket hit luck versus predicted shot accuracy; 50 is neutral.']];
 for(const [id,name,title] of rows){const row=document.createElement('div');row.className='metric';row.id=id;row.innerHTML=`<span title="${title}">${name}</span><span data-side="left">0</span><span data-side="right">0</span>`;anchor.parentNode.insertBefore(row,anchor)}
}
const v33FireForFactors=fire;
fire=function(a,target,d,volley=false){let prior=a?.cVolleyDrill;if(volley&&a&&!a.isCommander&&classOf(a)==='C')a.cVolleyDrill=true;const expected=a&&target?shotAccuracy(a,target,d):0;if(a)a.cVolleyDrill=prior;const before=shots.length,result=v33FireForFactors(a,target,d,volley);if(result&&a&&shots.length>before){const shot=shots[shots.length-1],p=clamp01(expected),t=forceShotTelemetry[a.team];t.shots++;t.expected+=p;t.variance+=p*(1-p);if(shot?.hit)t.hits++}return result};
const v33UpdateUIForFactors=updateUI;
updateUI=function(){v33UpdateUIForFactors();ensureForceFactorUI();const f=[forceFactorMetrics(0),forceFactorMetrics(1)],living=[activeMusketeers(0).length,activeMusketeers(1).length];setPair('integrityStat',living[0]?`${Math.round(commandIntegrity(0)*100)}%`:'—',living[1]?`${Math.round(commandIntegrity(1)*100)}%`:'—');setPair('localCommandStat',living[0]?`${Math.round(f[0].localCommandShare*100)}%`:'—',living[1]?`${Math.round(f[1].localCommandShare*100)}%`:'—');for(const [id,key] of [['offenseFactorStat','offense'],['defenseFactorStat','defense'],['staminaFactorStat','stamina'],['skillFactorStat','skill'],['luckFactorStat','luck']])setPair(id,`${Math.round(f[0][key])}/100`,`${Math.round(f[1][key])}/100`)};
const v33StateForFactors=window.__battleSim.state;
window.__battleSim.state=()=>{const state=v33StateForFactors(),f=[forceFactorMetrics(0),forceFactorMetrics(1)];state.patchVersion='3.3.1';state.forceFactors=f;state.forceFactorModel={scale:[0,100],gameplayEffect:false,offense:'rank quality + firing readiness + local tactical command',defense:'health + rank resilience + command authority + cover',stamina:'health + firing readiness + company cohesion',skill:'rank/earned XP + local tactical command + company cohesion',luck:'observed musket hits versus predicted accuracy; 50 neutral'};state.command.localCommandShare=f.map(x=>x.localCommandShare);state.luckTelemetry=forceShotTelemetry.map(x=>({...x}));return state};
const v33ResetForFactors=reset;
reset=function(fixedSeed=null){for(const t of forceShotTelemetry){t.shots=0;t.hits=0;t.expected=0;t.variance=0}const out=v33ResetForFactors(fixedSeed);updateUI();return out};window.__battleSim.reset=reset;document.getElementById('restartBtn').onclick=()=>reset();
const v33ValidateForFactors=window.GameTest.validate;
window.GameTest.validate=()=>{const v=v33ValidateForFactors(),f=[forceFactorMetrics(0),forceFactorMetrics(1)],invalidForceFactors=f.some(side=>['offense','defense','stamina','luck','skill'].some(k=>!Number.isFinite(side[k])||side[k]<0||side[k]>100));return{...v,invalidForceFactors,ok:v.ok&&!invalidForceFactors,patchVersion:'3.3.1'}};
Object.assign(window.__battleSim.test,{fire,forceFactorMetrics,forceLuckScoreFrom});window.GameTest.state=()=>window.__battleSim.state();
document.title='Musketeer Battle Simulator — Phase 4 v3.3.1';const v331Badge=document.querySelector('.version');if(v331Badge)v331Badge.textContent='v3.3.1';ensureForceFactorUI();updateUI();