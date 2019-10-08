/**
 * Manages count, outs, innings, teams, and other gameplay information.
 */
module.exports = function(module){
	module.service('gamePlayService', ['appConstants', 'appUtility', function gamePlayService(appConstants, appUtility){
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

		var pendingPitcherChange;

		var api = {
			outs: outs,
			inning: inning,
			balls: balls,
			strikes: strikes,
			hasInningEnded: hasInningEnded,
			resetInning: resetInning,
			setField: setField,
			getOffense: getOffense,
			getDefense: getDefense,
			getCatcher: getCatcher,
			getPitcher: getPitcher,
			getBatter: getBatter,

			handleOuts: handleOuts,
			handleHitByPitch: handleHitByPitch,
			handleSteal: handleSteal,
			handleLOB: handleLOB,
			handleGIDP: handleGIDP,
			handleGroundOutsFlyOuts: handleGroundOutsFlyOuts,
			handleRBI: handleRBI,
			handleSacFlysBunts: handleSacFlysBunts,
			handleGroundOutsFlyOuts: handleGroundOutsFlyOuts,
			handleFirstPitchStrikes: handleFirstPitchStrikes,
			handleTotalStrikes: handleTotalStrikes,
			handlePlateAppearance: handlePlateAppearance,
			handleHit: handleHit,
			handleError: handleError,

			updateCount: updateCount,	
			updateScore: updateScore,
			gameIsOver: gameIsOver,
			checkForPitcherChange: checkForPitcherChange,
			handlePitcherChange: handlePitcherChange,
			getPitcherChange: getPitcherChange,
			
			resetGame: resetGame
		};

		return api;

		/**
		 * Returns the current number of outs.
		 */
		function outs(){
			return outCount;
		}

		/**
		 * Returns the current inning (half inning means bottom of that inning).
		 */
		function inning(){
			return inningCount;
		}

		/**
		 * Returns the current number of balls in the count.
		 */
		function balls(){
			return ballCount;
		}

		/**
		 * Returns the current number of strikes in the count.
		 */
		function strikes(){
			return strikeCount;
		}

		/**
		 * Returns true if the current inning has ended after the most recent play.
		 */
		function hasInningEnded(){
			return inningEnded;
		}

		/**
		 * Sets the flag indicating the current inning is not over.
		 */
		function resetInning(){
			inningEnded = false;
		}

		/**
		 * Sets each team in the game to be on offense or defense as given in the params (on game initialization, inning (half) changes).
		 */
		function setField(_offense, _defense, initializingGame){
			offense = _offense;
			defense = _defense;
			
			if(initializingGame){
				awayTeam = offense;
				homeTeam = defense;
				offense.isAwayTeam = false;
			}
		}

		/**
		 * Returns the team currently on offense.
		 */
		function getOffense(){
			return offense;
		}

		/**
		 * Returns the team currently on defense.
		 */
		function getDefense(){
			return defense;
		}

		/**
		 * Returns the current defense's catcher.
		 */
		function getCatcher(){
			return _.find(defense.players, {position: appConstants.GAME_PLAY.POSITIONS.CATCHER});
		}

		/**
		 * Returns the current defense's pitcher.
		 */
		function getPitcher(){
			return _.find(defense.players, function(player){
				return ((player.position === appConstants.GAME_PLAY.POSITIONS.PITCHER) && player.active);
			});
		}

		/**
		 * Increments the batting order index for the current offense.
		 */
		function updateAtBat(){
			offense.atBatIndex++;

			//if end of batting order reached, start over at top
			if(offense.atBatIndex === offense.players.length){
				offense.atBatIndex = 0;
			}

			return offense.players[offense.atBatIndex];
		}

		/**
		 * Returns the current player at bat.
		 */
		function getBatter(){
			var playerAtBat = offense.players[offense.atBatIndex];
			var searchIndex = offense.atBatIndex;

			//get next active player if index points to an inactive player
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

		/**
		 * Resets the current count.
		 */
		function resetCount(){
			ballCount = 0;
			strikeCount = 0;
		}

		/**
		 * Increments the current inning and checks if the game has ended.
		 */
		function updateInning(){
			resetCount();

			var homeTeamRuns = homeTeam.battingTotals.totalRuns;
			var awayTeamRuns = awayTeam.battingTotals.totalRuns;

			inningCount += 0.5;
			inningEnded = true;

			//game over if:
			//it is now bottom of 9th or extra inning and home team (who would be batting in BOT 9) does not need to bat (they're winning)
			//OR it is now top of extra inning and game is not tied (home team won with walk-off or failed to win in bottom of previous inning)
			if(((inningCount >= 9.5) && (inningCount % 1) && (homeTeamRuns > awayTeamRuns))
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

		/**
		 * Increments number of outs in the current inning and checks if the inning has ended.
		 */
		function handleOuts(){
			var inningChanging = false;
			var pitcher = getPitcher();

			outCount++;
			pitcher.inningsPitched = parseFloat((pitcher.inningsPitched + 0.1).toFixed(1)); //needed since JS sometimes generates a bunch of decimals after

			//a whole inning was pitched if adding 0.7 to inningsPitched (e.g 2.3) nothces whole number
			if((pitcher.inningsPitched + 0.7) / Math.ceil(pitcher.inningsPitched) === 1) pitcher.inningsPitched = Math.ceil(pitcher.inningsPitched);

			if(outCount === 3){
				outCount = 0;
				inningChanging = true;

				updateInning();
			}

			return inningChanging;
		}

		/**
		 * Handles stats update when batter is walked.
		 */
		function handleWalk(){
			var pitcher = getPitcher();
			var batter = getBatter();

			pitcher.battersWalked++;
			pitcher.walksAllowedByInning[Math.floor(inningCount)]++;
			batter.walks++;
			offense.battingTotals.totalWalks++;
		}

		/**
		 * Handles stats update when batter is struck out.
		 */
		function handleStrikeOut(){
			var pitcher = getPitcher();
			var batter = getBatter();

			pitcher.battersStruckOut++;
			batter.strikeOuts++;
			offense.battingTotals.totalStrikeOuts++;
		}

		/**
		 * Handles stats update when batter is hit by pitch.
		 */
		function handleHitByPitch(batter){
			var pitcher = getPitcher();

			batter.hitByPitch++;
			pitcher.battersHitByPitch++;
			pitcher.walksAllowedByInning[inning]++;
		}

		/**
		 * Handles stats update when runner attempts to steal a base.
		 */
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

		/**
		 * Handles stats update for runners LOB.
		 */
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

		/**
		 * Handles stats update when runner GIDP.
		 */
		function handleGIDP(batter){
			batter.GIDP++;
			recordStatForTeamDisplay(batter, appConstants.STATS_DISPLAY.GIDP);
		}

		/**
		 * Handles stats update when batter grounds or flys out.
		 */
		function handleGroundOutsFlyOuts(indicator){
			var pitcher = getPitcher();

			if(indicator === appConstants.GROUND_OUT_INDICATOR){
				pitcher.groundOuts++;
			}

			if(indicator === appConstants.FLY_OUT_INDICATOR){
				pitcher.flyOuts++;
			}
		}

		/**
		 * Handles stats update for RBIs.
		 */
		function handleRBI(batter, runsBattedIn, twoOutRbi){
			batter.rbis += runsBattedIn;

			if(twoOutRbi){
				batter.twoOutRbis++;
				recordStatForTeamDisplay(batter, appConstants.STATS_DISPLAY.TWO_OUT_RBIS);
			}
		}

		/**
		 * Handles stats update when batter gets a sac fly or bunt.
		 */
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

		/**
		 * Handles stats update for first pitch strikes.
		 */
		function handleFirstPitchStrikes(){
			var pitcher = getPitcher();
			pitcher.firstPitchStrikes++;
		}

		/**
		 * Handles stats update for total strikes.
		 */
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

		/**
		 * Handles stats update for PAs, ABs and team hitting with RISP.
		 */
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

		/**
		 * Handles stats update when batter gets a hit.
		 */
		function handleHit(params){
			var batter = params.batter;
			var baseRunners = params.baseRunners;
			var playersThrownOut = params.playersThrownOut;
			var fieldersChoice = params.fieldersChoice;
			var baseBatterAdvancedTo = params.baseBatterAdvancedTo;
			var runnersOnBeforePlay = params.runnersOnBeforePlay;
			var inTheParkHR = params.inTheParkHR;
			var inning = Math.floor(inningCount);

			var potentialHit = false;
			var creditHit = false;
			var batterThrownOut = false;
			var batterThrownOutOnXB = false;

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
				_.each(playersThrownOut, function(player){
					if(player.position === batter.position){
						batterThrownOut = true;

						if(player.base > 1){
							batterThrownOutOnXB = batterThrownOut;
							potentialHit = true;

							return false;
						}
					}
				});
			}

			if(inTheParkHR){
				potentialHit = true;
			}

			if(potentialHit && !params.errorOnPlay){
				var pitcher = getPitcher();
				var fieldersChoiceOrOutOnXB = (fieldersChoice || batterThrownOutOnXB);
				var notFieldersChoiceNorThrownOut = (!fieldersChoice && !batterThrownOut);
				
				if(((baseBatterAdvancedTo === appConstants.GAME_PLAY.BASES['1'].baseId) && !fieldersChoice) || ((baseBatterAdvancedTo === appConstants.GAME_PLAY.BASES['2'].baseId) && fieldersChoiceOrOutOnXB)){
					batter.singles++;
					batter.totalBases++;
					batter.hits++;
					pitcher.hitsAllowed++;
					pitcher.hitsAllowedByInning[inning]++;
					offense.battingTotals.totalHits++;
					creditHit = true;
				}
				else if(((baseBatterAdvancedTo === appConstants.GAME_PLAY.BASES['2'].baseId) && notFieldersChoiceNorThrownOut) || ((baseBatterAdvancedTo === appConstants.GAME_PLAY.BASES['3'].baseId) && fieldersChoiceOrOutOnXB)){
					batter.doubles++;
					batter.totalBases += 2;
					batter.hits++;
					pitcher.hitsAllowed++;
					pitcher.hitsAllowedByInning[inning]++;
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
					pitcher.hitsAllowedByInning[inning]++;
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
					pitcher.hitsAllowedByInning[inning]++;
					offense.battingTotals.totalHits++;
					creditHit = true;
				}

				if(__.RISP(runnersOnBeforePlay)){
					if(creditHit) offense.batting.hitsWithRISP++;

					offense.batting.hittingWithRISP = (offense.batting.hitsWithRISP + ' FOR ' + offense.batting.atBatsWithRISP);
				}
			}
		}

		/**
		 * Handles stats update when fielder is charged with an error.
		 */
		function handleError(defender){
			defender.errors++;
			defense.totalErrors++;
		}

		/**
		 * Updates given team stat with given player's name. If player has recorded the stat multiple times, an indicator is appended to his name showing how many times.
		 */
		function recordStatForTeamDisplay(player, stat){
			var prefix = player.lastName + ' (';
			var suffix = 'x)';

			if(player[stat] === 1){
				player.statDisplay[stat] = player.lastName;
				offense.batting[stat].push(player.statDisplay[stat]);
			}
			else{
				var existingStatIndex = offense.batting[stat].indexOf(player.statDisplay[stat]);
				player.statDisplay[stat] = (prefix + player[stat] + suffix);
				offense.batting[stat].splice(existingStatIndex, 1, player.statDisplay[stat]);
			}
		}

		/**
		 * Checks for game ending as a result of a score (walk-off).
		 */
		function checkForGameEnd(){
			//end game if bottom of 9th or an extra inning, and offense took the lead
			if((inningCount >= 9.5) && ((inningCount % 1) > 0) && (homeTeam.battingTotals.totalRuns > awayTeam.battingTotals.totalRuns)){
				inningEnded = true;
				gameOver = true;
				pendingPitcherChange = null;
			}
		}

		/**
		 * Updates the count of the current plate appearance, checks if it has ended and notifies concerned components of result.
		 */
		function updateCount(params){
			if(params.plateAppearanceEnded){
				resetCount();
				updateAtBat();

				if(params.plateAppearanceEnded === appConstants.FIELDED_OUT){
					//clear bases if inning (half) ended
					return handleOuts();
				}
				else if(params.plateAppearanceEnded === appConstants.HOMERUN){
					//clear bases
					return true;
				}
				else if(params.plateAppearanceEnded === appConstants.HIT_BY_PITCH){
					//notifies batting service which notifies base running service of HBP
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
					var notifyValue = false;

					if(ballCount === 4){
						handleWalk();
						updateAtBat();

						//notifies batting service which notifies base running service of walk
						notifyValue = true;
					}
		
					if(strikeCount === 3){
						handleStrikeOut();
						updateAtBat();

						//notifies batting service which notifies base running service whether or not to clear bases
						notifyValue = handleOuts();
					}

					resetCount();
					
					return notifyValue;
				}

			}
		}

		/**
		 * Handles stats update when the current offense scores and checks for walk-off win.
		 */
		function updateScore(runnersScoring, isHomeRun, batter, runnersOnBeforePlay){
			var pitcher = getPitcher();
			var offensesPitcher = _.find(offense.players, function(player){
				return ((player.position === appConstants.GAME_PLAY.POSITIONS.PITCHER) && !player.inactive);
			});

			var multiPlayerScore = Array.isArray(runnersScoring);
			var soloHR = (isHomeRun && !multiPlayerScore);
			var multiRunHR = (isHomeRun && multiPlayerScore);
			var runsScored = soloHR ? 1 : (multiRunHR ? (1 + runnersScoring.length) : 1);
			var inning = Math.floor(inningCount);

			offense.inningScores[inning] += runsScored;

			if(isHomeRun){
				pitcher.hitsAllowed++;
				pitcher.hitsAllowedByInning[inning]++;
				pitcher.homeRunsAllowed++;
				pitcher.homeRunsAllowedByInning[inning]++;
				pitcher.runsAllowed++;
				pitcher.runsAllowedByInning[inning]++;
				

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
					var player = _.find(offense.players, function(player){
						return ((player.position === runner.position) && !player.inactive);
					});

					player.runs++;
					player.gameStatLine = __.generatePlayerGameStatLine(player);
					pitcher.runsAllowed++;
					pitcher.runsAllowedByInning[inning]++;
					offense.battingTotals.totalRuns++;
				});
			}
			else{
				var player = _.find(offense.players, function(player){
					return ((player.position === runnersScoring.position) && !player.inactive);
				});

				player.runs++;
				player.gameStatLine = __.generatePlayerGameStatLine(player);
				pitcher.runsAllowed++;
				pitcher.runsAllowedByInning[inning]++;
				offense.battingTotals.totalRuns++;
			}

			//only count deficit against pitcher while he is in game
			defense.currentPitcherScoreDeficit[pitcher.id] += runsScored;

			//if score happens in top of 1st inning, the current offense's pitcher deficit won't be initialized yet
			if(!offense.currentPitcherScoreDeficit[offensesPitcher.id]) offense.currentPitcherScoreDeficit[offensesPitcher.id] = 0;

			offense.currentPitcherScoreDeficit[offensesPitcher.id] -= runsScored;

			checkForGameEnd();
		}

		/**
		 * Returns if game has ended.
		 */
		function gameIsOver(){
			return gameOver;
		}

		/**
		 * Handles pitcher changes.
		 */
		function changePitcher(pitcherBroughtIn){
			var pitcher = getPitcher();

			pitcher.active = false;
			pitcher.inactive = true;
			pitcherBroughtIn.active = true;
			pitcherBroughtIn.inactive = false;
		}

		/**
		 * Checks if these should be a pitcher change. If so, an object with info on the change is set inidcating so.
		 */
		function checkForPitcherChange(inningOnPlay){
			var pitcher = getPitcher();
			var newPitcher;
			var changePitcherEvaluation;

			if(pitcher.active && !gameOver){
				changePitcherEvaluation = pitcher.takePitcherOut({
					inning: inningOnPlay,
					defense: defense,
					currentOuts: outCount,
					inningEnded: inningEnded
				});
				
				if(changePitcherEvaluation.makeChange){
					if(pitcher.pitcherTypeToFollow === appConstants.GAME_PLAY.POSITIONS.MR){
						newPitcher = _.find(defense.players, {isMiddleReliever: true});
					}
					else{
						newPitcher = _.find(defense.players, {isCloser: true});
					}

					pendingPitcherChange = {
						takenOut: pitcher,
						broughtIn: newPitcher,
						changeOnInningEnd: changePitcherEvaluation.changeOnInningEnd,
						dueToBadPerformance: changePitcherEvaluation.dueToBadPerformance
					};
				}
			}
		}

		/**
		 * If a pitcher change is pending, calls a function that changes the current defense's pitcher and clears the indicator object.
		 */
		function handlePitcherChange(){
			//if there is a pitcher change waiting to happen, execute it then clear it out
			if(pendingPitcherChange){
				changePitcher(pendingPitcherChange.broughtIn);
				pendingPitcherChange = null;
			}
		}

		/**
		 * Returns any pending pitcher change object.
		 */
		function getPitcherChange(){
			return pendingPitcherChange;
		}

		/**
		 * Clears this service's game data on close of a game.
		 */
		function resetGame(){
			ballCount = 0;
			strikeCount = 0;
			outCount = 0;
			inningCount = 1.0;
			inningEnded = false;
			gameOver = false;
			pendingPitcherChange = null;
		}
	}]);
}