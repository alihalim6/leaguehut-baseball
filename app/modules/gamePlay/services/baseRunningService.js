module.exports = function(module){
	module.service('baseRunningService', baseRunningService);

	baseRunningService.$inject = ['gamePlayService', 'appUtility', 'appConstants', 'fieldingConstants', 'baseRunningConstants'];

	function baseRunningService(gamePlayService, appUtility, appConstants, fieldingConstants, baseRunningConstants){
		var __ = appUtility;
		var baseRunners = [];
		var baseRunningResults = {};

		var api = {
			getBaseRunnersStatus: getBaseRunnersStatus,
			setClearBases: setClearBases,
			startBaseRunners: startBaseRunners,
			handlePlayAction: handlePlayAction,
			getBaseRunners: getBaseRunners,
			handleRunnerOnAirbornBall: handleRunnerOnAirbornBall,
			getBaseRunnerIsAdvancingTo: getBaseRunnerIsAdvancingTo,
			getResults: getResults, 
			resetResults: resetResults,
			clearBases: clearBases,
			handleStealAttempt: handleStealAttempt,
			checkForBaseStealing: checkForBaseStealing
		};

		return api;

		function getBaseRunnersStatus(){
			var currentBaseRunners = {code : 0, runnersOn: []};
			var runnerOn1st = false;
			var runnerOn2nd = false;
			var runnerOn3rd = false;

			_.each(baseRunners, function(baseRunner){
				if(baseRunner.currentBase === 1){
					runnerOn1st = baseRunner;
				}
				else if(baseRunner.currentBase === 2){
					runnerOn2nd = baseRunner;
				}
				else if(baseRunner.currentBase === 3){
					runnerOn3rd = baseRunner;
				}

				currentBaseRunners.runnersOn.push(baseRunner);
			});

			if(runnerOn1st){
				currentBaseRunners.code = 1;

				if(runnerOn2nd){
					currentBaseRunners.code = 12;

					if(runnerOn3rd){
						currentBaseRunners.code = 123;
					}
				}
				else if(runnerOn3rd){
					currentBaseRunners.code = 13;
				}
			}
			else if(runnerOn2nd){
				currentBaseRunners.code = 2;

				if(runnerOn3rd){
					currentBaseRunners.code = 23;
				}
			}
			else if(runnerOn3rd){
				currentBaseRunners.code = 3;
			}

			currentBaseRunners.runnerOn1st = runnerOn1st;
			currentBaseRunners.runnerOn2nd = runnerOn2nd;
			currentBaseRunners.runnerOn3rd = runnerOn3rd;
			
			return currentBaseRunners;
		}

		//method to set flag to clear bases at end of play
		function setClearBases(){
			baseRunningResults.clearBases = true;
		}

		function determineNextBase(distanceRan){
			return (Math.floor(distanceRan / 90) + 1);
		}

		function startBaseRunners(currentTime, walkedBatter){
			var currentBatter = (walkedBatter || gamePlayService.getBatter());

			//add batter to runners
			//TO DO: ACCOUNT FOR TIME BATTER TAKES TO ACTUALLY START RUNNING FOR HIS DISTANCE RAN IN TIME

			var delta = __.getRandomDecimalInclusive(0, (currentBatter.runSpeed * baseRunningConstants.BASE_RUNNING_SPEED_MULTIPLIER), 2);
			var aidedByRunSpeed = (__.getRandomIntInclusive(0, 100) <= currentBatter.runSpeed);
			delta *= aidedByRunSpeed ? 1 : -1;
			var runRate = (appConstants.GAME_PLAY.AVG_FPS_MOVED_FOR_HARDEST_PLAYS_MADE + delta);
			var projectedRunningRate = (appConstants.GAME_PLAY.AVG_FPS_MOVED_FOR_HARDEST_PLAYS_MADE + 
				(runRate - appConstants.GAME_PLAY.AVG_FPS_MOVED_FOR_HARDEST_PLAYS_MADE) / __.getRandomIntInclusive(baseRunningConstants.PROJ_RUN_RATE_DIVIDER_MIN, baseRunningConstants.PROJ_RUN_RATE_DIVIDER_MAX));
			var distanceRanAtCurrentTime = (runRate * currentTime);
			var nextBase = determineNextBase(distanceRanAtCurrentTime);
			var distanceFromNextBase = (appConstants.GAME_PLAY.BASES[nextBase].distance - distanceRanAtCurrentTime);
			var baseAfterNext = (nextBase == 4) ? 0 : (nextBase + 1);
			var distanceFromBaseAfterNext = baseAfterNext ? (appConstants.GAME_PLAY.BASES[baseAfterNext].distance - distanceRanAtCurrentTime) : 0;
			var threeBasesAhead = (nextBase < 3) ? (nextBase + 2) : 0;
			var distanceFromBaseThreeBasesAhead = threeBasesAhead ? appConstants.GAME_PLAY.BASES[threeBasesAhead].distance - distanceRanAtCurrentTime : 0;

			//IN PARK HR...PROBABLY ONLY HAPPEN WITH FIELDING MISTAKE...HANDLE LATER
			/*var fourBasesAhead = (nextBase == 1) ? nextBase + 3 : 0;
			var distanceFromBaseFourBasesAhead = fourBasesAhead ? SIMULATION_PLAY_CONSTANTS.BASES[fourBasesAhead].distance - distanceRanAtCurrentTime : 0;*/

			var batter = {
				currentDistance : 0,
				currentBase : 0,
				nextBase : nextBase,
				distanceFromNextBase : distanceFromNextBase,
				baseAfterNext : baseAfterNext,
				distanceFromBaseAfterNext : distanceFromBaseAfterNext,
				threeBasesAhead : threeBasesAhead,
				distanceFromBaseThreeBasesAhead : distanceFromBaseThreeBasesAhead,
				projectedRunningRate : projectedRunningRate,
				actualRunningRate : runRate,
				position : currentBatter.position,
				firstName: currentBatter.firstName,
				lastName: currentBatter.lastName,
				runSpeed: currentBatter.runSpeed
			};

			baseRunners.push(batter);
			
			return baseRunners;
		}

		function advancingIsOptional(currentBase){
			var currentBases = getBaseRunnersStatus();
			return ((currentBase === 2) && !currentBases.runnerOn1st) || ((currentBase === 3) && (!currentBases.runnerOn2nd || (currentBases.runnerOn2nd && !currentBases.runnerOn1st)));
		}

		function updateBaseRunners(params){
		 	for(var i = 0; i < baseRunners.length; i++){
				var currentBase = baseRunners[i].currentBase;

				//thrown/caught out
				//added position check for following scenario
				//man on 2nd and 3rd; both going to home plate; on such play, we can assume leading runner will be safe if trailing runner think he has chance
				//so if trailing runner is the potential play to be made, make sure if he is thrown out, he is the one removed and not the lead since his base will match
				//the attempted base too; if trailer is safe, lead will already be marked as safe on ADVANCE
				if((currentBase === params.attemptedBase) && (params.action === appConstants.REMOVE) && (params.runnersPosition === baseRunners[i].position)){
					var playerThrownOut = {base : params.attemptedBase, position : baseRunners[i].position};
					baseRunningResults.playersThrownOut = baseRunningResults.playersThrownOut ? baseRunningResults.playersThrownOut : [];
					baseRunningResults.playersThrownOut.push(playerThrownOut);
					baseRunners.splice(i, 1);
					i--;

					continue;
				}
				
				//only advance on HBP or walk if runner coming to your base
				if(params.action === appConstants.ADVANCE_BATTER_ONLY){
					if(advancingIsOptional(currentBase)){
						continue;
					}
					else{
						baseRunners[i].currentBase++;
						currentBase++;

						if(!baseRunningResults.runnersAdvancedOnHbpOrWalk) baseRunningResults.runnersAdvancedOnHbpOrWalk = [];

						baseRunningResults.runnersAdvancedOnHbpOrWalk.push(baseRunners[i]);
					}
				}

				//if double play in progress, wait until the second play action to process other runners in case runner would score on this (1st)
				//action but 3rd out is recorded on second throw
				if(params.doublePlay){
					continue;
				}

				//safely advanced to home plate, remove runner
				//only count score if third out not recorded on force out; else no score and he is LOB

				//TO DO (from stack overflow):
				//if the 3rd out is the result of gunning for extra bases (example: bases loaded, batter hits past third baseman, batter reaches first 
				//and goes for second, left fielder throws to second baseman who tags out the batter before he reaches 2nd base), then any run scored 
				//(given the runner has reached home before the batter was tagged out) will count as the batter reached first base.

				//If the 3rd out is the result of tagging up (example: runner on 1st and 3rd, batter hits sacrifice fly, outfielder catches the ball for 
				//the out, runner on 3rd reaches home, runner on 1st goes for 2nd but gets tagged out), then the run from 3rd base will count because the 
				//out at 2nd was not a force-out only if the runner from 3rd base touches home plate before the out at 2nd is made.

				//4.09 HOW A TEAM SCORES.
				/*(a) One run shall be scored each time a runner legally advances to and touches first, second, third and home base before three men are put out to end the inning.
						EXCEPTION: A run is not scored if the runner advances to home base during a play in which the third out is made.
						(1) by the batter-runner before he touches first base;
						(2) by any runner being forced out; or
						(3) by a preceding runner who is declared out because he failed to touch one of the bases.*/
				
				if(((currentBase === 4) && !params.thirdOutRecorded) || ((currentBase === 4) && params.thirdOutRecorded && !params.forceOut)){
					if(!baseRunningResults.playersWhoScored) baseRunningResults.playersWhoScored = [];

					baseRunningResults.playersWhoScored.push(baseRunners[i]);
					gamePlayService.updateScore(baseRunners[i]);
					var batterPosition = params.batter ? params.batter.position : '';

					//check for in the park HR
					if(batterPosition == baseRunners[i].position){
						baseRunningResults.inTheParkHR = true;
					}

					baseRunners.splice(i, 1);
					i--;

					continue;
				}
				else if(params.thirdOutRecorded){
					if(currentBase === 4){
						baseRunners[i].currentBase -= 1;
					}

					continue;
				}

				var nextBase = (currentBase + 1);
				var baseAfterNext = (nextBase === 4) ? 0 : (nextBase + 1);
				var threeBasesAhead = (nextBase === 2) ? (baseAfterNext + 1) : 0;
				baseRunners[i].nextBase = nextBase;
				baseRunners[i].baseAfterNext = baseAfterNext;
				baseRunners[i].threeBasesAhead = threeBasesAhead;

				//TO DO: ADD DISTANCE FOR STARTING TO RUN AS PITCH THROWN
				//LARGER LEAD OFF ON 3RD WITH L PITCHER, E.G.
				var leadOffDistance = __.getRandomIntInclusive(baseRunningConstants.BASE_RUNNING_SPEED_MULTIPLIER, baseRunningConstants.BASE_RUNNING_SPEED_MULTIPLIER);
				baseRunners[i].leadOffDistance = leadOffDistance;
				var currentDistance = (appConstants.GAME_PLAY.BASES[currentBase].distance + leadOffDistance);
				baseRunners[i].currentDistance = currentDistance;
				baseRunners[i].distanceFromNextBase = (appConstants.GAME_PLAY.BASES[nextBase].distance) - currentDistance;
				baseRunners[i].distanceFromBaseAfterNext = baseAfterNext ? (appConstants.GAME_PLAY.BASES[baseAfterNext].distance - currentDistance) : 0;
				baseRunners[i].distanceFromBaseThreeBasesAhead = threeBasesAhead ? (appConstants.GAME_PLAY.BASES[threeBasesAhead].distance - currentDistance) : 0;
			}
		}

		function handlePlayAction(params){
			var clearBases = false;
			var batter = gamePlayService.getBatter();

			if(params.attemptedBase){
				var delta = (params.attemptedBase.runnersActualRunningRate * params.attemptedBase.timeToBase);

				if(params.attemptedBase.runnerGoingBackToBase){
					delta *= -1;
				}

				var distanceRanAtCurrentTime = (params.attemptedBase.runnersCurrentDistance + delta);
				var baseReachedInTime = params.attemptedBase.runnerGoingBackToBase ? 
					(distanceRanAtCurrentTime <= appConstants.GAME_PLAY.BASES[params.attemptedBase.base].distance) : (distanceRanAtCurrentTime >= appConstants.GAME_PLAY.BASES[params.attemptedBase.base].distance);

				if(baseReachedInTime){
					if(params.attempt === 1) baseRunningResults.firstAttemptRunnerSafe = true;
					else baseRunningResults.secondAttemptRunnerSafe = true;

					if(!params.updateOutsOnly) gamePlayService.updateCount({plateAppearanceEnded : true});
					
					if(params.stolenBaseAttempt){
						baseRunningResults.stealResults.push({
							runnerLastName: params.player.lastName,
							attemptedBase: params.attemptedBase.base,
							attemptMade: true,
							success: true 
						});
						gamePlayService.handleSteal(params.player, true);
					}

					updateBaseRunners({
						attemptedBase : params.attemptedBase.base, 
						action : appConstants.ADVANCE, 
						doublePlay : params.doublePlay, 
						batter : batter
					});
				}
				else{
					if(params.attempt === 1) baseRunningResults.firstAttemptRunnerSafe = false;
					else baseRunningResults.secondAttemptRunnerSafe = false;

					if(params.updateOutsOnly) clearBases = gamePlayService.handleOuts();
					else clearBases = gamePlayService.updateCount({plateAppearanceEnded : appConstants.FIELDED_OUT});

					if(params.stolenBaseAttempt){
						baseRunningResults.stealResults.push({
							runnerLastName: params.player.lastName,
							attemptedBase: params.attemptedBase.base,
							attemptMade: true
						});
						gamePlayService.handleSteal(params.player, false);
					}
					
					updateBaseRunners({
						attemptedBase : params.attemptedBase.base, 
						action : appConstants.REMOVE, 
						thirdOutRecorded: clearBases, 
						runnersPosition : params.attemptedBase.runnersPosition,
						doublePlay : params.doublePlay,
						forceOut : params.forceOut
					});
				}

			}

			//walk/HBP
			//or no plays to be made, defense just getting ball in
			else if(!params.hitBallCaught){
				if(params.hitByPitchOrWalk){
					updateBaseRunners({action : appConstants.ADVANCE_BATTER_ONLY});
				}
				else{
					if(!params.updateOutsOnly) gamePlayService.updateCount({plateAppearanceEnded : true});
					updateBaseRunners({action : appConstants.ADVANCE});
				}
			}
			//batter's hit ball caught for out
			else{
				clearBases = gamePlayService.updateCount({plateAppearanceEnded : appConstants.FIELDED_OUT});

				updateBaseRunners({
					attemptedBase : 0,
					action : appConstants.REMOVE, 
					fieldingResult : params.fieldingResult, 
					runnersPosition : params.runnersPosition
				});
			}

			if(clearBases) baseRunningResults.clearBases = true;

			return clearBases;
		}

		function getBaseRunners(){
			return baseRunners;
		}

		//TO DO: ACCOUNT FOR WHERE BALL IS HIT
		//WON'T ALWAYS BE SPRINTING TO NEXT BASE/BACK TO BASE
		function handleRunnerOnAirbornBall(baseRunner, fieldingResult, outsBeforePlay){
			var avgChancePerc = (fieldingResult.chance * fieldingConstants.AIRBORN_BALL_MULTIPLIER);
			var finalChancePerc = (fieldingResult.finalChanceOfFielding * fieldingConstants.AIRBORN_BALL_MULTIPLIER);
			var delta = 0;

			if(baseRunner.currentBase == 0){
				baseRunner.batterOnAirBornBall = true;

				return;
			}

			//runner goes from leadoff distance already set, at time of hit
			if(fieldingResult.chance === 0){
				baseRunner.startRunningTime = 0;
				baseRunner.runningToNextBase = true;
			}
			else{
				if(outsBeforePlay < 2){
					var prelimMoveBackTowardBase = (__.getRandomDecimalInclusive(0, 100, 1) <= fieldingResult.chance) || (fieldingResult.chance === 100);
					var multiplier = (prelimMoveBackTowardBase ? avgChancePerc : (1.0 - avgChancePerc));
					var distanceTowardBase = (prelimMoveBackTowardBase ? baseRunner.leadOffDistance : ((90 - baseRunner.leadOffDistance) * multiplier));
					var rateMovedToThatDistance = (baseRunner.actualRunningRate * multiplier);
					var timeTakenToGetToDistance = (distanceTowardBase / rateMovedToThatDistance);
					var runToNextBase = (__.getRandomDecimalInclusive(0, 100, 1) > fieldingResult.finalChanceOfFielding) || (fieldingResult.chance < 100);
					var startRunningTime = (fieldingResult.timeToEvent * finalChancePerc);

					//if started running to wherever runner is running before got to prelim distance, set distance to wherever runner is at that time
					//else, set distance to that prelim distance (i.e. gets to that distance then starts running at whatever the start running time is)
					delta = (startRunningTime < timeTakenToGetToDistance) ? (rateMovedToThatDistance * startRunningTime) : distanceTowardBase;
					delta *= prelimMoveBackTowardBase ? -1 : 1;
					delta = (baseRunner.leadOffDistance + delta);

					baseRunner.timeWouldTakeToTagUpFromPrelimDistance = (delta / baseRunner.actualRunningRate);
					baseRunner.currentDistance = (appConstants.GAME_PLAY.BASES[baseRunner.currentBase].distance + delta);
					baseRunner.distanceFromNextBase = (appConstants.GAME_PLAY.BASES[baseRunner.nextBase].distance - baseRunner.currentDistance);
					baseRunner.distanceFromBaseAfterNext = (baseRunner.baseAfterNext ? (appConstants.GAME_PLAY.BASES[baseRunner.baseAfterNext].distance - baseRunner.currentDistance) : 0);
					baseRunner.distanceFromBaseThreeBasesAhead = (baseRunner.threeBasesAhead ? (appConstants.GAME_PLAY.BASES[baseRunner.threeBasesAhead].distance - baseRunner.currentDistance) : 0);
					baseRunner.startRunningTime = startRunningTime;
					baseRunner.runningToNextBase = runToNextBase;
				}
				//everyone goes (initially) with 2 outs
				else{
					baseRunner.startRunningTime = 0;

					//default to existing current distance; only add delta if going back to base
					//if they keep going, BAU (start time 0, started running from existing current distance)
					var directionDecisionTime = (fieldingResult.timeToEvent * finalChancePerc);

					//no use in tagging with 2 outs if think it will be caught anyway...
					var runToNextBase = true;

					var timeBeforeCatch = (fieldingResult.timeToEvent - directionDecisionTime);
					var distanceCoveredBeforeCatch = (timeBeforeCatch * baseRunner.actualRunningRate);
					var delta = (baseRunner.leadOffDistance + (directionDecisionTime * baseRunner.actualRunningRate));

					//runner going back to base
					if(!runToNextBase){
						if(distanceCoveredBeforeCatch >= delta){
							//console.log("able to reach base before catch; setting distance from current base");
							baseRunner.currentDistance = appConstants.GAME_PLAY.BASES[baseRunner.currentBase].distance;
						}
						else{
							//console.log("not able to reach base before catch; setting distance from current base plus how far away from base before catch");
							baseRunner.currentDistance = (appConstants.GAME_PLAY.BASES[baseRunner.currentBase].distance + (delta - distanceCoveredBeforeCatch));
						}
					}
					//keeps going to next base
					else{
						baseRunner.currentDistance = (appConstants.GAME_PLAY.BASES[baseRunner.currentBase].distance + delta + distanceCoveredBeforeCatch);
					}

					baseRunner.runningToNextBase = runToNextBase;
					baseRunner.distanceFromNextBase = (appConstants.GAME_PLAY.BASES[baseRunner.nextBase].distance - baseRunner.currentDistance);
					baseRunner.distanceFromBaseAfterNext = (baseRunner.baseAfterNext ? (appConstants.GAME_PLAY.BASES[baseRunner.baseAfterNext].distance - baseRunner.currentDistance) : 0);
					baseRunner.distanceFromBaseThreeBasesAhead = (baseRunner.threeBasesAhead ? (appConstants.GAME_PLAY.BASES[baseRunner.threeBasesAhead].distance - baseRunner.currentDistance) : 0);
				}
			}
		}

		//TO DO: ACCOUNT FOR WHERE BALL IS HIT
		//E.G. ONLY RUNNER ON 2ND, GB HIT TO 2B; CURRENT LOGIC MAY HAVE HIM STAYING AT 2B IF
		//DOESN'T THINK HE WILL MAKE IT TO 3RD IN TIME, BUT IN REALITY HE WOULD LIKELY GO SINCE 
		//HIT WAS TO OPPO SIDE OF WHERE RUNNING
		function getBaseRunnerIsAdvancingTo(baseRunner, timeToBaseInfo, params){
			var baseAdvancingTo = baseRunner.nextBase;
			var timeToTagUpBase = timeToBaseInfo[0].timeToBase;

			var timeToNextBase = timeToBaseInfo[1].timeToBase;
			var timeFromFielderToNextBase = timeToBaseInfo[1].timeFromFielderToBase;
			var timeToBaseAfterNext = (baseRunner.baseAfterNext ? timeToBaseInfo[2].timeToBase : 0);
			var timeFromFielderToBaseAfterNext = (baseRunner.baseAfterNext ? timeToBaseInfo[2].timeFromFielderToBase : 0);
			var timeToBaseThreeBasesAhead = (baseRunner.threeBasesAhead ? timeToBaseInfo[3].timeToBase : 0);
			var timeFromFielderToBaseThreeBasesAhead = (baseRunner.threeBasesAhead ? timeToBaseInfo[3].timeFromFielderToBase : 0);

			var timeToBase = timeToNextBase;
			var dividend = 0;
			var projectedReachTimeThrowTimeDiff = 0;
			var willTagUpInTime = true;

			if(params.airbornBall && !baseRunner.batterOnAirBornBall){
				if(params.ballCaught){
					var distanceToTagUp = (90 - baseRunner.distanceFromNextBase);
					var timeToTagUp = timeToTagUpBase;

					//timeToFielder: if ball was caught, time to base was timed from 0, so have to add back in the time to fielder before subtracting start running time

					var projectedTimeToReachTagUpBase = (distanceToTagUp / baseRunner.actualRunningRate);
					projectedReachTimeThrowTimeDiff = (projectedTimeToReachTagUpBase - timeToTagUp);

					//on any caught ball, set runner to go back to current base
					//evaluation of whether or not they try to advance happens later
					baseAdvancingTo = baseRunner.currentBase;

					//looks like runner won't be able to tag up in time
					if(projectedReachTimeThrowTimeDiff > fieldingConstants.TIME_DIFF_FOR_PROJECTED_BASE_REACH){
						willTagUpInTime = false;
						timeToBase = timeToTagUpBase;
					}
					//will make it in time; set times to next base/base after next
					else{
						//runner tagged up, so times to bases are clocked from 0 along with the throw

						timeToNextBase = timeFromFielderToNextBase;
						timeToBaseAfterNext = (baseRunner.baseAfterNext ? timeFromFielderToBaseAfterNext : 0);
						timeToBaseThreeBasesAhead = (baseRunner.threeBasesAhead ? timeFromFielderToBaseThreeBasesAhead : 0);

						//reset distances on tag up
						baseRunner.currentDistance = appConstants.GAME_PLAY.BASES[baseRunner.currentBase].distance;
						baseRunner.distanceFromNextBase = (appConstants.GAME_PLAY.BASES[baseRunner.nextBase].distance - baseRunner.currentDistance);
						baseRunner.distanceFromBaseAfterNext = (baseRunner.baseAfterNext ? (appConstants.GAME_PLAY.BASES[baseRunner.baseAfterNext].distance - baseRunner.currentDistance) : 0);
						baseRunner.distanceFromBaseThreeBasesAhead = (baseRunner.threeBasesAhead ? (appConstants.GAME_PLAY.BASES[baseRunner.threeBasesAhead].distance - baseRunner.currentDistance) : 0);
					}
					
				}
				//MISSED BALL
				else{
					//if running back to base, runner only has from when fielder caught it to get to next base/base after next from where they are
					//start running to next base at moment of catch
					//e.g. 6 secs total to get ball to base, but fielder to base in 1.5 secs -> runner has this time from prelim distance to reach base before ball
					if(!baseRunner.runningToNextBase){
						timeToNextBase = timeFromFielderToNextBase;
						timeToBaseAfterNext = (baseRunner.baseAfterNext ? timeFromFielderToBaseAfterNext : 0);
						timeToBaseThreeBasesAhead = (baseRunner.threeBasesAhead ? timeFromFielderToBaseThreeBasesAhead : 0);
					}
					//ELSE already running to next base, account for runner not having been running the whole play by subtracting the time runner started running
					//e.g. 6 secs total to get ball to base, started running at 3.5 secs; have 2.5 secs from prelim distance to reach base before ball
					else{
						timeToNextBase = (timeToNextBase - baseRunner.startRunningTime);
						timeToBaseAfterNext = (baseRunner.baseAfterNext ? (timeToBaseAfterNext - baseRunner.startRunningTime) : 0);
						timeToBaseThreeBasesAhead = (baseRunner.threeBasesAhead ? (timeToBaseThreeBasesAhead - baseRunner.startRunningTime) : 0);
					}
				}
			}

			if(willTagUpInTime){
				var currentBases = getBaseRunnersStatus();
				//batter's starting point different from already-on-base runners
				var isBatter = (baseRunner.currentBase === 0);

				dividend = (isBatter? appConstants.GAME_PLAY.BASES[baseRunner.nextBase].distance : baseRunner.distanceFromNextBase);

				var projectedTimeToReachNextBase = (dividend / baseRunner.actualRunningRate);
				projectedReachTimeThrowTimeDiff = projectedTimeToReachNextBase - timeToNextBase;

				//if there is a potential to reach next bases in time, advance
				//at most runner is projected to reach bases TIME_DIFF_FOR_PROJECTED_BASE_REACH sec after throw reaches
				if(projectedReachTimeThrowTimeDiff <= fieldingConstants.TIME_DIFF_FOR_PROJECTED_BASE_REACH){
					baseAdvancingTo = baseRunner.nextBase;

					if(baseRunner.baseAfterNext){
						dividend = (isBatter ? appConstants.GAME_PLAY.BASES[baseRunner.baseAfterNext].distance : baseRunner.distanceFromBaseAfterNext);
						var projectedTimeToReachBaseAfterNext = (dividend / baseRunner.actualRunningRate);
						projectedReachTimeThrowTimeDiff = (projectedTimeToReachBaseAfterNext - timeToBaseAfterNext);

						//advance to base after next
						if(projectedReachTimeThrowTimeDiff <= fieldingConstants.TIME_DIFF_FOR_PROJECTED_BASE_REACH){
							baseAdvancingTo = baseRunner.baseAfterNext;
							timeToBase = timeToBaseAfterNext;

							//check for advancing 3 bases
							if(baseRunner.threeBasesAhead){
								dividend = (isBatter ? appConstants.GAME_PLAY.BASES[baseRunner.threeBasesAhead].distance : baseRunner.distanceFromBaseThreeBasesAhead);
								var projectedTimeToReachBaseThreeBasesAhead = (dividend / baseRunner.actualRunningRate);
								projectedReachTimeThrowTimeDiff = projectedTimeToReachBaseThreeBasesAhead - timeToBaseThreeBasesAhead;
								
								if(projectedReachTimeThrowTimeDiff <= fieldingConstants.TIME_DIFF_FOR_PROJECTED_BASE_REACH){
									baseAdvancingTo = baseRunner.threeBasesAhead;
									timeToBase = timeToBaseThreeBasesAhead;
								}
							}

						}
					}

				}
				//if runner taking extra base(s), just stop at base already passed if won't make it to next base in time
				else if((baseRunner.nextBase - baseRunner.currentBase) > 1){
					baseRunner.nextBase -= 1;
					baseRunner.currentBase = baseRunner.nextBase;
					baseAdvancingTo = appConstants.NO_PLAY;
				}
				//runner's choice
				//IF (1) DON'T THINK WILL MAKE IT TO NEXT BASE AND (2) DON'T HAVE TO ADVANCE AND 
				//(3) GIVEN THE SITU, DEFENSE IS NOT NECESSARILY GOING FOR FORCEOUTS AT 1ST OR 2ND
				//(LIKE THEY WOULD BE ON GROUND BALL)-->DON'T ADVANCE
				else if(advancingIsOptional(baseRunner.currentBase, currentBases)){
					//only men on 2nd/3rd have choice to stay;
					//base runners are evaluated from furthest on base to batter, so runner whose next base is
					//4 has the choice to stay on 3rd, then any runner on 2nd behind them would see that the 
					//former stayed and be set decision accordingly
					if(params.airbornBall && ((baseRunner.nextBase == 4) || (baseRunner.nextBase == 3) && !currentBases.runnerOn3rd)){
						baseAdvancingTo = appConstants.NO_PLAY;
					}
				}

			}

			//update runner's base; if they get thrown out, they will be erased from baseRunners anyway
			if(baseAdvancingTo !== appConstants.NO_PLAY) baseRunner.currentBase = baseAdvancingTo;

			return {
				baseRunnerIsAdvancingTo : baseAdvancingTo, 
				timeToBase : timeToBase, 
				runnerGoingBackToBase : !willTagUpInTime
			};
		}

		function stealingBase(currentBases, runner, playHandedness){
			var maxDelta = (baseRunningConstants.BASE_STEALING.PITCHER_CATCHER.weight.max + baseRunningConstants.BASE_STEALING.INNING.weight.max + baseRunningConstants.BASE_STEALING.SCORE.weight.max);
			var pitcher = gamePlayService.getPitcher();
			var catcher = gamePlayService.getCatcher();
			var pitcherHandedness = pitcher.handedness;
			var stealingBase = false;

			var finalDelta = 0;
			var pitcherCatcherDelta = 0;
			var breakEvenDelta = 0;
			var inningDelta = 0;
			var scoreDelta = 0;

			var inningRange = ((currentInning < 4) ? 1 : ((currentInning < 7) ? 2 : 3));
			var handednessChances = baseRunningConstants.BASE_STEALING[playHandedness];
			var chanceOfStealing = handednessChances[runner.nextBase];
			

			//*****************FACTORS*****************


			//***P/C ATTRIBUTES***

			//TO DO: PROJECT PITCH OTHER THAN FB
			var delta = __.getRandomDecimalInclusive(0, (pitcher.throwPower * baseRunningConstants.BASE_STEALING.THROW_MULTIPLIER), 2);
			var baseThrowVelocity = __.mphToFps(__.determineBaseThrowVelocity(pitcher));
			var throwVelocity = (baseThrowVelocity + ((__.getRandomIntInclusive(0, 100) <= pitcher.throwPower) ? delta : (delta * -1)));
			var projectedPitchTimeToPlate = (pitcher.y / throwVelocity);
			var projectedTotalTimeToPlate = (pitcher.windupTime + projectedPitchTimeToPlate);

			//catcher throw to 2nd or 3rd
			var distanceToStealBase = ((runner.nextBase == 2) ? appConstants.GAME_PLAY.BASES[2].y : 90);
			delta = __.getRandomDecimalInclusive(0, (catcher.throwPower * baseRunningConstants.BASE_STEALING.THROW_MULTIPLIER), 2);
			baseThrowVelocity = __.mphToFps(__.determineBaseThrowVelocity(catcher, true));
			throwVelocity = (baseThrowVelocity + ((__.getRandomIntInclusive(0, 100) <= catcher.throwPower) ? delta : (delta * -1)));

			//TODO: no catcher time for steal of home; also, P can attempt to throw steal out directly
			var projectedThrowTimeToBase = (distanceToStealBase / throwVelocity);
			var projectedTotalTimeToBase = (catcher.windupTime + projectedThrowTimeToBase);

			var projectedTimePitcherToStealBase = (projectedTotalTimeToPlate + projectedTotalTimeToBase);
			var runnerTimeToReachStealBase =  (runner.distanceFromNextBase / runner.actualRunningRate);
			var projectedReachTimeThrowTimeDiff = (projectedTimePitcherToStealBase - runnerTimeToReachStealBase);
			pitcherCatcherDelta = __.getRandomDecimalInclusive(baseRunningConstants.BASE_STEALING.PITCHER_CATCHER.weight.min, baseRunningConstants.BASE_STEALING.PITCHER_CATCHER.weight.max, 2);

			if(projectedReachTimeThrowTimeDiff > baseRunningConstants.BASE_STEALING.MIN_REACH_TIME_DIFF) pitcherCatcherDelta *= -1;

			finalDelta += pitcherCatcherDelta;

			//set distance as where runner is when ball reaches plate
			//this is so that if it is hit, runner is timed from that moment, BAU
			//and if caught, runner is timed from when catcher catches it and can get it to base
			runner.distanceIfNoSteal = runner.currentDistance;
			runner.currentDistance += (projectedTotalTimeToPlate * runner.actualRunningRate);
			
			//has from time it takes for catcher throw to base
			runner.totalTimeToReachBase = (projectedTotalTimeToBase + __.getRandomDecimalInclusive(baseRunningConstants.BASE_STEALING.FIELDER_CATCH_TAG_TIME.min, baseRunningConstants.BASE_STEALING.FIELDER_CATCH_TAG_TIME.max, 2));


			//***INNING***

			//only care about stealing 2nd; for others, inning is a non-factor
			if(runner.nextBase === 2){
				var currentInning = gamePlayService.inning();
				var inningFactorObj = baseRunningConstants.BASE_STEALING.INNING[inningRange];
				var inningChance = inningFactorObj[playHandedness];
				inningDelta = __.getRandomDecimalInclusive(baseRunningConstants.BASE_STEALING.INNING.weight.min, baseRunningConstants.BASE_STEALING.INNING.weight.max, 2);

				if(inningChance < __.getRandomDecimalInclusive(0, 100, 1)) inningDelta *= -1;	
			}

			finalDelta += inningDelta;


			//***SCORE***

			//less likely to steal if ahead early in game, more likely if later in game
			//vice versa if behind
			//for inning range 2, toss up

			var offense = gamePlayService.getOffense();
			var defense = gamePlayService.getDefense();
			var offenseScore = offense.battingTotals.totalRuns;
			var defenseScore = defense.battingTotals.totalRuns;
			var scoreDiff = ((inningRange == 1) ? (defenseScore - offenseScore) : (offenseScore - defenseScore));
			var multiplier = __.getRandomDecimalInclusive(baseRunningConstants.BASE_STEALING.SCORE.weight.min, baseRunningConstants.BASE_STEALING.SCORE.weight.max, 2);

			//if tied, use predefined multiplier based on inning range
			scoreDelta = (scoreDiff ? (scoreDiff * multiplier) : (multiplier * baseRunningConstants.BASE_STEALING.SCORE[inningRange]));

			if(inningRange === 2) scoreDelta = (chance.bool() ? scoreDelta : scoreDelta * -1);

			finalDelta += scoreDelta;


			//***BREAK EVEN RATE***

			var breakEvenFactorObj = baseRunningConstants.BASE_STEALING.BREAK_EVEN_RATES[runner.nextBase];
			var breakEvenRate = breakEvenFactorObj[gamePlayService.outs()];
			breakEvenDelta = __.getRandomDecimalInclusive(baseRunningConstants.BASE_STEALING.BREAK_EVEN_RATES.weight.min, baseRunningConstants.BASE_STEALING.BREAK_EVEN_RATES.weight.max, 2);

			//compare delta to max delta possible, and compare that to the break even rate
			var percOfMaxDeltaPossible = (finalDelta / maxDelta);

			if(percOfMaxDeltaPossible < breakEvenRate) breakEvenDelta *= -1;

			finalDelta += breakEvenDelta;
			stealingBase = (__.getRandomDecimalInclusive(0, 100, 2) <= (chanceOfStealing + finalDelta));

			//check if runner was signalled to go for a multi steal
			if(runner.signalledToSteal){
				stealingBase = true;
			}

			if(runner.nextBase === 4 && stealingBase){
				//check for double steal with runner on 1st
				if(currentBases.runnerOn1st && !currentBases.runnerOn2nd){
					var doubleSteal = (__.getRandomDecimalInclusive(0, 100, 2) <= baseRunningConstants.BASE_STEALING.DOUBLE_2ND_HOME);

					if(doubleSteal){
						currentBases.runnerOn1st.signalledToSteal = true;
						runner.delayedSteal = true;
					}
				}
			}

			return stealingBase;
		}

		function checkForBaseStealing(playHandedness){
			var currentBases = getBaseRunnersStatus();
			var stealAttempt = false;
			var basesBeingAttempted = [];

			_.each(baseRunners, function(runner){
				if((runner.nextBase < 4) && (runner.runSpeed >= baseRunningConstants.BASE_STEALING.MIN_STEAL_SPD || runner.signalledToSteal) && stealingBase(currentBases, runner, playHandedness)){
					runner.stealingBase = true;
					stealAttempt = true;
					basesBeingAttempted.push(runner.nextBase);
				}
				else{
					runner.currentDistance = (runner.distanceIfNoSteal ? runner.distanceIfNoSteal : runner.currentDistance);
				}

			});

			//make sure no runner is stealing to an occupied base
			_.each(basesBeingAttempted, function(base){
				if((base === 2) && currentBases.runnerOn2nd && !currentBases.runnerOn2nd.stealingBase){
					currentBases.runnerOn1st.stealingBase = false;
					stealAttempt = false;
				}

				if((base === 3) && currentBases.runnerOn3rd && !currentBases.runnerOn3rd.stealingBase){
					currentBases.runnerOn2nd.stealingBase = false;
					stealAttempt = false;
				}
			});

			if(basesBeingAttempted.length > 1) handleMultiSteal(currentBases, basesBeingAttempted);

			return stealAttempt;
		}

		function handleStealAttempt(pitcherHandedness){
			var thirdOutRecorded = false;
			var offense = gamePlayService.getOffense();

			_.each(baseRunners, function(runner){
				if(runner && !thirdOutRecorded){
					if(runner.stealingBase && !runner.noPlayOnSteal){
						//BRING IN AWR HERE FOR WHEN HE STARTS RUNNING?
						//TODO: NOT ALWAYS THROW ON STEAL
						//ALSO CAN BE DIRECTLY FROM PITCHER

						runner.currentBase = runner.nextBase;

						var stealBase = {
							base : runner.nextBase,
							timeToBase : runner.totalTimeToReachBase,
							runnersActualRunningRate : runner.actualRunningRate,
							runnersCurrentDistance : runner.currentDistance,
							pitcherHandedness : pitcherHandedness,
							noPlayOnSteal : false,
							runnersPosition : runner.position
						};

						var player = _.find(offense.players, function(player){
							return (player.position === runner.position && !player.inactive);
						});

						thirdOutRecorded = handlePlayAction({
							attemptedBase : stealBase, 
							stolenBaseAttempt : true, 
							player : player,
							attempt : 1,
							updateOutsOnly : true
						});
					}
					else if(runner.noPlayOnSteal){
						thirdOutRecorded = handlePlayAction({updateOutsOnly : true});
					}
				}
			});
		}

		//ONLY STEAL OF HOME AND 2ND SUPPORTED AS OF NOW (ONLY THAT ONE IS CODED TO SIGNAL THE OTHER RUNNER)
		function handleMultiSteal(currentBases, basesBeingAttempted){
			//Scorekeeping note: it is only a double steal if both runners are successful; if one of the runners is caught stealing, the other runner should not be credited with a stolen base.

			var defense = gamePlayService.getDefense();
			var runnerOn1st = currentBases.runnerOn1st;
			var runnerOn2nd = currentBases.runnerOn2nd;
			var runnerOn3rd = currentBases.runnerOn3rd;
			var catcher = gamePlayService.getCatcher();
			var secondBaseman = _.find(defense.players, {position: appConstants.GAME_PLAY.POSITIONS.SECOND_BASEMAN});
			var thirdBaseman = _.find(defense.players, {position: appConstants.GAME_PLAY.POSITIONS.THIRD_BASEMAN});
			var infielderBaseThrowVelocity = __.mphToFps(__.determineBaseThrowVelocity(null, true));
			var throwVelocity = 0;
			var startRunningDelay = 0;
			var delta = 0;

			//TO DO: ADD TIME FOR WINDUPS/TAG ATTEMPTS

			//FOR NOW JUST HAVE THE NON-LEAD RUNNERS ADVANCE TO NEXT BASE SAFELY

			if(_.includes(basesBeingAttempted, 2)){

				//double steal of 2nd and 3rd
				if(_.includes(basesBeingAttempted, 3) && !_.includes(basesBeingAttempted, 4)){
					runnerOn1st.noPlayOnSteal = true;
					runnerOn1st.currentBase = 2;
				}

				//double steal of 2nd and home
				else if(_.includes(basesBeingAttempted, 4) && !_.includes(basesBeingAttempted, 3)){
					//runner on 1st going BAU
					//set up runner on 3rd for delayed steal

					delta = __.getRandomDecimalInclusive(0, (catcher.throwPower * baseRunningConstants.BASE_STEALING.THROW_MULTIPLIER), 2);
					throwVelocity = (infielderBaseThrowVelocity + ((__.getRandomIntInclusive(0, 100) <= catcher.throwPower) ? delta : (delta * -1)));
					var catcherProjectedThrowTimeToBase = (appConstants.GAME_PLAY.BASES[2].y / __.mphToFps(__.determineBaseThrowVelocity(catcher, true)));
					
					//TO DO: SPOT WHERE 2B OR SS CATCHES THE THROW WILL BE A LITTLE CLOSER IF THEY DON'T GO FOR TAG AT 2ND
					//TO DO: COULD BE SS WHO GETS/CUTS OFF THE THROW, OR EVEN PITCHER

					delta = __.getRandomDecimalInclusive(0, (secondBaseman.throwPower * baseRunningConstants.BASE_STEALING.THROW_MULTIPLIER), 2);
					throwVelocity = (infielderBaseThrowVelocity + ((__.getRandomIntInclusive(0, 100) <= secondBaseman.throwPower ? delta : (delta * -1))));
					var projected2BThrowTimeToBase = (secondBaseman.windupTime + (appConstants.GAME_PLAY.BASES[2].y / __.mphToFps(_.determineBaseThrowVelocity(secondBaseman, true))));

					//starts running a little after catcher throw to 2B
					startRunningDelay = __.getRandomDecimalInclusive(baseRunningConstants.RUNNER_DELAY_STEAL.min, baseRunningConstants.RUNNER_DELAY_STEAL.max, 2);

					runnerOn3rd.distanceIfNoSteal = runnerOn3rd.currentDistance;
					runnerOn3rd.currentDistance = (runnerOn3rd.currentDistance + ((catcherProjectedThrowTimeToBase - startRunningDelay) * runnerOn3rd.actualRunningRate));
					runnerOn3rd.totalTimeToReachBase = projected2BThrowTimeToBase;
				}
			
			}
			
			//double steal of 3rd and home
			else if(_.includes(basesBeingAttempted, 3) && _.includes(basesBeingAttempted, 4) && !_.includes(basesBeingAttempted, 2)){
				runnerOn2nd.noPlayOnSteal = true;
				runnerOn2nd.currentBase = 3;
			}

		}

		function getResults(){
			return baseRunningResults;
		}

		function resetResults(){
			baseRunningResults = {};

			_.each(baseRunners, function(runner){
				runner.batterOnAirBornBall = false;
				runner.stealingBase = false;
				runner.delayedSteal = false;
				runner.noPlayOnSteal = false;
				runner.signalledToSteal = false;
			});
		}

		function clearBases(){
			baseRunners = [];
		}

	}
}
