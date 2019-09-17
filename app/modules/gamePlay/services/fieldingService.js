/**
 * Generates all of the properties of the fielding result of a ball put into play.
 */
module.exports = function(module){
	module.service('fieldingService', ['gamePlayService', 'appUtility', 'appConstants', 'fieldingConstants', 'battingConstants', 'baseRunningService', function fieldingService(gamePlayService, appUtility, appConstants, fieldingConstants, battingConstants, baseRunningService){
		var __ = appUtility;
		var battingResults = {};
		var fieldingResults = {};
		var defenders = {};
		var pitcher;
		var batter;
		var playersFieldingBall;

		var api = {
			fieldBall: fieldBall
		};

		return api;

		/**
		 * Returns all of the fielders who are in position to make a play on the ball.
		 */		
		function determinePlayersFieldingBall(fieldSideToExclude){
			var fielders = [];

			_.each(defenders, function(defender){
				if((defender.fieldSide !== fieldSideToExclude) && !defender.inactive){
					//exclude C from all
					//also 1B and 3B from CENTER hits
					if((defender.position === appConstants.GAME_PLAY.POSITIONS.CATCHER)
						|| ((fieldSideToExclude === battingConstants.FIELD_SECTIONS.CENTER) 
						&& ((defender.position === appConstants.GAME_PLAY.POSITIONS.FIRST_BASEMAN) || (defender.position === appConstants.GAME_PLAY.POSITIONS.THIRD_BASEMAN)))){
						return;
					}

					fielders.push(defender);
				}
			});

			return fielders;
		}

		/**
		 * Returns the defender at the given position.
		 */		
		function getDefender(_position){
			return _.find(defenders, function(player){
				return ((player.position === _position) && !player.inactive);
			});
		}

		/**
		 * Sorts defenders by who is closest to where the ball put into play will end up.
		 */		
		function sortByDistToFinal(a, b){
			return (a.distanceToFinalBallDist - b.distanceToFinalBallDist);
		}

		/**
		 * Sorts defenders by who will be closest to the ball when it passes their (x,y) position.
		 */
		function sortByDistToPassingPoint(a, b){
			return (a.playerDistToBallPassingPoint - b.playerDistToBallPassingPoint);
		}

		/**
		 * Annotates each potential throw to a base for an out attempt by whether or not it would be a force out.
		 */
		function markForceOuts(potentialPlaysToBeMade, basesBeingAdvancedTo){
			_.each(potentialPlaysToBeMade, function(play){
				//set to negative since _.sortBy is an ascending sort
				play.forceOut = ((_.includes(basesBeingAdvancedTo, (play.base - 1))) || (play.base == 1) ? -1 : 0);
			});
		}

		/**
		 * Determines the distance from home plate to the outfield wall based on the hit direction.
		 */
		function determineWallDistance(hitAngle, angles){
			var hitSection = fieldingResults.hitSection;
			var baseDistance;
			var baseAngle;
			var baseAngleDistDelta;
			var wallDistance;
			var foulPlayable = battingResults.fouledBallPlayable;
			//see excel sheet; the distances go up or down at the angle depending on which side of field
			var addToBaseDist = false;

			if((hitSection === appConstants.LEFT) || (hitSection === appConstants.RIGHT)){
				baseAngleDistDelta = angles.LF_RF_BASE_ANGLE_DIST_DELTA;

				if(hitSection === appConstants.LEFT){
					baseDistance = angles.LEFT_BASE_DIST;
					baseAngle = angles.LEFT_BASE_ANGLE;
				}
				else{
					baseDistance = angles.RIGHT_BASE_DIST;
					baseAngle = angles.RIGHT_BASE_ANGLE;
					addToBaseDist = true;
				}

			}
			else{
				baseAngleDistDelta = angles.MID_BASE_ANGLE_DIST_DELTA;

				//RIGHT CENTER FIELD/BEHIND HOME PLATE RIGHT
				if((!foulPlayable && (hitAngle <= angles.CENTER_BASE_ANGLE)) || (foulPlayable && (hitAngle > angles.CENTER_BASE_ANGLE))){
					baseDistance = angles.CENTER_ADD_TO_BASE_DIST;
					baseAngle = angles.CENTER_ADD_TO_BASE_ANGLE;
					addToBaseDist = true;
					
				}
				//LEFT CENTER FIELD/BEHIND HOME PLATE LEFT
				else{
					baseDistance = angles.CENTER_SUBTRACT_FROM_BASE_DIST;
					baseAngle = angles.CENTER_SUBTRACT_FROM_BASE_ANGLE;
				}
		
			}

			if(addToBaseDist) wallDistance = (Math.floor((hitAngle - baseAngle) / baseAngleDistDelta) + baseDistance);
			else wallDistance = (baseDistance - Math.floor((hitAngle - baseAngle) / baseAngleDistDelta));
			
			return wallDistance;
		}

		/**
		 * Sets the distance and angle of the foul wall that the ball put into play is bound by based on the hit angle.
		 */
		function determineLRFoulWallSectionHitTo(hitAngle, angles){
			var ballHitToBottomSection = (hitAngle <= fieldingConstants.RIGHT_FOUL_TOP_SECTION_START_ANGLE) || (hitAngle > fieldingConstants.LEFT_FOUL_TOP_SECTION_START_ANGLE);
			angles.LF_RF_BASE_ANGLE_DIST_DELTA = ballHitToBottomSection ? fieldingConstants.FOUL_BOTTOM_SECTION_ANGLE_DELTA : fieldingConstants.FOUL_TOP_SECTION_ANGLE_DELTA;
			angles.LEFT_BASE_DIST = ballHitToBottomSection ? fieldingConstants.FOUL_BOTTOM_SECTION_MAX_DIST : fieldingConstants.LF_RF_FOUL_LINE_DIST;
			angles.LEFT_BASE_ANGLE = ballHitToBottomSection ? fieldingConstants.LEFT_FOUL_TOP_SECTION_START_ANGLE : angles.LEFT_MIN;
			angles.RIGHT_BASE_DIST = ballHitToBottomSection ? fieldingConstants.FOUL_ZERO_DEGREE_DIST : fieldingConstants.FOUL_BOTTOM_SECTION_MAX_DIST;
			angles.RIGHT_BASE_ANGLE = ballHitToBottomSection ? angles.RIGHT_MIN : fieldingConstants.RIGHT_FOUL_TOP_SECTION_START_ANGLE;
		}

		/**
		 * Determines the cut off man and man covering his base based on where the ball was hit.
		 */
		function getCutoffInfo(nextBase){
			var cutOffMan = '';
			var manCoveringCutoffsBase = '';

			//TODO: PITCHER COVERING HOME PLATE FOR C ON PLAYABLE FOUL? OR ANY OTHER BASES (1ST FOR 1B IF 1B FIELDS)?

			if((fieldingResults.hitSection).indexOf(appConstants.RIGHT) > -1){
				if(nextBase == 4){
					cutOffMan = appConstants.GAME_PLAY.POSITIONS.FIRST_BASEMAN;
					manCoveringCutoffsBase = appConstants.GAME_PLAY.POSITIONS.SECOND_BASEMAN;
				}
				else{
					cutOffMan = appConstants.GAME_PLAY.POSITIONS.SECOND_BASEMAN;
					manCoveringCutoffsBase = appConstants.GAME_PLAY.POSITIONS.SHORT_STOP;
				}
			}
			else{
				if(nextBase == 4){
					cutOffMan = appConstants.GAME_PLAY.POSITIONS.THIRD_BASEMAN;
					manCoveringCutoffsBase = appConstants.GAME_PLAY.POSITIONS.SHORT_STOP;
				}
				else{
					cutOffMan = appConstants.GAME_PLAY.POSITIONS.SHORT_STOP;
					manCoveringCutoffsBase = appConstants.GAME_PLAY.POSITIONS.SECOND_BASEMAN;
				}
			}

			return {
				defenderMakingThrow : getDefender(cutOffMan), 
				manCoveringCutoffsBase : manCoveringCutoffsBase
			};	
		}

		/**
		 * Returns the time it takes the fielded ball to reach the each potential destination base, as well as defender and distance information.
		 */
		function determineTimeToGetBallToBase(currentTime, defenderMakingThrow, throwFromXY, bases){
			var returnObj = [];

			//TO DO: SOMETIMES FIELDER GOES AND STEPS ON BASE HIMSELF

			var aidedByThrowPower = (__.getRandomIntInclusive(0, 100) <= defenderMakingThrow.throwPower);
			var multiplier = (aidedByThrowPower ? defenderMakingThrow.throwPower : __.get100minusAttribute(defenderMakingThrow.throwPower));
			var delta = __.getRandomDecimalInclusive(0, (multiplier * (fieldingConstants.FIELDER_THROW_MULTIPLIER)), 2);
			var baseThrowVelocity = __.determineBaseThrowVelocity(defenderMakingThrow, defenderMakingThrow.infield);
			delta *= (aidedByThrowPower ? 1 : -1);
			var throwVelocity = (baseThrowVelocity + delta);

			_.each(bases, function(base){
				if(base){
					var returnInfo = {};
					var timeAbleToGetBallToCutoff = 0;
					var cutoffWindupTime = 0;
					var fielderWindupTime = defenderMakingThrow.windupTime;
					var cutOffInfo = getCutoffInfo(base.baseNumber);
					var cutOffMan = cutOffInfo.defenderMakingThrow;
					var manCoveringCutoffsBase = cutOffInfo.manCoveringCutoffsBase;
					var baseXY = {
						x : base.x, 
						y : base.y
					};

					var distanceToBase = __.getDistance(throwFromXY, baseXY);

					//throw to cutoff man if outfielder too far away from base
					if(distanceToBase > (fieldingConstants.THROW_TO_CUTOFF_MIN - __.get100minusAttribute(defenderMakingThrow.throwPower))){
						returnInfo.throwToCutOffMan = true;
						defenderMakingThrow = cutOffMan;
						cutoffWindupTime = defenderMakingThrow.windupTime;

						var defenderMakingThrowXY = {
							x : defenderMakingThrow.xOnPlay, 
							y : defenderMakingThrow.yOnPlay
						};

						//set player's cutoff xy:
						//get angle between base being thrown to and throwFromXY;
						//get point on that line at CUTOFF_POINT_DISTANCE;
						//get angle between cutoff defender and that point;
						//move FINAL_DISTANCE_TOWARD_CUTOFF_POINT toward that point at that angle

						var angleBetweenThrowFromPointAndBase = __.getAngleBetweenTwoPoints(throwFromXY, baseXY);
						var cutoffPoint = __.getX2Y2(base.x, base.y, fieldingConstants.CUTOFF_POINT_DISTANCE, angleBetweenThrowFromPointAndBase);
						var angleBetweenDefenderAndCutoffPoint = __.getAngleBetweenTwoPoints(defenderMakingThrowXY, cutoffPoint);
						var distanceToMoveTowardCutoffPoint = ((base.baseNumber == 4) ? -fieldingConstants.FINAL_DISTANCE_TOWARD_CUTOFF_POINT : fieldingConstants.FINAL_DISTANCE_TOWARD_CUTOFF_POINT);
						var finalCutoffPoint = __.getX2Y2(defenderMakingThrow.x, defenderMakingThrow.y, distanceToMoveTowardCutoffPoint, angleBetweenDefenderAndCutoffPoint);

						defenderMakingThrowXY.x = finalCutoffPoint.x;
						defenderMakingThrowXY.y = finalCutoffPoint.y;

						aidedByThrowPower = (__.getRandomIntInclusive(0, 100) <= defenderMakingThrow.throwPower);
			 			multiplier = (aidedByThrowPower ? defenderMakingThrow.throwPower : __.get100minusAttribute(defenderMakingThrow.throwPower));
						delta = __.getRandomDecimalInclusive(0, (multiplier * fieldingConstants.FIELDER_THROW_MULTIPLIER), 2);
						baseThrowVelocity = __.determineBaseThrowVelocity(defenderMakingThrow, defenderMakingThrow.infield);
						delta *= (aidedByThrowPower ? 1 : -1);
						throwVelocity = (baseThrowVelocity + delta);
						timeAbleToGetBallToCutoff = (fielderWindupTime + __.getDistance(throwFromXY, defenderMakingThrowXY) / __.mphToFps(throwVelocity));
						distanceToBase = __.getDistance(defenderMakingThrowXY, baseXY);
					}

					var timeFromFielderToBase = (fielderWindupTime + timeAbleToGetBallToCutoff + cutoffWindupTime + (distanceToBase / __.mphToFps(throwVelocity)));
					var timeAbleToGetBallToDestination = (currentTime + timeFromFielderToBase);

					returnInfo.cutOffMan = cutOffMan;
					returnInfo.manCoveringCutoffsBase = manCoveringCutoffsBase;
					returnInfo.timeToBase = timeAbleToGetBallToDestination;
					returnInfo.timeFromFielderToBase = timeFromFielderToBase;
					returnInfo.fielderDistanceFromBase = distanceToBase;

					returnObj.push(returnInfo);
				}
			});

			return returnObj;
		}

		/**
		 * Evaluates where defense goes with the fielded ball (if at all) based on base runner action and timing.
		 */
		function throwBallIn(params){
			var currentTime = params.currentTime;
			var potentialPlaysToBeMade = [];
			var basesBeingAdvancedTo = [];
			var baseRunnerInFrontIsAdvTo = {};
			var airbornBall = false;
			var ballCaught = fieldingResults.playMadeOnHit;
			var offense = gamePlayService.getOffense();

			if(battingResults.battedBallType !== battingConstants.BATTED_BALL_TYPES.GROUND_BALL){
				airbornBall = true;
			}

			_.each(params.baseRunners, function(baseRunner){
				var batter = (baseRunner.currentBase == 0) ? _.find(offense.players, function(player){
						return ((player.position === baseRunner.position) && !player.inactive);
					}) : null;

				//if batter, evaluate home plate as current base just to have something in the array;
				//won't be used as currentBase is evaluated for runners who go back to tag up
				var currentBase = appConstants.GAME_PLAY.BASES[batter ? 4 : baseRunner.currentBase];

				var nextBase = appConstants.GAME_PLAY.BASES[baseRunner.nextBase];
				var baseAfterNext = appConstants.GAME_PLAY.BASES[baseRunner.baseAfterNext];
				var threeBasesAhead = appConstants.GAME_PLAY.BASES[baseRunner.threeBasesAhead];

				//e.g. if runner in front of current runner (batter) is going from 1st to 2nd, but batter would have tried to go to 2nd as well, make batter settle at 1st
				//(except if runner in front went home and trailing runner wants to go home too);
				//also settle if runner in front is staying/tagged up at his current base
				if(((baseRunnerInFrontIsAdvTo.base == baseRunner.nextBase) && (baseRunnerInFrontIsAdvTo.base < 4)) 
					|| ((baseRunnerInFrontIsAdvTo.base === appConstants.NO_PLAY) && (baseRunnerInFrontIsAdvTo.stayedAtBase == baseRunner.nextBase))){
					baseRunner.nextBase -= 1;

					//these are the runner in front's next base and base after next, so just take them out of the equation for the play
					baseRunner.baseAfterNext = 0;
					baseRunner.threeBasesAhead = 0;

					nextBase = appConstants.GAME_PLAY.BASES[baseRunner.nextBase];
				}

				//now check that runner does not try to go to a base that runner in front of him is going to (i.e. further than his next base)

				if((baseRunnerInFrontIsAdvTo.base < 4) && (baseRunnerInFrontIsAdvTo.base === baseRunner.baseAfterNext)){
					baseRunner.baseAfterNext -= 1;
					baseRunner.threeBasesAhead = 0;
				}

				if((baseRunnerInFrontIsAdvTo.base < 4) && (baseRunnerInFrontIsAdvTo.base === baseRunner.threeBasesAhead)){
					baseRunner.threeBasesAhead -= 1;
				}

				if(airbornBall) baseRunningService.handleRunnerOnAirbornBall(baseRunner, fieldingResults, params.outsBeforePlay);

				//determine time it would take to get the ball to each of the possible bases this runner may advance to
				var timeToBaseInfo = determineTimeToGetBallToBase(currentTime, params.fielder, params.throwFromXY,
										[currentBase, nextBase, (baseRunner.baseAfterNext ? baseAfterNext : null), (baseRunner.threeBasesAhead ? threeBasesAhead : null)]);

				var baseAdvancingToObj = baseRunningService.getBaseRunnerIsAdvancingTo(baseRunner, timeToBaseInfo, {airbornBall : airbornBall, ballCaught : ballCaught});
				var advancedToBase = baseAdvancingToObj.baseRunnerIsAdvancingTo;
				baseRunnerInFrontIsAdvTo.base = baseAdvancingToObj.baseRunnerIsAdvancingTo;

				if(baseRunnerInFrontIsAdvTo.base === appConstants.NO_PLAY){
					baseRunnerInFrontIsAdvTo.stayedAtBase = baseRunner.currentBase;
					basesBeingAdvancedTo.push(baseRunner.currentBase);
				}

				//potential for out at base this runner is advancing to
				if(advancedToBase !== appConstants.NO_PLAY){
					basesBeingAdvancedTo.push(baseAdvancingToObj.baseRunnerIsAdvancingTo);
					var runnerAdvancingToNextBase = (advancedToBase === baseRunner.nextBase);
					var timeToBaseObj = (baseAdvancingToObj.runnerGoingBackToBase ? timeToBaseInfo[0] : (runnerAdvancingToNextBase ? timeToBaseInfo[1] : timeToBaseInfo[2]));

					var delta = (baseRunner.projectedRunningRate * baseAdvancingToObj.timeToBase);					
					//account for potential double off (subtract from runner's distance instead of adding)
					delta *= (baseAdvancingToObj.runnerGoingBackToBase ? -1 : 1);

					var projectedDistanceAtTimeBallReachesBase = (baseRunner.currentDistance + delta);
					var runnerDistanceFromBase = (projectedDistanceAtTimeBallReachesBase - appConstants.GAME_PLAY.BASES[advancedToBase].distance);

					//runner projected to be close to/past next base
					//play may be made if runner is projected to be at most DIST_DIFF_FOR_PROJECTED_BASE_REACH feet past base by time ball gets there
					var playToBeMade = (baseAdvancingToObj.runnerGoingBackToBase ? 
						(runnerDistanceFromBase > fieldingConstants.DIST_DIFF_FOR_PROJECTED_BASE_REACH) : (runnerDistanceFromBase < fieldingConstants.DIST_DIFF_FOR_PROJECTED_BASE_REACH));

					if(batter) fieldingResults.baseBatterAdvancedTo = appConstants.GAME_PLAY.BASES[advancedToBase].baseId;
					
					if(playToBeMade){
						var outPriority = appConstants.GAME_PLAY.BASES[advancedToBase].outPriority;

						if(batter) fieldingResults.playToBeMadeOnBatter = true;

						potentialPlaysToBeMade.push({
							base : advancedToBase,
							timeToBase : baseAdvancingToObj.timeToBase,
							outGuarantee: (baseAdvancingToObj.timeToBase + timeToBaseObj.fielderDistanceFromBase + runnerDistanceFromBase),
							outPriority: (outPriority + runnerDistanceFromBase),
							fielderDistanceFromBase: timeToBaseObj.fielderDistanceFromBase,
							runnerGoingBackToBase : baseAdvancingToObj.runnerGoingBackToBase,
							runnersProjectedRunningRate : baseRunner.projectedRunningRate,
							runnersActualRunningRate : baseRunner.actualRunningRate,
							runnersCurrentDistance : baseRunner.currentDistance,
							runnerDistanceFromBaseAtTimeBallReaches : runnerDistanceFromBase,
							cutOffMan : timeToBaseObj.cutOffMan,
							throwToCutOffMan: timeToBaseObj.throwToCutOffMan,
							manCoveringCutoffsBase : timeToBaseObj.manCoveringCutoffsBase,
							runnersPosition : baseRunner.position,
							runnersFirstName: baseRunner.firstName,
							runnersLastName: baseRunner.lastName
						});
					}
				}
				//no play to be made at base batter is advancing to
				else if(batter){
					fieldingResults.baseBatterAdvancedTo = appConstants.GAME_PLAY.BASES[baseRunner.currentBase].baseId;
				}
			});

			if(potentialPlaysToBeMade.length){
				var lessThanTwoOuts = (gamePlayService.outs() < 2);
				var throwToBase;
				var finalThrowToBase;
				var doublePlayBase;
				var firstPlayOption;
				var doublePlayPossible = false;
				fieldingResults.playToBeMadeOnRunner = true;

				//favor bases to defense's left if infield defender
				if(params.fielder.infield && lessThanTwoOuts){
					_.each(potentialPlaysToBeMade, function(playToBeMade){					
						var baseNumber = ((appConstants.GAME_PLAY.BASES[playToBeMade.base].baseNumber === 4) ? 2 : appConstants.GAME_PLAY.BASES[playToBeMade.base].baseNumber);//home plate has same x position as 2nd base
						var throwFromX = (fieldingResults.finalDistanceBounceRollXY ? fieldingResults.finalDistanceBounceRollXY.x : fieldingResults.finalDistanceXY.x);
						//multiply x by base number so that the lower the x, the higher the priority (e.g. SS should prioritize 2B over 1B to his left)
						var baseXDelta = (appConstants.GAME_PLAY.BASES[playToBeMade.base].x * baseNumber);

						playToBeMade.fielderBaseXDifference = (throwFromX - baseXDelta);
						playToBeMade.outPriority += playToBeMade.fielderBaseXDifference;
					});
				}

				//now that all plays to be made have been collected, mark the force outs to give those highest priority
				markForceOuts(potentialPlaysToBeMade, basesBeingAdvancedTo);

				var potentialPlaysFirstOptionList = potentialPlaysToBeMade.slice();
				var sortProperty = ((lessThanTwoOuts < 2) ? 'outPriority' : 'outGuarantee');
				potentialPlaysFirstOptionList = _.sortBy(potentialPlaysFirstOptionList, ['forceOut', sortProperty]);
				//list of potential second throws
				potentialPlaysToBeMade = _.sortBy(potentialPlaysToBeMade, ['forceOut', 'outPriority']);

				fieldingResults.potentialPlaysFirstOptionList = potentialPlaysFirstOptionList;
				fieldingResults.playsToBeMade = potentialPlaysToBeMade;
				firstPlayOption = potentialPlaysFirstOptionList[0];
				
				//determine where to go with the ball
				_.each(potentialPlaysFirstOptionList, function(potentialFirstOptionPlay){
					if(doublePlayPossible) return false;

					throwToBase = potentialFirstOptionPlay;

					if(!throwToBase.forceOut) return;

					var manOnThrownToBase = getDefender((throwToBase.base == 4) ? appConstants.GAME_PLAY.POSITIONS.CATCHER : (throwToBase.base + 'B'));
					var thrownToBase = appConstants.GAME_PLAY.BASES[throwToBase.base];

					//check if someone besides the baseman covered the base on the initial attempt
					//TO DO: HANDLE WHO IS ON BASE IF BASEMAN MADE THE THROW ON NON-CUTOFF PLAY
					if(throwToBase.cutOffMan.position === manOnThrownToBase.position){
						manOnThrownToBase = getDefender(throwToBase.manCoveringCutoffsBase);
					}

					currentTime = throwToBase.timeToBase;

					//check for second throw for double play
					_.each(potentialPlaysToBeMade, function(potentialPlay){
						if(potentialPlay.base == throwToBase.base) return;

						var otherBase = appConstants.GAME_PLAY.BASES[potentialPlay.base];
						var timeToBaseInfo = determineTimeToGetBallToBase(currentTime, manOnThrownToBase, {x : thrownToBase.x, y : thrownToBase.y}, [otherBase]);
						var delta = (potentialPlay.runnersProjectedRunningRate * potentialPlay.timeToBase);

						manOnThrownToBase.xOnPlay = thrownToBase.x;
						manOnThrownToBase.yOnPlay = thrownToBase.y;		
						potentialPlay.timeToBase = timeToBaseInfo[0].timeToBase;
						delta *= (potentialPlay.runnerGoingBackToBase ? -1 : 1);

						//if throw would not be a force out, only consider it a play to be made if runner would be far enough away from base 
						//(not worth the throw if he is too close since catch and tag would be needed)
						var distanceDifference = (potentialPlay.forceOut ? fieldingConstants.DIST_DIFF_FOR_PROJECTED_BASE_REACH : fieldingConstants.DIST_DIFF_FOR_PROJECTED_BASE_REACH_NON_FORCEOUT);

						var projectedDistanceAtTimeBallReachesBase = (potentialPlay.runnersCurrentDistance + delta);
						var runnerDistanceFromBase = (projectedDistanceAtTimeBallReachesBase - appConstants.GAME_PLAY.BASES[potentialPlay.base].distance);						
						var playToBeMade = (potentialPlay.runnerGoingBackToBase ? (runnerDistanceFromBase > distanceDifference) : (runnerDistanceFromBase < distanceDifference));

						if(playToBeMade){
							doublePlayPossible = true;
							doublePlayBase = potentialPlay;

							return false;

							//TO DO: TRIPLE PLAY (extremely rare)
							//return false;
						}
					});

				});

				fieldingResults.playerThrowingBallIn = params.fielder;
				fieldingResults.doublePlayPossible = doublePlayPossible;
				finalThrowToBase = (doublePlayPossible ? throwToBase : firstPlayOption);
				fieldingResults.throwToCutOffMan = finalThrowToBase.throwToCutOffMan;
				fieldingResults.manCoveringCutoffsBase = finalThrowToBase.manCoveringCutoffsBase;
				fieldingResults.cutOffMan = finalThrowToBase.cutOffMan;
				fieldingResults.firstThrowToBase = appConstants.GAME_PLAY.BASES[finalThrowToBase.base].baseId;
				
				//throw out attempt
				var thirdOutRecorded = baseRunningService.handlePlayAction({
					attemptedBase : finalThrowToBase,
					updateOutsOnly : params.updateOutsOnly,
					attempt : 1,
					batter : batter,
					doublePlay : doublePlayPossible,
					forceOut : finalThrowToBase.forceOut
				});

				if(!thirdOutRecorded && doublePlayPossible){
					fieldingResults.secondThrowToBase = appConstants.GAME_PLAY.BASES[doublePlayBase.base].baseId;

					baseRunningService.handlePlayAction({
						attemptedBase : doublePlayBase,
						updateOutsOnly : true,
						attempt : 2,
						//used to know if runner beats this 2nd throw and it is at home plate -- it counts if the 1st throw was not a force out
						forceOut : finalThrowToBase.forceOut
					});
				}

			}

			//'casual' throw in as no plays to be made
			//just update base runners
			else{
				fieldingResults.playToBeMadeOnRunner = false;
				baseRunningService.handlePlayAction({updateOutsOnly : params.updateOutsOnly});
			}
		}

		/**
		 * Sets the results of a caught ball or attempts the throw in for fielded ground balls.
		 */
		function handleFieldedBall(playerAttemptingToField){
			var caughtFor3rdOut = false;
			var timeToEvent = fieldingResults.timeToEvent;

			if(battingResults.battedBallType !== battingConstants.BATTED_BALL_TYPES.GROUND_BALL){
				var outsBeforePlay = gamePlayService.outs();

				if(outsBeforePlay === 2){
					caughtFor3rdOut = true;
					fieldingResults.caughtFor3rdOut = true;
				}

				fieldingResults.currentTime = timeToEvent;
				fieldingResults.ballCaught = true;
				gamePlayService.handleGroundOutsFlyOuts(appConstants.FLY_OUT_INDICATOR);

				baseRunningService.handlePlayAction({
					hitBallCaught : true, 
					runnersPosition : batter.position
				});
				
				//reset current time to 0 as the fielder throwing the ball in and any runners tagging up are on a new timeline
				if(!caughtFor3rdOut){
					throwBallIn({
						baseRunners : baseRunningService.getBaseRunners(), 
						throwFromXY : fieldingResults.eventXY, 
						currentTime : 0, 
						fielder : playerAttemptingToField, 
						updateOutsOnly : true, 
						outsBeforePlay : outsBeforePlay
					});
				}
		
			}
			else{
				throwBallIn({
					baseRunners : baseRunningService.startBaseRunners(timeToEvent), 
					throwFromXY : fieldingResults.eventXY, 
					currentTime : timeToEvent, 
					fielder : playerAttemptingToField, 
					updateOutsOnly : false
				});
			}	
		}

		/**
		 * Moves the fielder to the ball put into play while considering his speed and the ball's trajectory.
		 */
		function retrieveBall(isInitialAttempt){
			//if ball would go past defender, but he can get to it at a cutoff angle
			//OR if ball not going past defender: go straight to ball to get to it as quick as possible (cut it off);
			//but if can't get to it where it will pass him, go toward where it will end up

			var fielder = (isInitialAttempt ? fieldingResults.playerFieldingBall : fieldingResults.playerFieldingMissedBall);
			var outsBeforePlay = gamePlayService.outs();
			var currentTime = fieldingResults.timeToEvent;
			var currentDistance = 0;
			var X1Y1 = (isInitialAttempt ? fieldingResults.X1Y1 : fieldingResults.eventXY);
			var X2Y2 = (isInitialAttempt ? fieldingResults.finalDistanceXY : fieldingResults.finalDistanceBounceRollXY);
			var fielderXY = {
				x : fielder.xOnPlay,
				y : fielder.yOnPlay
			};

			//TO DO: TIE TOGETHER DISTANCE FROM FINAL SPOT AND DECELERATION (MAKE SO THAT THE DISTANCE DELTA HITS 0 AT ACTUAL FINAL SPOT)
			var distanceFromEventToFinalSpot = __.getDistance(X1Y1, X2Y2);
			var previousPointXY = X1Y1;
			var pointTimeDelta = fieldingConstants.POINT_TIME_DELTA;
			var X1Y1distance = (isInitialAttempt ? battingResults.hitDistance : fieldingResults.eventDistance);
			var rateBallGotToEventLoc = (currentTime / X1Y1distance);
			var distanceDelta = ((pointTimeDelta / rateBallGotToEventLoc) / fieldingConstants.BALL_RETRIEVAL_DISTANCE_DELTA_DIVIDER);
			var distanceDeceleration = __.getRandomDecimalInclusive(fieldingConstants.DISTANCE_DECELERATION_MIN, fieldingConstants.DISTANCE_DECELERATION_MAX, 5);
			var ballRetrievedAlongPath = false;
			var subtractFromDistance = false;
			var distanceBallRollsIntoWall = 999;
			var delta = __.getRandomDecimalInclusive(0, (fielder.runSpeed * fieldingConstants.BALL_RETRIEVAL_RUN_SPEED_MULTIPLIER), 2);
			var runRate = (appConstants.GAME_PLAY.AVG_FPS_MOVED_FOR_HARDEST_PLAYS_MADE + ((__.getRandomIntInclusive(0, 100) <= fielder.runSpeed) ? delta : (delta * -1)));

			if(fieldingResults.ballHittingWallFromAir){
				subtractFromDistance = true;
			}
			else if(fieldingResults.ballRollHitWallDistance){
				distanceBallRollsIntoWall = __.getDistance(X1Y1, fieldingResults.ballRollsIntoWallXY);
				//distance between event and wall plus distance it goes after hitting wall
				distanceFromEventToFinalSpot = (fieldingResults.distanceBouncedOffWall + distanceBallRollsIntoWall);
			}	

			//simultaneous ball and player movement until ball stops
			while((distanceFromEventToFinalSpot - currentDistance) > 0){
				var currentPointDistance = (subtractFromDistance ? (distanceDelta * -1) : distanceDelta);
				var currentPointXY = __.getX2Y2(previousPointXY.x, previousPointXY.y, currentPointDistance, fieldingResults.hitAngle);
				
				currentTime += pointTimeDelta;
				currentDistance += distanceDelta;

				//ball hits wall so it is now moving in the other direction
				if(!subtractFromDistance && (currentDistance >= distanceBallRollsIntoWall)){
					var distanceFromPreviousPointToWall = __.getDistance(previousPointXY, fieldingResults.ballRollsIntoWallXY);
					currentPointXY = __.getX2Y2(fieldingResults.ballRollsIntoWallXY.x, fieldingResults.ballRollsIntoWallXY.y, ((distanceDelta - distanceFromPreviousPointToWall) * -1), fieldingResults.hitAngle);
					subtractFromDistance = true;	
				}

				var currentPoint = {
					x : currentPointXY.x, 
					y : currentPointXY.y, 
					time : currentTime
				};

				var distancePlayerTravelsInCurrTime = (runRate * currentTime);
				var distanceBetweenPlayersInitialXYAndCurrPoint = __.getDistance(fielderXY, currentPointXY);

				//if defender within a few feet of the ball, grab it
				if((distanceBetweenPlayersInitialXYAndCurrPoint - distancePlayerTravelsInCurrTime) <= fieldingConstants.MAX_FEET_TO_GRAB_BALL){
					ballRetrievedAlongPath = true;
					break;
				}

				distanceDelta /= distanceDeceleration;
				previousPointXY = currentPointXY;
			}

			if (!ballRetrievedAlongPath){
				currentTime += ((distanceBetweenPlayersInitialXYAndCurrPoint - distancePlayerTravelsInCurrTime) / runRate);
			}

			if(isInitialAttempt){
				fieldingResults.timeToEvent = parseFloat(currentTime.toFixed(1));
			}

			fieldingResults.currentTime = currentTime;

			var baseRunners = baseRunningService.startBaseRunners(currentTime);

			throwBallIn({
				baseRunners : baseRunners, 
				throwFromXY : currentPoint, 
				currentTime : currentTime, 
				fielder : fielder, 
				outsBeforePlay : outsBeforePlay
			});	

		}

		/**
		 * Determines which defender fields a ball that passed an initial defender or was not catchable before it landed.
		 */
		function detemineMissedBallFielder(angles){
			var bounceRollStartXY = fieldingResults.X1Y1;
			var battedBallType = battingResults.battedBallType;
			var originalDistance = battingResults.hitDistance;
			var finalDistance = fieldingResults.finalDistance;

			//only need to determine final distance for non-GBs
			if((battedBallType !== battingConstants.BATTED_BALL_TYPES.GROUND_BALL) && !fieldingResults.ballHittingWallFromAir){
				if(battedBallType === battingConstants.BATTED_BALL_TYPES.LINE_DRIVE){
					finalDistance += __.getRandomIntInclusive(fieldingConstants.BOUNCE_ROLL_FINAL_DIST.LD.min, fieldingConstants.BOUNCE_ROLL_FINAL_DIST.LD.max);			
				}
				else{
					finalDistance += Math.floor(finalDistance * (__.getRandomDecimalInclusive(fieldingConstants.BOUNCE_ROLL_FINAL_DIST.FlyB_PU.min, fieldingConstants.BOUNCE_ROLL_FINAL_DIST.FlyB_PU.max, 2)));
				}
			}

			//ball bounces off wall and is sent in the other direction
			if(fieldingResults.ballHittingWallFromAir){
				finalDistance -= __.getRandomIntInclusive(fieldingConstants.BOUNCE_ROLL_FINAL_DIST.BALL_OFF_WALL_FROM_AIR.min, fieldingConstants.BOUNCE_ROLL_FINAL_DIST.BALL_OFF_WALL_FROM_AIR.max);
			}
			else{
				//ball hit far enough to hit wall
				if(finalDistance >= fieldingConstants.LF_RF_FOUL_LINE_DIST){
					//TO DO: HARDER/QUICKER IT GOT TO WALL, MORE IT BOUNCES
					//ALSO BALL DOESN'T BOUNCE OFF WALL AT SAME ANGLE IT HIT IT AT

					//distance that ball hit wall
					var wallDistance = determineWallDistance(fieldingResults.rawHitAngle, angles);

					var distanceBouncedOffWall = __.getRandomIntInclusive(fieldingConstants.BOUNCE_ROLL_FINAL_DIST.BALL_OFF_WALL_FROM_GROUND.min, fieldingConstants.BOUNCE_ROLL_FINAL_DIST.BALL_OFF_WALL_FROM_GROUND.max);
					fieldingResults.ballRollHitWallDistance = wallDistance;
					fieldingResults.distanceBouncedOffWall = distanceBouncedOffWall;
					finalDistance = (wallDistance - distanceBouncedOffWall);					
					fieldingResults.ballRollsIntoWallXY = __.getX2Y2(fieldingConstants.HOME_PLATE_X, fieldingConstants.HOME_PLATE_Y, wallDistance, fieldingResults.hitAngle);
				}
			}

			fieldingResults.finalDistance = finalDistance;

			var finalDistanceBounceRollXY = __.getX2Y2(bounceRollStartXY.x, bounceRollStartXY.y, (finalDistance - originalDistance), fieldingResults.hitAngle);
			fieldingResults.finalDistanceBounceRollXY = finalDistanceBounceRollXY;

			//take P out of equation of missed ball as he won't go for a ball past him (one of the infielders instead)
			playersFieldingBall.splice(_.findIndex(playersFieldingBall, {position: appConstants.GAME_PLAY.POSITIONS.PITCHER}), 1);

			//recalculate who goes after ball as that may not necessarily be whoever's 2nd in line from who missed it
			_.each(playersFieldingBall, function(player){
				//initial coordinates when play began
				var playerStartingXY = {
					x : player.xOnPlay,
					y : player.yOnPlay
				};

				var playerToFinalDist = __.getDistance(playerStartingXY, finalDistanceBounceRollXY);				
				player.distanceToFinalBallDist = playerToFinalDist;
			});

			playersFieldingBall.sort(sortByDistToFinal);
			fieldingResults.playerFieldingMissedBall = playersFieldingBall[0];

			retrieveBall();
		}

		/**
		 * Gathers information on the ball put into play and determines the result of fielding attempt.
		 */
		function fieldBall(_battingResults){
			//clear results form last time ball was fielded
			fieldingResults = {};

			var defense =  gamePlayService.getDefense();
			defenders = defense.players;
			battingResults = _battingResults;
			playersFieldingBall = [];
			pitcher = gamePlayService.getPitcher();
			batter = gamePlayService.getBatter();

			if(battingResults.putIntoPlay){
				var battedBallType = battingResults.battedBallType;
				var groundBallInitialXY;
				var finalDistance = battingResults.hitDistance;
				var finalDistanceXY;
				var timeToEvent;//hang time, or time to reach ball before passes player if GB
				var hitAngle;
				var hitSection;
				var wallDistance;
				var homePlate;
				var ballWillGoPastDefender = false;
				var sortFunction;
				var distanceToEventKey;
				var foulPlayable = battingResults.fouledBallPlayable;
				var angles = foulPlayable ? fieldingConstants.FOUL_TERRITORY_ANGLES : fieldingConstants.IN_PLAY_ANGLES;




				//***************************************DETERMINE DEFENDERS INVOLVED IN PLAY*****************************************************




				//hit to left field
				if(((battingResults.fieldSectionHitTo === battingConstants.FIELD_SECTIONS.PULL) && (batter.handedness === appConstants.RIGHT))
					|| ((battingResults.fieldSectionHitTo === battingConstants.FIELD_SECTIONS.OPPOSITE) && (batter.handedness === appConstants.LEFT))){
					hitSection = appConstants.LEFT;
					playersFieldingBall = determinePlayersFieldingBall(appConstants.RIGHT);
					hitAngle = __.getRandomDecimalInclusive(angles.LEFT_MIN, angles.LEFT_MAX, 2);
				}

				if(battingResults.fieldSectionHitTo === battingConstants.FIELD_SECTIONS.CENTER){
					playersFieldingBall = determinePlayersFieldingBall(appConstants.CENTER);				
					//ball behind plate's y-plane
					if(foulPlayable) playersFieldingBall = [getDefender(appConstants.GAME_PLAY.POSITIONS.CATCHER), getDefender(appConstants.GAME_PLAY.POSITIONS.FIRST_BASEMAN), getDefender(appConstants.GAME_PLAY.POSITIONS.THIRD_BASEMAN)];

					hitAngle = __.getRandomDecimalInclusive(angles.CENTER_MIN, angles.CENTER_MAX, 2);
					hitSection = ((hitAngle > fieldingConstants.IN_PLAY_ANGLES.CENTER_BASE_ANGLE) ? appConstants.LEFT_CENTER : appConstants.RIGHT_CENTER);
				}

				//hit to right field
				if(((battingResults.fieldSectionHitTo === battingConstants.FIELD_SECTIONS.PULL) && (batter.handedness === appConstants.LEFT))
					|| ((battingResults.fieldSectionHitTo === battingConstants.FIELD_SECTIONS.OPPOSITE) && (batter.handedness === appConstants.RIGHT))){
					hitSection = appConstants.RIGHT;
					playersFieldingBall = determinePlayersFieldingBall(appConstants.LEFT);
					hitAngle = __.getRandomDecimalInclusive(angles.RIGHT_MIN, angles.RIGHT_MAX, 2);
				}

				if(foulPlayable && ((hitSection === appConstants.RIGHT) || (hitSection === appConstants.LEFT))){
					//take CF out of play, add C
					playersFieldingBall.splice(_.findIndex(defenders, {position: appConstants.GAME_PLAY.POSITIONS.CENTER_FIELDER}), 1);
					playersFieldingBall.push(getDefender(appConstants.GAME_PLAY.POSITIONS.CATCHER));
				}

				fieldingResults.hitSection = hitSection;




				//***************************************GET TIME TO EVENT*****************************************************




				if(battedBallType === battingConstants.BATTED_BALL_TYPES.GROUND_BALL){
					groundBallInitialXY = __.getX2Y2(fieldingConstants.HOME_PLATE_X, fieldingConstants.HOME_PLATE_Y, battingResults.hitDistance, __.convertToRadians(hitAngle));

					_.each(fieldingConstants.GB_FINAL_DIST_TIERS, function(tier){
						if(battingResults.hitDistance <= tier.distPlusHtpMax){
							//go toward ball if slow roller
							if(tier.slowTier) fieldingResults.goTowardGB = true;

						 	finalDistance = (battingResults.hitDistance + __.getRandomIntInclusive(tier.deltaMin, tier.deltaMax));
							timeToEvent = __.getRandomDecimalInclusive(tier.timeToEventMin, tier.timeToEventMax, 1);

							return false;
						}
					});
				}
				else{
					var timeMap;
					var timeNum;
					var eventIndex = 0;
				
					if(battedBallType === battingConstants.BATTED_BALL_TYPES.LINE_DRIVE){
						timeNum = battingResults.hitDistance;
						timeMap = fieldingConstants.LD_TIME_PERCENTAGES;
					}	
					else{
						var timeTotal = ((battedBallType === battingConstants.BATTED_BALL_TYPES.FLY_BALL) ? fieldingConstants.FLYB_TIME_TOTAL : fieldingConstants.PU_TIME_TOTAL);
						timeNum = __.getRandomIntInclusive(1, timeTotal);
						timeMap = fieldingConstants.FLYB_PU_TIME_EVENTS;
					}

					_.each(timeMap, function(timing){
						eventIndex += timing.index;
						var hangTimeIndex = ((battedBallType === battingConstants.BATTED_BALL_TYPES.LINE_DRIVE) ? timing.index : eventIndex);

						if(timeNum <= hangTimeIndex){
							timeToEvent = (timing.minTime ? __.getRandomDecimalInclusive(timing.minTime, timing.maxTime, 1) : timing.time);
							
							return false;
						}
					});
					
				}

				fieldingResults.finalDistance = finalDistance;




				//***************************************GET WALL INFO****************************************************




				//determine result of ball in relation to wall
				if((finalDistance >= fieldingConstants.LF_RF_FOUL_LINE_DIST) || foulPlayable){
					if(foulPlayable && ((hitSection === appConstants.RIGHT) || (hitSection === appConstants.LEFT))){
						//check which part of side wall ball was hit to as angles/distances vary on it
						determineLRFoulWallSectionHitTo(hitAngle, angles);
					}

					wallDistance = determineWallDistance(hitAngle, angles);

					if(!foulPlayable){
						if(battedBallType !== battingConstants.BATTED_BALL_TYPES.GROUND_BALL){
							var clearWallDistance = (wallDistance + fieldingConstants.WALL_HEIGHT + (fieldingConstants.BASE_CLEAR_WALL_HANG_TIME - timeToEvent));
							var hitWallDistance = {
								min : (clearWallDistance - fieldingConstants.WALL_HEIGHT),
								max : (clearWallDistance - 1)
							};

							//HOME RUN!!!
							if(finalDistance > clearWallDistance){
								var currentBaseRunners = baseRunningService.getBaseRunnersStatus();
								battingResults.runnersBattedInOnHomeRun = currentBaseRunners.runnersOn;
								gamePlayService.updateScore(baseRunningService.getBaseRunners(), true, batter, currentBaseRunners.code);
								baseRunningService.setClearBases();
								gamePlayService.updateCount({plateAppearanceEnded : appConstants.HOMERUN});

								//TODO: CHECK IF JUST OVER WALL AND CAN ACTUALLY BE FIELDED -- MAKE CHANCE OF FIELDING LESS!

								battingResults.homeRun = true;
								battingResults.plateAppearanceEnded = true;

								return fieldingResults;
							}
							//HITS WALL
							//TODO: MAKE CHANCE OF FIELDING LESS! (BUT NOT AS MUCH AS BALL GOING OVER WALL); CAN RUN INTO WALL AS CATCHING 
							else if((finalDistance >= hitWallDistance.min) && (finalDistance <= hitWallDistance.max)){
								//still check if defender fields, just accounts for fact that if they miss, bounce/roll is different off wall
								fieldingResults.ballHittingWallFromAir = true;
							}
							//ELSE HITS GROUND
						}
					}
					//playable foul ball -- we have the wall distance, now determine final distance since we know it is within the walls
					else{
						var pitchType = battingResults.pitchTypeSeen;
						var distConstants = battingResults.distConstants;
						var distancesForPitchType = distConstants[battingResults.battedBallType];
						var fouledBallPlayableDistance = __.getRandomIntInclusive(distancesForPitchType[pitchType].min, wallDistance);

						battingResults.hitDistance = fouledBallPlayableDistance;
						finalDistance = fouledBallPlayableDistance;
						fieldingResults.finalDistance = fouledBallPlayableDistance;
					}

				}
			
				fieldingResults.timeToEvent = timeToEvent;




				//***************************************DETERMINE PLAYERS' DISTANCE TO WHERE BALL LANDS/PASSES**********************************************




				fieldingResults.rawHitAngle = hitAngle;
				hitAngle = __.convertToRadians(hitAngle);
				fieldingResults.hitAngle = hitAngle;

				homePlate = {
					x : fieldingConstants.HOME_PLATE_X,
					y : fieldingConstants.HOME_PLATE_Y
				};

				finalDistanceXY = __.getX2Y2(fieldingConstants.HOME_PLATE_X, fieldingConstants.HOME_PLATE_Y, finalDistance, hitAngle);
				fieldingResults.finalDistanceXY = finalDistanceXY;

				//determine who goes after ball
				//in order of closest to where it is going/will land

				var minX = fieldingConstants.DEFENSE_POSITIONING_X_MOVE_MIN;
				var maxX = fieldingConstants.DEFENSE_POSITIONING_X_MOVE_MAX;

				var minY = fieldingConstants.DEFENSE_POSITIONING_Y_MOVE_MIN;
				var maxY = fieldingConstants.DEFENSE_POSITIONING_Y_MOVE_MAX;

				//shift the defense depending on batter's handedness
				_.each(playersFieldingBall, function(player){
					if((player.position !== appConstants.GAME_PLAY.POSITIONS.CATCHER) && (player.position !== appConstants.GAME_PLAY.POSITIONS.PITCHER)){
						var randomXPosition = __.getRandomIntInclusive(minX, maxX);
						var randomYPosition = __.getRandomIntInclusive(minY, maxY);
						var randomXMultiplier = 1;
						//default to moving back
						var randomYMultiplier = -1;
						
						//right handed batter -- shift to defense's right
						if(batter.handedness === appConstants.RIGHT){
							randomXMultiplier = -1;

							//move player on right side of field forward
							if(player.fieldSide === appConstants.RIGHT) randomYMultiplier = 1;
						}
						//fielder on left side vs left handed batter -- shift to defense's left
						else if(player.fieldSide === appConstants.LEFT) randomXMultiplier = 1;

						player.xOnPlay = (player.x + (randomXPosition * randomXMultiplier));
						player.yOnPlay = (player.y + (randomYPosition * randomYMultiplier));
					}
					else{
						player.xOnPlay = player.x;
						player.yOnPlay = player.y;
					}

					var playerXY = {
						x : player.xOnPlay,
						y : player.yOnPlay
					};

					var homePlateToPlayerDist = __.getDistance(homePlate, playerXY);
					var playerToFinalDist = __.getDistance(playerXY, finalDistanceXY);

					player.homePlateToPlayerDist = homePlateToPlayerDist;
					player.distanceToFinalBallDist = playerToFinalDist;

					if(finalDistance > homePlateToPlayerDist){
						var ballPassesDefenderXY = __.getX2Y2(fieldingConstants.HOME_PLATE_X, fieldingConstants.HOME_PLATE_Y, homePlateToPlayerDist, hitAngle);
						var playerToPassingPoint = __.getDistance(playerXY, {x : ballPassesDefenderXY.x, y : ballPassesDefenderXY.y});
						
						player.ballPassingPoint = ballPassesDefenderXY;
						player.playerDistToBallPassingPoint = playerToPassingPoint;
						ballWillGoPastDefender = true;
					}
					else{
						//not going past this player
						//will use his distance to final spot to evaluate
						player.playerDistToBallPassingPoint = 999;
					}
				});




				//*********************************************SORT PLAYERS BASED ON WHERE BALL IS GOING AND WHO IT WILL BE CLOSEST TO**************************************




				//ground ball not going past any defender or a non-GB;
				//closest person to final distance fields it
				if(!ballWillGoPastDefender || (battedBallType !== battingConstants.BATTED_BALL_TYPES.GROUND_BALL)){
					fieldingResults.goingPastDefender = false;
					sortFunction = sortByDistToFinal;
					distanceToEventKey = 'distanceToFinalBallDist';
				}
				//ground ball going past defender
				else{
					fieldingResults.goingPastDefender = true;
					sortFunction = sortByDistToPassingPoint;
					distanceToEventKey = 'playerDistToBallPassingPoint'; 
				}

				playersFieldingBall.sort(sortFunction);
				var playerAttemptingToField = playersFieldingBall[0];

				//handle pitcher as defender; chances of him being able to field the ball are lowered
				if((playerAttemptingToField.position === appConstants.GAME_PLAY.POSITIONS.PITCHER) && fieldingResults.goingPastDefender && !fieldingResults.goTowardGB){
					var fractionOfTimeToEvent = (timeToEvent / fieldingConstants.PITCHER_FIELDING_DIVIDER);
					timeToEvent = ((fractionOfTimeToEvent < fieldingConstants.MIN_TIME_TO_EVENT) ? fieldingConstants.MIN_TIME_TO_EVENT : fractionOfTimeToEvent);
					timeToEvent = parseFloat(timeToEvent.toFixed(1));
					fieldingResults.timeToEvent = timeToEvent;
				}




				//********************************************GATHER THE INFO REGARDING CHANCE PLAYER HAS TO GET TO BALL*****************************************




				var ratesForTime = fieldingConstants.CHANCES[timeToEvent];
				//determine bounce/roll starting point if defender cannot make play which is wherever ball hits ground
				var X1Y1 = ((battedBallType === battingConstants.BATTED_BALL_TYPES.GROUND_BALL) ? groundBallInitialXY : finalDistanceXY);
				
				fieldingResults.X1Y1 = X1Y1;
				fieldingResults.playerFieldingBall = playerAttemptingToField;
				fieldingResults.distanceFromEvent = playerAttemptingToField[distanceToEventKey];		

				//go to ball for GBs that are slow to pass defender
				if(fieldingResults.goTowardGB){
					fieldingResults.chance = 100;
					retrieveBall(true);
				}
				else if(ratesForTime){
					var defenderSPD = playerAttemptingToField.runSpeed;
					var playerDistanceKey = __.roundDownToNearest5(playerAttemptingToField[distanceToEventKey]);
					var chanceOfFielding = ratesForTime[playerDistanceKey.toString()];
					var fieldingNum = __.getRandomDecimalInclusive(0, 100, 1);
					var addToChance = (__.getRandomIntInclusive(0, 100) <= defenderSPD);
					var multiplierBase = (addToChance ? __.getRandomIntInclusive(0, defenderSPD) : __.getRandomIntInclusive(0, __.get100minusAttribute(defenderSPD)));
					var multiplier = (fieldingConstants.AIRBORN_BALL_MULTIPLIER * (addToChance ? __.getRandomIntInclusive(0, defenderSPD) : __.getRandomIntInclusive(0, __.get100minusAttribute(defenderSPD))));
					var delta = multiplierBase * multiplier;
					var finalChanceOfFielding;

					//needed for missed ball logic;
					//get where ball is when missed by first defender, or where it landed
					fieldingResults.eventXY = (fieldingResults.goingPastDefender ? playerAttemptingToField.ballPassingPoint : finalDistanceXY);
					fieldingResults.eventDistance = (fieldingResults.goingPastDefender ? playerAttemptingToField.homePlateToPlayerDist : fieldingResults.finalDistance);




					//******************************************DETERMINE RESULT OF PLAY****************************************



					
					var caughtBallParams = {};

					//undefined means 0 or 100
					if(!chanceOfFielding){
						//0% chance
						//oneHundredMax should only be undefined for 0.5-1.1 (no 100% distances)
						if(!ratesForTime.oneHundredMax || (playerDistanceKey > ratesForTime.oneHundredMax)){
							fieldingResults.chance = 0;
							fieldingResults.finalChanceOfFielding = 0;
							fieldingResults.playMadeOnHit = false;

							if(foulPlayable){
								gamePlayService.updateCount({addStrike : true, fouledAway : true});
								battingResults.fouledAway = true;

								return fieldingResults;
							}

							detemineMissedBallFielder(angles);

							return fieldingResults;
						}
						//100% chance
						else if((playerDistanceKey <= ratesForTime.oneHundredMax) && !((battedBallType === battingConstants.BATTED_BALL_TYPES.GROUND_BALL) && (playerAttemptingToField.position === appConstants.GAME_PLAY.POSITIONS.PITCHER))){
							fieldingResults.chance = 100;
							fieldingResults.finalChanceOfFielding = 100;
							fieldingResults.playMadeOnHit = true;
							battingResults.plateAppearanceEnded = true;//set true here for playable foul ball

							handleFieldedBall(playerAttemptingToField);

							return fieldingResults;
						}					
					}
					//chance is between 0 and 100

					//halve the chance of fielding the ball if pitcher
					if(playerAttemptingToField.position === appConstants.GAME_PLAY.POSITIONS.PITCHER) chanceOfFielding /= fieldingConstants.PITCHER_FIELDING_DIVIDER;

					fieldingResults.chance = chanceOfFielding;
					delta *= (addToChance ? 1 : -1);
					finalChanceOfFielding = (chanceOfFielding + delta);
					fieldingResults.finalChanceOfFielding = finalChanceOfFielding;

					if(fieldingNum <= finalChanceOfFielding){
						fieldingResults.playMadeOnHit = true;				
						battingResults.plateAppearanceEnded = true;//set true here playable foul ball

						handleFieldedBall(playerAttemptingToField);	
					}
					else{
						fieldingResults.playMadeOnHit = false;

						if(foulPlayable){
							gamePlayService.updateCount({addStrike : true, fouledAway : true});
							battingResults.fouledAway = true;

							return fieldingResults;
						}

						if(finalChanceOfFielding >= fieldingConstants.MAX_FIELDING_CHANCE_FOR_ERROR){
							gamePlayService.handleError(playerAttemptingToField);
							fieldingResults.errorOnPlay = playerAttemptingToField;
						}

						detemineMissedBallFielder(angles);
					}
			
				}
				//if !ratesForTime
				else{
					console.log("Could not retrieve catch rates for given time to event");
				}
				
			}
			//end if put into play

			return fieldingResults;
		}

	}]);
}
