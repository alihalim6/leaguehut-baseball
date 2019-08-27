module.exports = function(module){
	module.service('gamePlayService', gamePlayService);

	gamePlayService.$inject = ['appConstants', 'appUtility'];

	function gamePlayService(appConstants, appUtility){
		var __ = appUtility;

		var teams;
		var teamStats;

		var offense;
		var defense;

		var ballCount = 0;
		var strikeCount = 0;
		
		var outCount = 0;
		var inningCount = 1.0;

		var awayTeam;
		var homeTeam;

		var inningEnded = false;
		var gameOver = false;

		var indecesUpdated = false;
		var pitchersBroughtIn = 0;

		var api = {
			outs: outs,
			inning: inning,
			balls: balls,
			strikes: strikes,
			hasInningEnded: hasInningEnded,
			setInningEnded: setInningEnded,
			setField: setField,
			getOffense: getOffense,
			getDefense: getDefense,
			getCatcher: getCatcher,
			getPitcher: getPitcher,
			getBatter: getBatter,
			handleOuts: handleOuts,
			updateCount: updateCount,
			handleHitByPitch: handleHitByPitch,
			handleSteal: handleSteal,
			updateScore: updateScore,
			handleGroundOutsFlyOuts: handleGroundOutsFlyOuts,
			handleRBI: handleRBI,
			handleSacFlysBunts: handleSacFlysBunts,
			handleGroundOutsFlyOuts: handleGroundOutsFlyOuts,
			handleFirstPitchStrikes: handleFirstPitchStrikes,
			handleTotalStrikes: handleTotalStrikes,
			handlePlateAppearance: handlePlateAppearance,
			handleHit: handleHit,
			gameIsOver: gameIsOver,
			handleLOB: handleLOB,
			handleGIDP: handleGIDP,
			updateOffenseAndDefense: updateOffenseAndDefense,
			getNumberOfPitchersBroughtIn: getNumberOfPitchersBroughtIn,
			handleError: handleError,
			resetGame: resetGame
		}

		return api;

		function outs(){
			return outCount;
		}

		function inning(){
			return inningCount;
		}

		function balls(){
			return ballCount;
		}

		function strikes(){
			return strikeCount;
		}

		function hasInningEnded(){
			return inningEnded;
		}

		function setInningEnded(reset){
			inningEnded = reset;

			if(reset === false){
				pitcherChanged = false;
				indecesUpdated = false;
			}
		}

		function setField(_offense, _defense, initializingGame){
			offense = _offense;
			defense = _defense;
			
			if(initializingGame){
				awayTeam = offense;
				homeTeam = defense;
				offense.isAwayTeam = false;
			}
		}

		function getOffense(){
			return offense;
		}

		function getDefense(){
			return defense;
		}

		function getCatcher(){
			return _.find(defense.players, {position: appConstants.GAME_PLAY.POSITIONS.CATCHER});
		}

		function getPitcher(){
			return _.find(defense.players, function(player){
				return (player.position === appConstants.GAME_PLAY.POSITIONS.PITCHER && player.active);
			});
		}

		function updateAtBat(){
			offense.atBatIndex++;

			//if end of batting order reached, start over at top
			if(offense.atBatIndex === offense.players.length){
				offense.atBatIndex = 0;
			}

			return offense.players[offense.atBatIndex];
		}

		function getBatter(){
			var playerAtBat = offense.players[offense.atBatIndex];
			var searchIndex = offense.atBatIndex;

			//get next active player
			if(playerAtBat.inactive){
				//if this inactive player is last in list of players, start search at top of order
				if(offense.atBatIndex === (offense.players.length - 1)) searchIndex = 0;

				playerAtBat = _.find(offense.players, function(player){
					return (player.active || (player.inactive === undefined));
				}, searchIndex);

				//reached the end of batting order without finding active player, so search again from top;
				//can happen if this inactive player is at end of batting order but is not the very last player in list
				if(!playerAtBat){
					playerAtBat = _.find(offense.players, function(player){
						return (player.active || (player.inactive === undefined));
					}, 0);
				}

				offense.atBatIndex = _.findIndex(offense.players, {id: playerAtBat.id});
			}

			return playerAtBat;		
		}

		function resetCount(){
			ballCount = 0;
			strikeCount = 0;
		}

		function updateInning(){
			resetCount();

			var homeTeamRuns = homeTeam.battingTotals.totalRuns;
			var awayTeamRuns = awayTeam.battingTotals.totalRuns;

			inningCount += 0.5;
			inningEnded = true;

			//game over if:
			//bottom of 9th or extra inning, team B (who would be batting in BOT 9) does not need to bat (they're winning)
			//OR top of extra inning and team A is winning or game is not tied
			if(((inningCount >= 9.5) && ((inningCount % 1) > 0) && (homeTeamRuns > awayTeamRuns))
				|| ((inningCount >= 10) && ((inningCount % 1) === 0) && (homeTeamRuns !== awayTeamRuns))){
				gameOver = true;
			}
			else{
				var inningCountStr = (Math.floor(inningCount)).toString();

				//initialize inning if not already added to scoreboard
				if(!offense.inningScores[inningCountStr] && (inningCount > 9.5)){
					offense.inningScores[inningCountStr] = 0;
					defense.inningScores[inningCountStr] = 0;
				}
			}
		
		}

		function handleOuts(){
			var inningChanging = false;
			var pitcher = getPitcher();

			outCount++;

			if(outCount === 3){
				outCount = 0;
				inningChanging = true;
				pitcher.inningsPitched = Math.ceil(pitcher.inningsPitched);

				updateInning();
			}
			else{
				pitcher.inningsPitched = parseFloat((pitcher.inningsPitched + 0.1).toFixed(1)); //needed since JS sometimes generates a bunch of decimals after
			}

			return inningChanging;
		}

		function handleWalk(){
			var pitcher = getPitcher();
			var batter = getBatter();

			pitcher.battersWalked++;
			batter.walks++;
			offense.battingTotals.totalWalks++;
		}


		function handleStrikeOut(){
			var pitcher = getPitcher();
			var batter = getBatter();

			pitcher.battersStruckOut++;
			batter.strikeOuts++;
			offense.battingTotals.totalStrikeOuts++;
		}

		function updateCount(params){
			if(params.plateAppearanceEnded){
				resetCount();
				updateAtBat();

				//return whether or not to clear bases

				if(params.plateAppearanceEnded === appConstants.FIELDED_OUT){
					//(inning half ended)
					return handleOuts();
				}
				else if(params.plateAppearanceEnded === appConstants.HOMERUN){
					return true;
				}
				//notifies batting service --> base running service of hbp
				else if(params.plateAppearanceEnded === appConstants.HIT_BY_PITCH){
					return true;
				}
			}
			else{
				if(params.addBall) ballCount++;
				if(params.addStrike) strikeCount++;

				if(params.fouledAway && strikeCount === 3){
					strikeCount = 2;
				}

				if(ballCount === 4 || strikeCount === 3){
					var batter = getBatter();

					//needed so that method doesn't return before resetCount()
					var notifyValue = false;

					if(ballCount === 4){
						handleWalk();
						updateAtBat();

						//notifies batting service --> base running service of walk
						notifyValue = true;
					}
		
					if(strikeCount === 3){
						handleStrikeOut();
						updateAtBat();

						notifyValue = handleOuts();
					}

					resetCount();
					
					return notifyValue;
				}

			}
		}

		function handleHitByPitch(batter){
			var pitcher = getPitcher();

			batter.hitByPitch++;
			pitcher.battersHitByPitch++;
		}

		function handleSteal(player, succeeded){
			var pitcher = getPitcher();

			if(succeeded){
				player.SB++;
				pitcher.stolenBasesAllowed++;
				recordStatForTeamDisplay(player, appConstants.STATS_DISPLAY.STOLEN_BASES);
			}
			else{
				player.CS++;
				pitcher.battersCaughtStealing++;
				recordStatForTeamDisplay(player, appConstants.STATS_DISPLAY.CAUGHT_STEALING);
			}
		}

		function recordStatForTeamDisplay(player, stat){
			var prefix = player.lastName + ' (';
			var suffix = 'x)';

			if(player[stat] === 1){
				player.statDisplay[stat] = player.lastName;
				offense.batting[stat].push(player.statDisplay[stat]);
			}
			else{
				var existingStatIndex = offense.batting[stat].indexOf(player[stat]);
				player.statDisplay[stat] = (prefix + player[stat] + suffix);
				offense.batting[stat].splice(existingStatIndex, 1, player.statDisplay[stat]);
			}
		}

		//check for game ending on a score instead of inning half change
		function checkForGameEnd(){
			//end game if bottom of 9th or an extra inning, and offense took the lead
			if((inningCount >= 9.5) && ((inningCount % 1) > 0) && (homeTeam.battingTotals.totalRuns > awayTeam.battingTotals.totalRuns)){
				inningEnded = true;
				gameOver = true;
			}
		}

		function updateScore(runnersScoring, isHomeRun, batter, runnersOnBeforePlay){
			var pitcher = getPitcher();
			var multiPlayerScore = Array.isArray(runnersScoring);
			var soloHR = (isHomeRun && !multiPlayerScore);
			var multiRunHR = (isHomeRun && multiPlayerScore);
			var runsScored = soloHR ? 1 : (multiRunHR ? (1 + runnersScoring.length) : 1);
			var inning = Math.floor(inningCount);

			offense.inningScores[inning] += runsScored;

			if(isHomeRun){
				pitcher.hitsAllowed++;
				pitcher.homeRunsAllowed++;
				pitcher.runsAllowed++;

				batter.hits++;
				batter.totalBases += 4;
				batter.runs++;
				batter.HR++;
				recordStatForTeamDisplay(batter, appConstants.STATS_DISPLAY.HOMERUNS);

				offense.battingTotals.totalHRs++;
				offense.battingTotals.totalHits++;
				offense.battingTotals.totalRuns++;

				if(__.RISP(runnersOnBeforePlay)){
					offense.batting.hitsWithRISP++;
					offense.batting.hittingWithRISP = (offense.batting.hitsWithRISP + ' FOR ' + offense.batting.atBatsWithRISP);
				}
			}

			//add in the runs from players that were on base
			if(multiPlayerScore){
				_.each(runnersScoring, function(runner){
					var player = _.find(offense.players, {position: runner.position});
					player.runs++;
					player.gameStatLine = __.generatePlayerGameStatLine(player);
					pitcher.runsAllowed++;
					offense.battingTotals.totalRuns++;
				});
			}
			else{
				var player = _.find(offense.players, {position: runnersScoring.position});
				player.runs++;
				player.gameStatLine = __.generatePlayerGameStatLine(player);
				pitcher.runsAllowed++;
				offense.battingTotals.totalRuns++;
			}

			checkForGameEnd();
		}

		function handleGroundOutsFlyOuts(indicator){
			var pitcher = getPitcher();

			if(indicator === appConstants.GROUND_OUT_INDICATOR){
				pitcher.groundOuts++;
			}

			if(indicator === appConstants.FLY_OUT_INDICATOR){
				pitcher.flyOuts++;
			}
		}

		function handleRBI(batter, runsBattedIn, twoOutRbi){
			batter.rbis += runsBattedIn;

			if(twoOutRbi){
				batter.twoOutRbis++;
				recordStatForTeamDisplay(batter, appConstants.STATS_DISPLAY.TWO_OUT_RBIS);
			}
		}

		function handleSacFlysBunts(batter, indicator){
			if(indicator === appConstants.GROUND_OUT_INDICATOR){
				batter.sacBunts++;
				recordStatForTeamDisplay(batter, appConstants.STATS_DISPLAY.SAC_BUNTS);
			}

			if(indicator === appConstants.FLY_OUT_INDICATOR){
				batter.sacFlys++;
				recordStatForTeamDisplay(batter, appConstants.STATS_DISPLAY.SAC_FLYS);
			}
		}

		function handleGroundOutsFlyOuts(indicator){
			var pitcher = getPitcher();

			if(indicator === appConstants.GROUND_OUT_INDICATOR){
				pitcher.groundOuts++;
			}

			if(indicator === appConstants.FLY_OUT_INDICATOR){
				pitcher.flyOuts++;
			}
		}

		function handleFirstPitchStrikes(){
			var pitcher = getPitcher();
			pitcher.firstPitchStrikes++;
		}

		function handleTotalStrikes(battingResults){
			var pitcher = getPitcher();
			pitcher.totalStrikes++;

			if(battingResults.contactMade){
				if(battingResults.fouledAway) pitcher.foulBalls++;
				else pitcher.ballsPutIntoPlay++;
			}
			else{
				if(battingResults.umpireCallOnNonSwing === appConstants.STRIKE) pitcher.calledStrikes++;
				else pitcher.swingingStrikes++;
			}
		}

		//ABs/PAs
		function handlePlateAppearance(batter, validAB, runnersOnBeforePlay){
			batter.plateAppearances++;

			if(validAB){
				batter.atBats++;
				offense.battingTotals.totalABs++;

				if(__.RISP(runnersOnBeforePlay)){
					offense.batting.atBatsWithRISP++;
					offense.batting.hittingWithRISP = (offense.batting.hitsWithRISP + ' FOR ' + offense.batting.atBatsWithRISP);
				}
			}
		}

		//TO DO: NO HIT IF ERROR
		function handleHit(params){
			var batter = params.batter;
			var baseRunners = params.baseRunners;
			var playersThrownOut = params.playersThrownOut;
			var fieldersChoice = params.fieldersChoice;
			var baseBatterAdvancedTo = params.baseBatterAdvancedTo;
			var runnersOnBeforePlay = params.runnersOnBeforePlay;
			var inTheParkHR = params.inTheParkHR;

			var potentialHit = false;
			var creditHit = false;

			if(baseRunners.length){
				_.each(baseRunners, function(baseRunner){
					//batter made it on base
					if(baseRunner.position === batter.position){
						potentialHit = true;
					}
				});
			}

			//check if batter got thrown out trying to take extra base
			//if so, still give credit for hit
			if(playersThrownOut){
				var batterThrownOut = false;

				_.each(playersThrownOut, function(player){
					if(player.position === batter.position){
						batterThrownOut = true;

						if(player.base > 1){
							potentialHit = true;

							return false;
						}
					}
				});
			}

			if(inTheParkHR){
				potentialHit = true;
			}

			if(potentialHit){
				var pitcher = getPitcher();
				var fieldersChoiceOrOutOnXB = (fieldersChoice || batterThrownOut);
				var notFieldersChoiceNorThrownOut = (!fieldersChoice && !batterThrownOut);
				
				if(((baseBatterAdvancedTo === appConstants.GAME_PLAY.BASES['1'].baseId) && !fieldersChoice) || ((baseBatterAdvancedTo === appConstants.GAME_PLAY.BASES['2'].baseId) && fieldersChoiceOrOutOnXB)){
					batter.singles++;
					batter.totalBases++;
					batter.hits++;
					pitcher.hitsAllowed++;
					offense.battingTotals.totalHits++;
					creditHit = true;
				}
				else if(((baseBatterAdvancedTo === appConstants.GAME_PLAY.BASES['2'].baseId) && notFieldersChoiceNorThrownOut) || ((baseBatterAdvancedTo === appConstants.GAME_PLAY.BASES['3'].baseId) && fieldersChoiceOrOutOnXB)){
					batter.doubles++;
					batter.totalBases += 2;
					batter.hits++;
					pitcher.hitsAllowed++;
					pitcher.doublesAllowed++;
					offense.battingTotals.totalHits++;
					recordStatForTeamDisplay(batter, appConstants.STATS_DISPLAY.DOUBLES);
					creditHit = true;
				}
				else if(((baseBatterAdvancedTo === appConstants.GAME_PLAY.BASES['3'].baseId) && notFieldersChoiceNorThrownOut) || ((baseBatterAdvancedTo === appConstants.GAME_PLAY.BASES['4'].baseId) && fieldersChoiceOrOutOnXB)){
					batter.triples++;
					batter.totalBases += 3;
					batter.hits++;
					pitcher.hitsAllowed++;
					pitcher.triplesAllowed++;
					offense.battingTotals.totalHits++;
					recordStatForTeamDisplay(batter, appConstants.STATS_DISPLAY.TRIPLES);
					creditHit = true;
				}
				//in the park HR
				else if((baseBatterAdvancedTo === appConstants.GAME_PLAY.BASES['4'].baseId) && notFieldersChoiceNorThrownOut){
					batter.totalBases += 4;
					batter.hits++;
					pitcher.hitsAllowed++;
					offense.battingTotals.totalHits++;
					creditHit = true;
				}

				if(__.RISP(runnersOnBeforePlay)){
					if(creditHit) offense.batting.hitsWithRISP++;

					offense.batting.hittingWithRISP = (offense.batting.hitsWithRISP + ' FOR ' + offense.batting.atBatsWithRISP);
				}
			}
		}

		function gameIsOver(){
			return gameOver;
		}

		function handleLOB(batter, numberLeftOnBase, leftRISPwithTwoOut){
			batter.lob += numberLeftOnBase;

			if(inningEnded){
				offense.battingTotals.totalLob += numberLeftOnBase;

				if(leftRISPwithTwoOut){
					batter.leftRISPwithTwoOut++;
					recordStatForTeamDisplay(batter, appConstants.STATS_DISPLAY.LEFT_RISP_WITH_TWO_OUTS);
				}
			}
		}

		function handleGIDP(batter){
			batter.GIDP++;
			recordStatForTeamDisplay(batter, appConstants.STATS_DISPLAY.GIDP);
		}

		function handlePitcherChange(){
			var pitcher = getPitcher();
			var newPitcher;

			pitcher.active = false;
			pitcher.inactive = true;

			if(pitcher.pitcherTypeToFollow === appConstants.GAME_PLAY.POSITIONS.MR){
				newPitcher = _.find(defense.players, {isMiddleReliever: true});

				//only increment once (playByPlayService only needs to know when there has been a MR and then closer brought in)
				if(!pitchersBroughtIn) pitchersBroughtIn++;
			}
			else{
				newPitcher = _.find(defense.players, {isCloser: true});
				pitchersBroughtIn++;
			}

			newPitcher.active = true;
			newPitcher.inactive = false;

			return {
				takenOut: pitcher,
				broughtIn: newPitcher
			};
		}

		function updateOffenseAndDefense(){
			var pitcher = getPitcher();
			var pitcherChange;
			var changePitcher = false;

			//check if should change pitcher
			if(pitcher.active && !gameOver){
				if(typeof pitcher.takePitcherOut === 'function'){
					changePitcher = pitcher.takePitcherOut(inningCount, defense);
				}
				else{
					changePitcher = pitcher.takePitcherOut;
				}

				if(changePitcher){
					pitcherChange = handlePitcherChange();
				}
			}

			setField(defense, offense);

			return pitcherChange;
		}

		function getNumberOfPitchersBroughtIn(){
			return pitchersBroughtIn;
		}

		function handleError(defender){
			defender.errors++;
			defense.totalErrors++;
		}

		function resetGame(){
			ballCount = 0;
			strikeCount = 0;
			outCount = 0;
			inningCount = 1.0;
			inningEnded = false;
			indecesUpdated = false;
			pitchersBroughtIn = 0;
		}
	}
}