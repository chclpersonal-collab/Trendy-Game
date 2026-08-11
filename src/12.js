'use strict';
// Phase 4 v3.3 — C Class / Line Discipline.
const C_PROMOTION_XP=18,C_PRICE=160,C_ECONOMY_PRICE_BONUS=2,C_COMBAT_WEIGHT=1.35,C_SIEGE_WEIGHT=1.55;
const C_LINE_AIM_BONUS=.035,C_LINE_RELOAD_BONUS=2,C_LINE_RELOAD_MIN=26,C_MIN_ARMY=22,C_MAX_PRESSURE=.88;
const V33_C_TARGETS={BUILD:.02,DEFEND:.03,CONTEST:.025,ATTACK:.03,SIEGE:.025};
const cPromotions=[0,0];
RANK_PRICE.C=C_PRICE;RANK_XP_FLOOR.C=C_PROMOTION_XP;if(!PURCHASABLE_RANKS.includes('C'))PURCHASABLE_RANKS.push('C');

const v321ClassOf=classOf;
classOf=function(a){if(a&&a.rank)return a.rank;const xp=a?.xp||0;return xp>=C_PROMOTION_XP?'C':v321ClassOf(a)};
rankLabelXP=function(xp){return xp>=C_PROMOTION_XP?`C·${xp-C_PROMOTION_XP}`:xp>=D_PROMOTION_XP?`D·${xp-D_PROMOTION_XP}`:xp>=E_PROMOTION_XP?`E·${xp-E_PROMOTION_XP}`:`F·${xp}`};
rankScoreOf=function(a){const r=typeof a==='string'?a:classOf(a);return r==='C'?4:r==='D'?3:r==='E'?2:1};
rankAtLeast=function(a,rank){return rankScoreOf(a)>=rankScoreOf(rank)};
economyPriceBonusOf=function(a){const r=classOf(a);return r==='C'?C_ECONOMY_PRICE_BONUS:r==='D'?D_ECONOMY_PRICE_BONUS:r==='E'?1:0};
dAssaultDrillActive=function(a){if(!a||a.isCommander||!rankAtLeast(a,'D'))return false;const c=companyFor(a.team,a.company);return !!(c&&(c.command==='SIEGE'||c.command==='BREACH'||c.command==='CHARGE'))};
veteranCombatXP=function(a){const r=classOf(a),xp=effectiveXP(a);if(rankAtLeast(a,'D')){const earnedAboveRank=Math.max(0,xp-(RANK_XP_FLOOR[r]||D_PROMOTION_XP));return(dAssaultDrillActive(a)?D_PROMOTION_XP:E_PROMOTION_XP)+earnedAboveRank}return xp};
armyCombatStrength=function(team){const assault=generals[team].stance==='SIEGE';return activeMusketeers(team).reduce((n,a)=>{const r=classOf(a);if(r==='C')return n+(assault?C_SIEGE_WEIGHT:C_COMBAT_WEIGHT);if(r==='D')return n+(assault?1.45:1.25);if(r==='E')return n+1.25;return n+1},0)};

function cLineDisciplineActive(a){if(!a||a.isCommander||classOf(a)!=='C')return false;const c=companyFor(a.team,a.company);return !!(c&&soldierCommander(a)&&['VOLLEY','BRACE','HOLD','DEFEND'].includes(c.command))}
const v321ShotAccuracy=shotAccuracy;
shotAccuracy=function(a,target,d){const base=v321ShotAccuracy(a,target,d);return cLineDisciplineActive(a)?Math.min(.79,base+C_LINE_AIM_BONUS):base};
const v321MusketReloadTime=musketReloadTime;
musketReloadTime=function(a){const base=v321MusketReloadTime(a);return cLineDisciplineActive(a)?Math.max(C_LINE_RELOAD_MIN,base-C_LINE_RELOAD_BONUS):base};

const v321AwardKill=awardKill;
awardKill=function(killer,victim,method='musket'){v321AwardKill(killer,victim,method);if(!killer.isCommander&&classOf(killer)==='D'&&(killer.xp||0)>=C_PROMOTION_XP){killer.rank='C';cPromotions[killer.team]++;killer.promoteFlash=1}return killer};

