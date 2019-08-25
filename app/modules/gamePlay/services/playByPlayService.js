module.exports = function(module){
	module.service('playByPlayService', playByPlayService);

	playByPlayService.$inject = ['pitchConstants', 'appConstants', 'battingConstants', 'fieldingConstants', 'appUtility', 'gamePlayService', 'baseRunningService'];

	function playByPlayService(pitchConstants, appConstants, battingConstants, fieldingConstants, appUtility, gamePlayService, baseRunningService){
		var __ = appUtility;
		var playByPlay = {};

		var api = {
			generatePlayByPlay: generatePlayByPlay
		};

		return api;

		function generatePlayByPlay(params){
			if(!playByPlay[params.inning]) playByPlay[params.inning] = [];

			//END OF HALF/INNING OR GAME
			if(params.inningEnded && !params.gameOver){
				if(params.fullInningEnded) playCall = 'End of the ' + params.inning + ' inning. ';
				else playCall = 'Bottom of the ' + params.inning + ' inning. ';

				playByPlay[params.inning].unshift({
					playCall: playCall,
					announcement: true,
					fullInningEnded: params.fullInningEnded
				});

				return playByPlay;
			}
			else if(params.gameOver){
				playByPlay[params.inning].unshift({
					playCall: 'Game over.',
					announcement: true,
					gameOver: true
				});
			}

			var ___ = (new Chance);
			var breakingBall = (params.pitch.pitchType === pitchConstants.PITCH_TYPES.BREAKING_BALL);
			var pitchType = (breakingBall ? pitchConstants.PITCH_TYPES_FOR_DISPLAY[params.pitch.pitchSubType] : pitchConstants.PITCH_TYPES_FOR_DISPLAY[params.pitch.pitchType]);
			var pitchTypeForCall = (breakingBall ? pitchConstants.PITCH_TYPES_FOR_DISPLAY[params.pitch.pitchSubType] : pitchConstants.PITCH_TYPES_FOR_DISPLAY[params.pitch.pitchType]);
			var capitalizedPitchType = pitchTypeForCall;
			pitchTypeForCall = pitchTypeForCall.toLowerCase();

			var playCall = '';
			var playCallPartTwo = '';

			var pitcher = params.pitcher;
			var batter = params.batter;
			var catcher = gamePlayService.getCatcher();

			var pitch = params.pitch;
			var pitchLocationCall = __.translatePitchLocationForPlayByPlay(pitch.location);
			var pitchVelocity = pitch.pitchVelocity + ' mph';

			var fieldingResults = params.fieldingResults;
			var defender = (fieldingResults.playerFieldingBall ? fieldingResults.playerFieldingBall : '');
			defender = (fieldingResults.playerFieldingMissedBall ? fieldingResults.playerFieldingMissedBall : defender);
			var fielderLastName = defender.lastName;

			var battingResults = params.battingResults;
			var resultingBallCount = (params.balls + 1);
			var resultingStrikeCount = (((params.strikes + 1 === 3) && battingResults.fouledAway) ? 2 : params.strikes + 1);
			var resultingOutCount = (params.outs + 1);
			var hitDistance = (battingResults.hitDistance + ' ft');
			var battedBallType = battingResults.battedBallType;
			var isGroundBall = (battedBallType === battingConstants.BATTED_BALL_TYPES.GROUND_BALL);
			var isPopout = (battedBallType === battingConstants.BATTED_BALL_TYPES.POPUP);
			var fieldOutForDsiplay = fieldingConstants.FIELD_OUTS_FOR_DISPLAY[battedBallType];
			var battedBallTypeForCall = battingConstants.BATTED_BALL_TYPES_FOR_DISPLAY[battedBallType];
			var capitalizedBattedBallType = battedBallTypeForCall;
			battedBallTypeForCall = (battedBallTypeForCall ? battedBallTypeForCall.toLowerCase() : '');
			var fieldSectionForCall = battingConstants.FIELD_SECTIONS_FOR_DISPLAY[battingResults.fieldSectionHitTo];
			var hitSectionForCall = fieldingConstants.HIT_SECTIONS_FOR_DISPLAY[fieldingResults.hitSection];
			var hitSectionForCallShorthand = fieldingConstants.HIT_SECTIONS_FOR_DISPLAY_SHORTHAND[fieldingResults.hitSection];

			var baseRunningResults = params.baseRunningResults;
			var resultingBaseRunners = baseRunningService.getBaseRunners();

			var offense = params.offense;
			var defense = params.defense;
			var offenseScore = offense.battingTotals.totalRuns;
			var defenseScore = defense.battingTotals.totalRuns;



			//STEAL ATTEMPT(S)
			if(baseRunningResults.stealAttempt){
				//MULTI STEAL
				if(baseRunningResults.stealResults.length > 1){

				}

				//SINGLE STEAL
				else{
					var result = baseRunningResults.stealResults[0];

					playCall += ___.bool() ?
						result.runnerLastName + ' takes off to ' + appConstants.NUMBERS_FOR_DISPLAY[result.attemptedBase] + ' base ' + 
							(result.success ? ' and beats the throw' + ((result.attemptedBase === 2 && resultingBaseRunners.length === 1) ? ' from ' + catcher.lastName + ', putting ' + offense.name + ' in scoring position' : '') : ' but is thrown out') + '. ' :
						'Steal attempt by ' + result.runnerLastName + (result.success ? (result.attemptedBase === 3 ? ' beats the throw from ' + catcher.lastName + ' and puts ' + offense.name + ' 90 ft away from a run' : ' succeeds') : ' fails as he is tagged out before touching the bag') + '. Great throw from ' + catcher.lastName + '. ';
					
					if(baseRunningResults.clearBases){
						playByPlay[params.inning].unshift({
							count: (params.balls + '-' + params.strikes),
							bases: params.bases.code,
							outs: params.outs,
							pitcher: params.pitcher,
							pitchType: pitchType,
							pitchVelocity: params.pitch.pitchVelocity,
							batter: params.batter,
							playCall: playCall,
							inningEnded: params.inningEnded
						});

						return playByPlay;
					}
				}
			}



			//SWUNG
			if(battingResults.swung){

				//CONTACT MADE
				if(battingResults.contactMade){
					//FOULED AWAY
					if(battingResults.fouledAway && !battingResults.fouledBallPlayable){
						var fouledAwayCallOne = (___.bool() && (params.strikes === 2)) ?
							batter.lastName + ' hits a ' +  pitchTypeForCall + ' foul, stays alive. ' : 
							pitcher.lastName + '\'s ' + pitchTypeForCall + ' hit foul. ' + params.balls + '-' + resultingStrikeCount + '. ';
						
						var fouledAwayCallTwo = (___.bool() && ((params.balls === resultingStrikeCount) && !(battingResults.fouledAway && params.strikes === 2))) ?
							'Pitch ' + pitchLocationCall + ' is fouled away. Count evened up. ' : 
							capitalizedPitchType + ' is fought off into the stands. ';
					
						playCall = (___.bool() ? fouledAwayCallOne : fouledAwayCallTwo);
					}



					//PLAYABLE FOUL BALL
					else if(battingResults.fouledBallPlayable && !fieldingResults.playToBeMadeOnRunner){
						//CAUGHT
						if(fieldingResults.playMadeOnHit){
							var caughtFoulBallCall = (___.bool() && !fieldingResults.caughtFor3rdOut) ?
								capitalizedPitchType + ' popped up into foul territory. ' + fielderLastName + ' gets under it and makes the play. ' + resultingOutCount + ' away in the ' + params.inning + '. ' : 
								'Playable foul ball caught by ' + fielderLastName + '. ';
						
							playCall = caughtFoulBallCall;
						}

						//NOT CAUGHT
						else{
							playCall = fielderLastName + ' unable to get to the ball popped up foul. ' + params.balls + '-' + resultingStrikeCount + '. ';
						}
					}



					//PUT INTO FIELD OF PLAY
					else{

						//HOME RUN
						if(battingResults.homeRun){
							var runnersBattedIn = battingResults.runnersBattedInOnHomeRun.length;
							var grandSlam = (runnersBattedIn === 3);
							var offenseTrailingBeforePlay = (params.offenseScoreBeforePlay < params.defenseScoreBeforePlay);
							var offenseScorelessBeforePlay = !params.offenseScoreBeforePlay;
							var goAheadHR = (offenseTrailingBeforePlay && (offenseScore > defenseScore));

							var homeRunCallOne = (___.bool() && runnersBattedIn && !grandSlam) ?
								batter.lastName + ' hits a ' + appConstants.NUMBERS_WORDS_FOR_DISPLAY[runnersBattedIn + 1] + '-run shot ' + hitDistance + ' to ' + hitSectionForCall + '! ' + (goAheadHR ? offense.name + ' takes the lead! ' : (batter.HR > 1 ? 'His ' + appConstants.NUMBERS_WORDS_FOR_DISPLAY[batter.HR] + ' of the day! ': '')) : 
								batter.lastName + ' ' + battingConstants.BATTED_BALL_DESC_FOR_DISPLAY_NO_PITCH_TYPE[battedBallType] + ' deep...HOME RUN! ' + offense.name + '\'s ' + appConstants.NUMBERS_FOR_DISPLAY[offense.battingTotals.totalHRs] + ' of the day' + (goAheadHR ? ' as they take the lead. ' : '. ');

							var homeRunCallTwo = ___.bool() ?
								'HOME RUN! ' + hitDistance + ' to ' + hitSectionForCall + '. ' + offenseScore + ' to ' + defenseScore + '. ' :
								pitcher.lastName + '\'s ' + pitchTypeForCall + ' is launched to ' + hitSectionForCall + ' for a HOME RUN! A ' + hitDistance + ' ' + (runnersBattedIn ? appConstants.NUMBERS_WORDS_FOR_DISPLAY[runnersBattedIn + 1] + '-run' : 'solo') + ' shot for ' + batter.lastName + '. ' ;
							
							var homeRunCallThree = grandSlam ? 'GRAND SLAM!!! ' + batter.lastName + ' smacks a ' + hitDistance + ' rocket to ' + hitSectionForCall + ' here in the ' + params.inning + '! Wow! ' : 
								'That one ain\'t coming back! ' + batter.lastName + ' drives the ball ' + hitDistance + ' to ' + hitSectionForCall
									+ (offenseScorelessBeforePlay ? ', putting ' + offense.name + ' on the board. ' : '. ' + offenseScore + ' to ' + defenseScore + '. ');
						
							playCall = (___.bool() ? homeRunCallOne : homeRunCallTwo);
							playCall = (___.bool() ? playCall : homeRunCallThree);
						}

						//NON HOME RUNS
						else{
							var cutOffManLastName = (fieldingResults.throwToCutOffMan ? fieldingResults.cutOffMan.lastName : '');
							var playToBeMade = (fieldingResults.playsToBeMade ? fieldingResults.playsToBeMade.length : false);
							var currentOuts = gamePlayService.outs();							
							var doublePlayPossible = fieldingResults.doublePlayPossible;
							var battersBase = (parseInt(fieldingResults.baseBatterAdvancedTo) ? parseInt(fieldingResults.baseBatterAdvancedTo) : 4);
							var runnersOnBeforePlay = params.runnersOnBeforePlay;
							var numberOfPlayersScored = (baseRunningResults.playersWhoScored ? baseRunningResults.playersWhoScored.length : 0);
							var thirdOutMade = ((baseRunningResults.playersThrownOut || fieldingResults.ballCaught) && baseRunningResults.clearBases);
							var resultingStatus = (!thirdOutMade ? 
								(resultingBaseRunners.length ? (resultingBaseRunners.length < 3 ? resultingBaseRunners.length + ' on, ' : 'Bases loaded with ') : '') + appConstants.OUTS_FOR_DISPLAY[gamePlayService.outs()] : '');
							var batterThrownOut = _.find(baseRunningResults.playersThrownOut, {base: battersBase});
							var currentBaseRunners = baseRunningService.getBaseRunnersStatus();

							if(playToBeMade){
								var firstThrowBase = (parseInt(fieldingResults.firstThrowToBase) ? parseInt(fieldingResults.firstThrowToBase) : 4);
								var firstThrowBasePlay = _.find(fieldingResults.playsToBeMade, {base: firstThrowBase});
								var firstThrowBaseRunnerPosition = firstThrowBasePlay.runnersPosition;
								var firstThrowBaseRunnerLastName = firstThrowBasePlay.runnersLastName;
								var firstThrowRunner = _.find(offense.players, function(player){
									return ((player.position === firstThrowBaseRunnerPosition) && !player.inactive);
								});
								var firstRunnerScores = (baseRunningResults.firstAttemptRunnerSafe && (firstThrowBase === 4));
								var firstThrowRunnerIsBatter = (firstThrowBaseRunnerPosition === batter.position);
			
								if(fieldingResults.secondThrowToBase){
									var secondThrowBase = (parseInt(fieldingResults.secondThrowToBase) ? parseInt(fieldingResults.secondThrowToBase) : 4);
									var secondThrowBasePlay = _.find(fieldingResults.playsToBeMade, {base: secondThrowBase});
									var secondThrowBaseRunnerPosition = secondThrowBasePlay.runnersPosition;
									var secondThrowBaseRunnerLastName = secondThrowBasePlay.runnersLastName;
								}
							}

							var playAttemptOnBatter = ((firstThrowBase === battersBase) || (secondThrowBase === battersBase));

							//FLYOUTS
							if(fieldingResults.ballCaught){
								playCall = ___.bool() ?
									batter.lastName + ' ' + fieldOutForDsiplay + (isPopout ? ' as ' + fielderLastName + ' gets under it' : ' to ' + hitSectionForCall) + '. ' :
									(isPopout ? 'Pitch popped up and ' : capitalizedBattedBallType + ' hit to ' + hitSectionForCall + '. ') + fielderLastName + ' able to get under it and make the play' 
										+ ((fieldingResults.finalChanceOfFielding < fieldingConstants.DIFFICULT_FIELD_OUT_MAX_CHANCE) ? '. He really had to lay out for that one.  Great effort. ' : ' for the ' + appConstants.NUMBERS_FOR_DISPLAY[resultingOutCount] + ' out. ');

								//PLAY ON A BASE RUNNER
								if(fieldingResults.playToBeMadeOnRunner){
									var playOnRunnerAttemptCall = ___.bool() ?
										fielderLastName + (cutOffManLastName ? ' relays it to ' + cutOffManLastName + ' who ' : '') + ' fires it to ' + appConstants.BASES_FOR_DISPLAY[firstThrowBase] + ' for the tag attempt on ' + firstThrowBaseRunnerLastName + '. The throw is ' :
										firstThrowBaseRunnerLastName + ' tags up and makes his way to ' + appConstants.BASES_FOR_DISPLAY_SHORTHAND[firstThrowBase] + '. The throw in from ' + (fieldingResults.cutOffMan ? 'cutoff man ' + cutOffManLastName : fielderLastName) + ' to ' + appConstants.BASES_FOR_DISPLAY[firstThrowBase] + ' is ' ;

									var playOnRunnerResultCall = ___.bool() ?
										baseRunningResults.firstAttemptRunnerSafe ? ' not in time! ' : ' in time! ' :
										baseRunningResults.firstAttemptRunnerSafe ? ' too late! ' + firstThrowBaseRunnerLastName + ' safe' + (firstRunnerScores ? 'ly in for the score' : ' at ' + appConstants.BASES_FOR_DISPLAY_SHORTHAND[firstThrowBase] + '. ')
											: ' in time and the tag is made. ';

									playCallPartTwo += (playOnRunnerAttemptCall + playOnRunnerResultCall);

									//2ND TAG ATTEMPTS MADE AFTER CAUGHT BALL
									if(doublePlayPossible && (baseRunningResults.secondAttemptRunnerSafe !== undefined)){
										var playOn2ndRunnerAttemptCall = 'A second tag ' + (baseRunningResults.secondAttemptRunnerSafe ? 'possible' : 'made') + ' as ' + secondThrowBaseRunnerLastName + ' went to ' + appConstants.BASES_FOR_DISPLAY_SHORTHAND[secondThrowBase];
										var playOn2ndRunnerResultCall = (baseRunningResults.secondAttemptRunnerSafe ? ' but the throw was not in time' : ' and the throw was in time') + '. ' + resultingStatus + '. ';
									
										playCallPartTwo += (playOn2ndRunnerAttemptCall + playOn2ndRunnerResultCall);
									}
								}
								
							}

							//BALL NOT CAUGHT/GROUND BALLS
							else{
								var playOnHitAttemptCall = ___.bool() ?
									batter.lastName + ' hits a ' + battedBallTypeForCall + (isGroundBall ? ' ' + hitSectionForCallShorthand : ' to ' + hitSectionForCall) + '. ' 
										+ ((fieldingResults.playMadeOnHit && (fieldingResults.finalChanceOfFielding < fieldingConstants.DIFFICULT_FIELD_OUT_MAX_CHANCE)) ? fielderLastName + ' makes a great play on it' : (___.bool() ? 'Gathered ' : 'Scooped up ') + ' by ' + fielderLastName) + (cutOffManLastName ? ' who ' + (___.bool() ? 'relays it' : 'throws it in') + ' to cutoff man ' + cutOffManLastName : '') + '. ' :
									capitalizedBattedBallType + ' ' + (isGroundBall ? 'hit ' + hitSectionForCallShorthand : fieldSectionForCall) + ' and ' + (___.bool() ? 'picked up by ' : 'grabbed by ') + fielderLastName + '. ';

								var playOnHitDoublePlayCall = (doublePlayPossible && fieldingResults.secondThrowToBase) ? 
									(___.bool() ? 'Chance at a double play at ' + appConstants.BASES_FOR_DISPLAY_SHORTHAND[firstThrowBase] + ' and ' +  appConstants.BASES_FOR_DISPLAY[secondThrowBase] + '. ' : 
										'Double play possible on ' + firstThrowBaseRunnerLastName + ' at ' + appConstants.BASES_FOR_DISPLAY_SHORTHAND[firstThrowBase] + ' and ' + secondThrowBaseRunnerLastName  + ' at ' +  appConstants.BASES_FOR_DISPLAY_SHORTHAND[secondThrowBase] + '. ') 
									: '';

								var playOnHitResultCall = ___.bool() ?
									playToBeMade ? firstThrowBaseRunnerLastName + ' ' + (baseRunningResults.firstAttemptRunnerSafe ? ' beats the throw and is safe' : ' thrown out') + ' at ' + appConstants.BASES_FOR_DISPLAY_SHORTHAND[firstThrowBase] + '. '
										: ' No throw to be made ' + (!runnersOnBeforePlay.length ? ' at ' + appConstants.BASES_FOR_DISPLAY_SHORTHAND[battersBase] : ' on the bases') + '. ' :
									playToBeMade ? (baseRunningResults.firstAttemptRunnerSafe ? 
											' Throw to ' + appConstants.BASES_FOR_DISPLAY[firstThrowBase] + ' is not in time and ' + firstThrowBaseRunnerLastName + ' is safe' + (firstRunnerScores ? 'ly in for the score' : (firstThrowRunnerIsBatter && ___.bool() ? '. He\'s ' + firstThrowRunner.hits + ' for ' + firstThrowRunner.atBats + ' on the day' : '')) : 
											' Throw made to ' + appConstants.BASES_FOR_DISPLAY_SHORTHAND[firstThrowBase] + ' for out number ' + resultingOutCount) + '. '
										: ' No play to be made. ' + resultingStatus + '. ';

								playCall = playOnHitAttemptCall;
								playCallPartTwo = (playOnHitDoublePlayCall + playOnHitResultCall);

								//DOUBLE PLAY ATTEMPTED
								if(doublePlayPossible && (baseRunningResults.secondAttemptRunnerSafe !== undefined)){
									var playOn2ndRunnerCall = ___.bool() ?
										'Second throw to ' + appConstants.BASES_FOR_DISPLAY[secondThrowBase] + (baseRunningResults.secondAttemptRunnerSafe ? ' is late. ' : ' is in time. ') + (resultingStatus ? resultingStatus + ' here in the ' + params.inning + '. ' : '') :
										(baseRunningResults.secondAttemptRunnerSafe ? secondThrowBaseRunnerLastName + ' safe at ' + appConstants.BASES_FOR_DISPLAY_SHORTHAND[secondThrowBase] + ' as he beats the second throw. ' : 
											(baseRunningResults.firstAttemptRunnerSafe ? appConstants.NUMBERS_FOR_DISPLAY[resultingOutCount] : appConstants.NUMBERS_FOR_DISPLAY[resultingOutCount + 1]) + ' out made at ' + appConstants.BASES_FOR_DISPLAY[secondThrowBase] + (!baseRunningResults.firstAttemptRunnerSafe ? ' as ' + defense.name + ' completes the double play. ' : ' on the second throw. '));
																		
									playCallPartTwo += playOn2ndRunnerCall;
								}
							}

							//FIELDER'S CHOICE
							if(fieldingResults.fieldersChoice && !thirdOutMade){
								playCallPartTwo += ___.bool() ?
									batter.lastName + ' safe at ' + appConstants.BASES_FOR_DISPLAY_SHORTHAND[battersBase] + ' on a fielder\'s choice. ' :
									'Fielder\'s choice allows ' + batter.lastName + ' to reach ' + appConstants.BASES_FOR_DISPLAY[battersBase] + '. ';
							}

							//NON-FIELDER'S CHOICE
							else if(!fieldingResults.fieldersChoice && !thirdOutMade && !batterThrownOut){
								if(___.bool() && !playAttemptOnBatter && (fieldingResults.baseBatterAdvancedTo === appConstants.GAME_PLAY.BASES[1].baseId)){
									playCallPartTwo += (___.bool() && batter.atBats > 1) ?
										(numberOfPlayersScored ? 'An RBI single' : 'Base hit') + ' for ' + batter.firstName + ' who is now ' + batter.hits + ' for ' + batter.atBats + ' in the game. ' : 
										(params.outs ? 'A ' + appConstants.NUMBERS_WORDS_FOR_DISPLAY[params.outs] + '-out base hit for ' + batter.lastName + ' here in the ' + params.inning + '. ' : (!resultingStatus ? 'Base hit with ' + appConstants.OUTS_FOR_DISPLAY[currentOuts] + ' here in the ' + params.inning + '. ' : ''));
								}
								else if(___.bool() && (fieldingResults.baseBatterAdvancedTo === appConstants.GAME_PLAY.BASES[2].baseId)){
									playCallPartTwo += ___.bool() ?
										(numberOfPlayersScored ? 'An RBI double' : 'Double') + ' for ' + batter.lastName + ' as he gets his ' + appConstants.NUMBERS_FOR_DISPLAY[batter.hits] + ' hit of the game. ' : 
										(params.outs ? 'And ' + batter.firstName + ' with a ' + appConstants.NUMBERS_WORDS_FOR_DISPLAY[params.outs] + '-out double on the play. ' : (!resultingStatus ? (currentBaseRunners.runnerOn3rd ? 'Runners' : batter.lastName) + ' in scoring position with ' + appConstants.OUTS_FOR_DISPLAY[currentOuts] + ' here in the ' + params.inning + '. ' : ''));
								}
								else if(___.bool() && (fieldingResults.baseBatterAdvancedTo === appConstants.GAME_PLAY.BASES[3].baseId)){
									playCallPartTwo += ___.bool() ?
										(numberOfPlayersScored ? 'An RBI triple' : 'Triple') + ' for ' + batter.lastName + '. Great hit and great base running. ' : 
										(params.outs ? 'And a ' + appConstants.NUMBERS_WORDS_FOR_DISPLAY[params.outs] + '-out triple for ' + batter.lastName + ' here in the ' + params.inning + '. ' : offense.name + ' with a great scoring opportunity ' + (!resultingStatus ? ' with ' + appConstants.OUTS_FOR_DISPLAY[currentOuts] + '. ' : ''));
								}
							}

							//PLAYERS WHO SCORED
							if((numberOfPlayersScored === 1) && !(firstRunnerScores && (baseRunningResults.playersWhoScored[0].position === firstThrowBaseRunnerPosition))){
								playCallPartTwo += baseRunningResults.playersWhoScored[0].lastName + ' scored. ';
							}

							if((numberOfPlayersScored === 2) && !(firstRunnerScores && (baseRunningResults.playersWhoScored[1].position === secondThrowBaseRunnerPosition))){
								playCallPartTwo += baseRunningResults.playersWhoScored[0].lastName + ' and ' + baseRunningResults.playersWhoScored[1].lastName + (___.bool() ? ' add 2 runs to ' + offense.name + '\'s total. ' : ' both scored. ');
							}

							if(numberOfPlayersScored === 3){
								playCallPartTwo += baseRunningResults.playersWhoScored[0].lastName + ', ' + baseRunningResults.playersWhoScored[1].lastName + ', and ' + baseRunningResults.playersWhoScored[2].lastName + (___.bool() ? ' all scored. ' : ' all driven in for runs. ');
							}

							//ERROR
							if(fieldingResults.errorOnPlay){
								playCallPartTwo += ___.bool() ?
									'Error charged to ' + fieldingResults.errorOnPlay.lastName + ' as he was unable to make the routine play on the ball. ' :
									fieldingResults.errorOnPlay.lastName + ' failed to make the easy play on the ball and is charged with an error. ';
							}

						}
					}
				}



				//SWING AND MISS
				else{
					var swingAndMissCallOne = (___.bool() && battingResults.struckOutSwinging) ?
						'Swing and a miss for ' + batter.lastName + ' on a ' + pitchVelocity + ' ' + pitchTypeForCall + ' ' + pitchLocationCall + ' for the ' + appConstants.NUMBERS_FOR_DISPLAY[resultingOutCount] + ' out. ' : 
						pitcher.lastName + ' gets ' + batter.lastName + ' swinging for ' + appConstants.STRIKE + ' number ' + resultingStrikeCount + '. ';
					
					var swingAndMissCallTwo = ___.bool() ?
						appConstants.STRIKE + ' ' + resultingStrikeCount + ' as ' + batter.lastName + ' whiffs on a ' + pitchTypeForCall + '. ' : 
						(!battingResults.struckOutSwinging ? 'A ' + pitchTypeForCall + ' gets ' + batter.lastName + ' swinging. ' + ((params.balls === 3 && resultingStrikeCount === 2) ? 'Full count' : appConstants.BALLS_FOR_DISPLAY[params.balls] + '. ' + appConstants.STRIKES_FOR_DISPLAY[params.strikes + 1]) + '. ' : 
							pitcher.lastName + ' notches his ' + appConstants.NUMBERS_FOR_DISPLAY[pitcher.battersStruckOut] + ' K with a ' + pitchTypeForCall + ' ' + pitchLocationCall + '. ');
					
					var swingAndMissCallThree = battingResults.likelySwingAndMiss ? batter.lastName + ' goes down swinging on the pitch ' + pitchLocationCall + '. ' : 
						batter.lastName + ' swings and misses on a ' + pitchVelocity + ' ' + pitchTypeForCall + '. ' + (battingResults.struckOutSwinging ? appConstants.NUMBERS_FOR_DISPLAY[batter.strikeOuts] + ' strikeout for him. ' : '');
					
					var finalCall = (___.bool() ? swingAndMissCallOne : swingAndMissCallTwo);
					finalCall = (___.bool() ? finalCall : swingAndMissCallThree);
					playCall += finalCall;
				}
			}



			//NO SWING
			else{
				//HIT BY PITCH
				if(pitch.hitByPitch || battingResults.walked){
					var walkCall = ___.bool() ? 
						pitcher.lastName + ' misses ' + pitchLocationCall + '. ' + appConstants.BALL + ' 4. ' : batter.lastName + ' is walked. ';

					playCall += (pitch.hitByPitch ? batter.lastName + ' hit by pitch. ' : walkCall);

					_.each(baseRunningResults.runnersAdvancedOnHbpOrWalk, function(runner){
						if(runner.position !== batter.position){
							var baseAdvancedTo = runner.currentBase;

							if(baseAdvancedTo === 4) playCall += runner.lastName + ' scores. ';
							else playCall += runner.lastName + ' to ' + appConstants.GAME_PLAY.BASES[baseAdvancedTo].baseName + '. ';
						}
					});
				}
				else{

					//CALLED STRIKE
					if((battingResults.umpireCallOnNonSwing === appConstants.STRIKE)){

						//STRIKE 1 OR 2
						if(!battingResults.struckOutLooking){
							var strikeLookingCallOne = ___.bool() ?
								batter.lastName + ' lays off of a ' + pitchTypeForCall + ' over the plate. ' + ((params.balls === 3 && resultingStrikeCount === 2) ? 'Full count' : params.balls + '-' + resultingStrikeCount + ' the count') + '. ' : 
								pitcher.lastName + '\'s ' + pitchTypeForCall + ' ' + ' catches ' + batter.lastName + ' looking. ' + appConstants.STRIKE + ' ' + resultingStrikeCount + '. ';
							
							var strikeLookingCallTwo = ___.bool() ?
								'No swing on a ' + pitchVelocity + ' ' + pitchTypeForCall + ' ' + pitchLocationCall + ' for ' + appConstants.STRIKE + ' ' + resultingStrikeCount + '. ' :
								capitalizedPitchType + ' thrown for a ' + appConstants.STRIKE + '. ' + appConstants.BALLS_FOR_DISPLAY[params.balls] + ', ' + appConstants.STRIKES_FOR_DISPLAY[params.strikes + 1] + '. ';

							playCall += (___.bool() ? strikeLookingCallOne : strikeLookingCallTwo);
						}

						//BATTER STRUCK OUT LOOKING
						else{
							var strikeOutLookingCall = (___.bool() && (params.outs < 2))?
								batter.lastName + ' goes down on ' + appConstants.STRIKE + 's looking. ' + appConstants.OUTS_FOR_DISPLAY[resultingOutCount] + (resultingStatus ? ' here in the ' + params.inning : '') + '. ' : 
								'3rd ' + appConstants.STRIKE + ' taken ' + pitchLocationCall + '. K number ' + pitcher.battersStruckOut + ' for ' + pitcher.lastName + '. ';
						
							playCall += strikeOutLookingCall;
						}
					}

					//CALLED BALL
					else{
						var ballCallOne = ___.bool() ?
							pitcher.lastName + ' misses ' + pitchLocationCall + ' for ' + appConstants.BALL + ' ' + resultingBallCount + '. ' : 
							appConstants.BALL + ' ' + resultingBallCount + ' on the pitch taken ' + pitchLocationCall + '. ';
						
						var ballCallTwo = ___.bool() ?
							batter.lastName + ' takes a ' + appConstants.BALL + ' ' + pitchLocationCall + '. ' :
							pitcher.lastName + '\'s ' + pitchTypeForCall + ' misses for ' + appConstants.BALL + ' ' + resultingBallCount + '. ' ;

						playCall += (___.bool() ? ballCallOne : ballCallTwo);
					}

				}
			}
			
			if(pitch.pitcherChange){
				//move play by play container down to accomodate pitcher(s) added

				if(gamePlayService.getNumberOfPitchersBroughtIn() === 1) $('#playByPlayContainer').css('margin-top', '100px');
				//a closer has been brought in
				else $('#playByPlayContainer').css('margin-top', '140px');

				playCallPartTwo += ___.bool() ?
					'That was the last pitch for ' + pitch.pitcherChange.takenOut.lastName + ' as he\'s taken out for ' + pitch.pitcherChange.broughtIn.lastName + '. ' :
					defense.name + ' calls it a day for ' + pitch.pitcherChange.takenOut.lastName + ' and brings in ' + pitch.pitcherChange.broughtIn.lastName + '. ';
			}

			//insert each new play at beginning so they latest show on top
			playByPlay[params.inning].unshift({
				count: (params.balls + '-' + params.strikes),
				bases: params.bases.code,
				outs: params.outs,
				pitcher: params.pitcher,
				pitchType: pitchType,
				pitchVelocity: params.pitch.pitchVelocity,
				batter: params.batter,
				playCall: playCall,
				playCallPartTwo: playCallPartTwo,
				inningEnded: params.inningEnded
			});

			return playByPlay;
		}
	}
}