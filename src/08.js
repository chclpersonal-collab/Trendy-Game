'use strict';
function orderSummary(team){return generals[team].companies.map(c=>commanderFor(c)?`C${c.id+1} ${c.command.slice(0,3)}`:`C${c.id+1} ---`).join(' · ')||'—'}
function setPair(id,left,right){const el=document.getElementById(id);if(!el)return;const l=el.querySelector('[data-side="left"]'),r=el.querySelector('[data-side="right"]');if(l&&r){l.textContent=String(left);r.textContent=String(right)}else el.textContent=`${left} / ${right}`}
function setValue(id,value){const el=document.getElementById(id);if(el)el.textContent=String(value)}
function updateUI(){
 const m=teamMetrics(),integrity=[commandIntegrity(0),commandIntegrity(1)],econ=[armyEconomyMetrics(0),armyEconomyMetrics(1)],rates=[incomeRate(0),incomeRate(1)],upkeep=[upkeepRate(0),upkeepRate(1)],net=[netIncomeRate(0),netIncomeRate(1)],pct=Math.max(0,Math.min(100,Math.round(frontX/W*100))),held=[positions.filter(p=>p.owner===0).length,positions.filter(p=>p.owner===1).length],reloading=[activeMusketeers(0).filter(a=>a.reload>0).length,activeMusketeers(1).filter(a=>a.reload>0).length];
 setValue('pricingStat',`${ECONOMY_PATCH}/${ECONOMY_PATCH_TARGET}`);
 setPair('moneyStat',`$${Math.floor(generals[0].money)}`,`$${Math.floor(generals[1].money)}`);
 setPair('incomeStat',`$${rates[0].toFixed(1)}`,`$${rates[1].toFixed(1)}`);
 setPair('upkeepStat',`$${upkeep[0].toFixed(1)}`,`$${upkeep[1].toFixed(1)}`);
 setPair('netIncomeStat',`$${net[0].toFixed(1)}`,`$${net[1].toFixed(1)}`);
 setPair('avgRankStat',econ[0].avgRank.toFixed(2),econ[1].avgRank.toFixed(2));
 setPair('avgPriceStat',`$${econ[0].avgPrice.toFixed(1)}`,`$${econ[1].avgPrice.toFixed(1)}`);
 setPair('armyValueStat',`$${econ[0].value}`,`$${econ[1].value}`);
 setPair('armyStat',m.living[0].length,m.living[1].length);
 setPair('commandersStat',m.cmd[0].length,m.cmd[1].length);
 setPair('integrityStat',`${Math.round(integrity[0]*100)}%`,`${Math.round(integrity[1]*100)}%`);
 setPair('uncommandedStat',m.uncommanded[0],m.uncommanded[1]);
 setPair('rejoinedStat',commanderRejoins[0],commanderRejoins[1]);
 setPair('troopRejoinedStat',soldierRejoins[0],soldierRejoins[1]);
 setPair('strategyStat',generals[0].stance,generals[1].stance);
 setPair('budgetStat',generals[0].budgetPlan,generals[1].budgetPlan);
 setPair('reserveStat',`$${Math.round(generals[0].reserveTarget)}`,`$${Math.round(generals[1].reserveTarget)}`);
 setPair('purchasesStat',generals[0].purchases,generals[1].purchases);
 setPair('rankPurchasesStat',`E ${generals[0].rankPurchases.E} · D ${generals[0].rankPurchases.D}`,`E ${generals[1].rankPurchases.E} · D ${generals[1].rankPurchases.D}`);
 setPair('bountyStat',`$${generals[0].killIncome}`,`$${generals[1].killIncome}`);
 setPair('upkeepPaidStat',`$${Math.round(generals[0].upkeepPaid)}`,`$${Math.round(generals[1].upkeepPaid)}`);
 setValue('seedStat',seed>>>0);
 setPair('fortRankStat',fortresses[0].rank,fortresses[1].rank);
 setPair('fortHpStat',`${Math.round(fortresses[0].hp)}/${fortresses[0].maxHp}`,`${Math.round(fortresses[1].hp)}/${fortresses[1].maxHp}`);
 setPair('fortUpgradeStat',generals[0].fortUpgrades,generals[1].fortUpgrades);
 setPair('fortHitsStat',fortressHits[0],fortressHits[1]);
 setPair('siegePushStat',siegePushes[0],siegePushes[1]);
 setPair('siegeTimeStat',`${Math.round(siegeSeconds[0])}s`,`${Math.round(siegeSeconds[1])}s`);
 setPair('winsStat',warsWon[0],warsWon[1]);
 setValue('warStat',warWinner===-1?`War ${warNumber}`:`War ${warNumber} · ${warWinner===0?'Left won':'Right won'}`);
 setValue('timeStat',`${Math.floor(simTime)}s`);
 setPair('killsStat',teamKills[0],teamKills[1]);
 setPair('xpStat',m.xp[0],m.xp[1]);
 setPair('eclassStat',m.e[0],m.e[1]);
 setPair('dclassStat',m.d[0],m.d[1]);
 setPair('ePromotionsStat',ePromotions[0],ePromotions[1]);
 setPair('dPromotionsStat',dPromotions[0],dPromotions[1]);
 setPair('chargesStat',chargeCount[0],chargeCount[1]);
 setPair('bayonetKillsStat',bayonetKills[0],bayonetKills[1]);
 setPair('reloadingStat',reloading[0],reloading[1]);
 setPair('counterChargeStat',counterChargeCount[0],counterChargeCount[1]);
 setPair('counterMeleeKillsStat',counterMeleeKills[0],counterMeleeKills[1]);
 setPair('braceStat',braceCount[0],braceCount[1]);
 setPair('braceKillsStat',braceMeleeKills[0],braceMeleeKills[1]);
 setPair('form1Stat',form1Sweeps[0],form1Sweeps[1]);
 setPair('form1GuardsStat',form1Guards[0],form1Guards[1]);
 setPair('form1DisarmsStat',form1Disarms[0],form1Disarms[1]);
 setPair('form1KillsStat',form1Kills[0],form1Kills[1]);
 setPair('healingStat',Math.round(healingDone[0]),Math.round(healingDone[1]));
 setPair('recordStat',rankLabelXP(recordXP[0]),rankLabelXP(recordXP[1]));
 setPair('rearStat',rearEngagements[0],rearEngagements[1]);
 document.getElementById('pushBar').style.width=pct+'%';
 setValue('pushStat',pct+'%');
 setPair('positionsStat',held[0],held[1]);
 setValue('momentumStat',Math.abs(frontVelocity)<.025?'Even':frontVelocity>0?'Left pushing':'Right pushing');
 setPair('ordersStat',orderSummary(0),orderSummary(1));
}
function frame(now){const raw=(now-last)/1000;last=now;if(!paused){let remaining=Math.min(.12,raw*speed);while(remaining>0){const dt=Math.min(MAX_DT,remaining);update(dt);remaining-=dt}}draw();updateUI();requestAnimationFrame(frame)}
document.getElementById('pauseBtn').onclick=()=>{paused=!paused;document.getElementById('pauseBtn').textContent=paused?'Resume':'Pause'};
document.getElementById('speedBtn').onclick=()=>{speed=speed===1?2:speed===2?4:1;document.getElementById('speedBtn').textContent='Speed '+speed+'×'};
document.getElementById('restartBtn').onclick=reset;
function focusFront(behavior='smooth'){const scale=(canvas.clientWidth||W)/W,target=frontX*scale-(fieldWrap.clientWidth||0)/2;if(fieldWrap&&fieldWrap.scrollTo)fieldWrap.scrollTo({left:Math.max(0,target),behavior})}
document.getElementById('frontBtn').onclick=()=>focusFront('smooth');