function v33TargetCShare(stance){return V33_C_TARGETS[stance]??.025}
const v321ProcurementRank=procurementRank;
procurementRank=function(team,stance,reserve,desired){
 const g=generals[team],men=activeMusketeers(team),n=men.length,c=men.filter(a=>classOf(a)==='C').length,cShare=n?c/n:0,cTarget=v33TargetCShare(stance),pressure=upkeepPressure(team),canC=g.money-RANK_PRICE.C>=reserve;
 if(n>=C_MIN_ARMY&&canC&&pressure<C_MAX_PRESSURE&&cShare<cTarget){
  const e=men.filter(a=>classOf(a)==='E').length,d=men.filter(a=>classOf(a)==='D').length,eShare=n?e/n:0,dShare=n?d/n:0;
  if(eShare>=v321TargetEShare(stance)*.72&&dShare>=v321TargetDShare(stance)*.70)return'C'
 }
 return v321ProcurementRank(team,stance,reserve,desired)
};

const v321GeneralDecision=generalDecision;
generalDecision=function(team){const g=generals[team],before=g.rankPurchases.C||0;v321GeneralDecision(team);if((g.rankPurchases.C||0)>before)g.budgetPlan='BUY C'};
const v321Reset=reset;
reset=function(fixedSeed=null){v321Reset(fixedSeed);cPromotions[0]=cPromotions[1]=0;for(const g of generals)g.rankPurchases.C=g.rankPurchases.C||0;return window.__battleSim?.state?.()};

const v321TeamMetrics=teamMetrics;
teamMetrics=function(){const m=v321TeamMetrics();m.c=m.living.map(a=>a.filter(s=>classOf(s)==='C').length);return m};
const v321UpdateUI=updateUI;
updateUI=function(){v321UpdateUI();const m=teamMetrics();setPair('cclassStat',m.c[0],m.c[1]);setPair('cPromotionsStat',cPromotions[0],cPromotions[1]);setPair('rankPurchasesStat',`E ${generals[0].rankPurchases.E||0} · D ${generals[0].rankPurchases.D||0} · C ${generals[0].rankPurchases.C||0}`,`E ${generals[1].rankPurchases.E||0} · D ${generals[1].rankPurchases.D||0} · C ${generals[1].rankPurchases.C||0}`)};

const v321Draw=draw;
draw=function(){v321Draw();for(const a of actors){if(!a.alive||a.isCommander||classOf(a)!=='C')continue;ctx.save();ctx.translate(a.x,a.y);ctx.strokeStyle=a.team===0?'#f7f7f7':'#c4c4c4';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(0,0,7.5,0,Math.PI*2);ctx.stroke();ctx.restore()}};

const v321StateForV33=window.__battleSim.state;
window.__battleSim.state=()=>{const state=v321StateForV33(),m=teamMetrics();state.version='3.3';state.patchVersion='3.3.0';state.rework='c-class-line-discipline';state.cclass=[...m.c];state.cPromotions=[...cPromotions];state.classProgression.cPromotionXP=C_PROMOTION_XP;state.classProgression.unlocked=['F','E','D','C'];state.classProgression.futurePolicy='every unlocked rank may be bought or earned; higher ranks must remain rare but operationally present rather than exponentially vanishing';state.classProgression.rankEcology={...state.classProgression.rankEcology,model:'F majority / E regular / D rare-visible / C scarce-visible',cTargets:{...V33_C_TARGETS},cMinimumArmy:C_MIN_ARMY,cMaxUpkeepPressure:C_MAX_PRESSURE};state.classProgression.cClass={price:RANK_PRICE.C,promotionXP:C_PROMOTION_XP,inheritsEBayonet:true,inheritsDAssaultDrill:true,ordinaryVeteranBaseline:'E-equivalent outside D Assault Drill and C Line Discipline orders',ability:'Line Discipline',lineOrders:['VOLLEY','BRACE','HOLD','DEFEND'],aimBonus:C_LINE_AIM_BONUS,reloadBonus:C_LINE_RELOAD_BONUS,reloadMinimum:C_LINE_RELOAD_MIN,targetShareRange:[.02,.03],aiPurchaseMode:'mature-army scarce-visible procurement after E/D foundation'};return state};
Object.assign(window.__battleSim.test,{awardKill,generalDecision,procurementRank,targetCShare:v33TargetCShare,cLineDisciplineActive,shotAccuracy,musketReloadTime,rankAtLeast,armyCombatStrength});
window.__battleSim.reset=reset;
document.title='Musketeer Battle Simulator — Phase 4 v3.3';const v33Badge=document.querySelector('.version');if(v33Badge)v33Badge.textContent='v3.3';
const roadmapEl=document.getElementById('roadmap');if(roadmapEl)roadmapEl.innerHTML=roadmap.map((x,i)=>`<div class="phase ${i<3?'done':i===3?'current':i===4?'next':'future'}">Phase ${i+1} — ${x}${i<3?' · STABLE':i===3?' · NOW':i===4?' · NEXT':''}</div>`).join('');
reset();
