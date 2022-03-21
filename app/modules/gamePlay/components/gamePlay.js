/**
 * Component for the gameplay page.
 */
module.exports = function(module){
	module.component('gamePlay', {
		template: require('../views/gamePlay.html'),
		bindings: {
			startGame: '<',
			gameInProgress: '=',
			gameTeams: '=',
			showPlayerInfo: '=',
			closePlayerInfoModal: '=',
			determineBarDisplay: '=',
			playerInfo: '='
		},
		controller: ['appUtility', 'gamePlayService', 'appConstants', 'pitchConstants', 'battingConstants', 'teamsService', 'pitchService', 'battingService', 'fieldingService', 'baseRunningService', 'playByPlayService', '$timeout', '$compile', 
			function(appUtility, gamePlayService, appConstants, pitchConstants, battingConstants, teamsService, pitchService, battingService, fieldingService, baseRunningService, playByPlayService, $timeout, $compile){
				var __ = appUtility;

				/**
				 * Opens the team stats modal.
				 */
				this.showTeamStatsModal = function(){
					$('#teamStatsModal').show();
				}

				/**
				 * Closes the team stats modal.
				 */
				this.closeTeamStatsModal = function(){
					$('#teamStatsModal').hide();
				}

				/**
				 * Fades in then out the velocity and pitch type of the pitch thrown in place of the count.
				 */
				this.animatePitchResultingCount = function(){
					$('#currentCount').hide();
					$('#pitchThrown').show();

					$timeout(function(___){
						//don't show count when PA ends
						if(___.scope.newBatter) $('#currentCount').css('color', '#ffffff');
						
						$('#currentCount').show();
						$('#pitchThrown').hide();
					}, appConstants.GAME_PLAY.PITCH_RESULTING_COUNT_ANIMATION_TIME, true, {scope: this});
				}

				/**
				 * Fades in a ball at the appropriate location in the strike zone view based on pitch type, location and result.
				 */
				this.animatePitch = function(pitch, battingResults){
					var ballElement = '<div class="pitch-thrown-ball" id="pitchThrownBall' + this.pitcher.pitches + '"></div>';
					var animationContainer = (pitch.hitByPitch ? '.batter-silhouette' : '#strikeZone');
					var pitchThrownBall = $compile(ballElement)(this);
					$(animationContainer).append(pitchThrownBall);

					var pitchThrownBallElement = document.getElementById('pitchThrownBall' + this.pitcher.pitches);
					var animationName = 'animate-';
					var strikeZoneResult;
					var keyframe;
					var keyframeRules;
					
					var locationKey = (this.batter.handedness + pitch.location);
					var pitchType = (pitch.pitchSubType ? pitch.pitchSubType : pitch.pitchType);
					var pitchMovementRanges = pitchConstants.PITCH_ANIMATION_MOVEMENT[pitchType];
					var xMovementMultiplier = ((this.pitcher.handedness === appConstants.LEFT) ? 1 : -1);
					var initialPitchXY;
					var finalPitchXY;
					var ballPositionDivider = 1;

					var animation = _.find(pitchConstants.PITCH_ANIMATION, function(config){
						return _.includes(config.locations, locationKey);
					});

					//get adjustment for animation when umpire miscalls a pitch
					var potentialMiscalledPitchReposition = _.find(pitchConstants.MISCALLED_PITCH_REPOSITION, function(config){
						return _.includes(config.locations, locationKey);
					});


					//SET KEYFRAME

					if(pitch.hitByPitch){
						strikeZoneResult = 'hit-by-pitch';
						$(pitchThrownBall).addClass('hit-by-pitch-ball');
						ballPositionDivider = appConstants.GAME_PLAY.STRIKE_ZONE_BALL_POSITION_DIVIDER;
					}
					else{
						//CALLED BALL OR STRIKE
						if(battingResults.umpireCallOnNonSwing){
							if(battingResults.umpireCallOnNonSwing === appConstants.BALL) strikeZoneResult = 'called-ball';
							else strikeZoneResult = 'called-strike';
						}

						//SWUNG
						if(battingResults.swung){
							//CONTACT MADE
							if(battingResults.contactMade){
								if(battingResults.fouledAway) strikeZoneResult = 'foul';
								else strikeZoneResult = 'put-into-play';
							}
							//SWING AND MISS
							else{
								strikeZoneResult = 'swinging-strike';
							}
						}
					}

					animationName += strikeZoneResult;
					

					//SET KEYFRAME OBJECT TO USE
					
					var sheets = document.styleSheets;
				    _.each(sheets, function(sheet){
				    	_.each(sheet.cssRules, function(rule){
				    		if((rule.type === window.CSSRule.KEYFRAMES_RULE) && (rule.name === animationName)){
				    			keyframe = rule;
				    			return false;
				    		}
				    	});

				    	if(keyframe) return false;
				    });


				    //PROCESS ANIMATION RULES FOR THIS PITCH

				    if(keyframe){
					    keyframeRules = keyframe.cssRules;

					    //clear any previously inserted rules for this keyframe
					    _.each(keyframeRules, function(){
					    	keyframe.deleteRule('0%');
					    	keyframe.deleteRule('100%');
						});

						//BORDER
						$(pitchThrownBallElement).css('border-color', appConstants.GAME_PLAY.STRIKE_ZONE_BALL_COLORS[_.camelCase(strikeZoneResult)]);
					    if(strikeZoneResult === 'swinging-strike') $(pitchThrownBallElement).css('border-style', 'dashed');    

					    //OPACITY
					    keyframe.appendRule('from {opacity: 0;}');
					    keyframe.appendRule('to {opacity: 1;}');

					    //BALL SIZE
					    keyframe.appendRule('from {width: 0px;}');
					    keyframe.appendRule('to {width: ' + appConstants.GAME_PLAY.STRIKE_ZONE_BALL_SIZE + 'px;}');
					    keyframe.appendRule('from {height: 0px;}');
					    keyframe.appendRule('to {height: ' + appConstants.GAME_PLAY.STRIKE_ZONE_BALL_SIZE + 'px;}');

					    //BALL MOVEMENT
					    finalPitchXY = {
					    	x: (__.getRandomDecimalInclusive(animation.ranges.minLeft, animation.ranges.maxLeft, 5) / ballPositionDivider),
					    	y: (__.getRandomDecimalInclusive(animation.ranges.minTop, animation.ranges.maxTop, 5) / ballPositionDivider)
					    };

					    //REPOSITION MISCALLED PITCH IF WOULD DISPLAY TOO FAR IN ZONE IF CALLED BALL OR OUT OF ZONE IF CALLED STRIKE
					    if(battingResults.umpireMissedCall && potentialMiscalledPitchReposition){//have to check for potentialMiscalledPitchReposition since SC is never miscalled
					    	//non-corner locations
					    	if(!potentialMiscalledPitchReposition.repositionXY){
						    	var positionToChange = (potentialMiscalledPitchReposition.repositionX ? 'x' : 'y');

					    		if((finalPitchXY[positionToChange] > potentialMiscalledPitchReposition.repositionLimit) && potentialMiscalledPitchReposition.isGreaterThanLimit){
									finalPitchXY[positionToChange] = __.getRandomDecimalInclusive(potentialMiscalledPitchReposition.zoneLimit, potentialMiscalledPitchReposition.repositionLimit, 5);
								}
								else if((finalPitchXY[positionToChange] < potentialMiscalledPitchReposition.repositionLimit) && !potentialMiscalledPitchReposition.isGreaterThanLimit){
									finalPitchXY[positionToChange] = __.getRandomDecimalInclusive(potentialMiscalledPitchReposition.repositionLimit, potentialMiscalledPitchReposition.zoneLimit, 5);
								}
							}
							//corner locations
							else{
								if((finalPitchXY.x > potentialMiscalledPitchReposition.repositionLimitX) || (finalPitchXY.x < potentialMiscalledPitchReposition.zoneLimitX)){
									finalPitchXY.x = __.getRandomDecimalInclusive(potentialMiscalledPitchReposition.zoneLimitX, potentialMiscalledPitchReposition.repositionLimitX, 5);
								}

								if((finalPitchXY.y < potentialMiscalledPitchReposition.zoneLimitY) || (finalPitchXY.y > potentialMiscalledPitchReposition.repositionLimitY)){
									finalPitchXY.y = __.getRandomDecimalInclusive(potentialMiscalledPitchReposition.zoneLimitY, potentialMiscalledPitchReposition.repositionLimitY, 5);
								}
							}
					    }

					    initialPitchXY = {
					    	x: (finalPitchXY.x + (xMovementMultiplier * __.getRandomDecimalInclusive(pitchMovementRanges.horizontal.min, pitchMovementRanges.horizontal.max, 5))),
					    	//vertical movement is always down so initial y is lower (subtracted)
					    	//TODO: allow rising pitches
					    	y: (finalPitchXY.y - __.getRandomDecimalInclusive(pitchMovementRanges.vertical.min, pitchMovementRanges.vertical.max, 5))
					    }

					    $(pitchThrownBall).css({
					    	left: finalPitchXY.x + 'px',
					    	top: finalPitchXY.y + 'px'
					    });

					    keyframe.appendRule('from {left: ' + initialPitchXY.x + 'px;}');
					    keyframe.appendRule('to {left: ' + finalPitchXY.x + 'px;}');
					    keyframe.appendRule('from {top: ' + initialPitchXY.y + 'px;}');
					    keyframe.appendRule('to {top: ' + finalPitchXY.y + 'px;}');


					    //ANIMATE

						pitchThrownBallElement.style.webkitAnimationName = animationName;
						pitchThrownBallElement.style.animationName = animationName;
						$(pitchThrownBallElement).show();


						//PUT THE PA PITCH NUMBER IN THE BALL

						$timeout(function(___){
							pitchThrownBallElement.innerHTML = ___.scope.plateAppearancePitchNumber;
						}, appConstants.GAME_PLAY.PITCH_ANIMATION_PA_PITCH_NUMBER_TIME, true, {scope: this});
					}
				}

				/**
				 * Opens an info modal for the given player.
				 */
				this.handleShowPlayerInfo = function(team, playerId){
					this.showPlayerInfo(team, playerId);
				}

				/**
				 * Sets the current list of play calls displayed to be for the given inning.
				 */
				this.setCurrentPlayByPlayInning = function(inning){
					this.currentPlayByPlaySelected = inning;
				}

				/**
				 * Clears out the headshot from the current batter element.
				 */
				this.handleCurrentBatterCard = function(){
					$('.current-batter').find('.face').remove();
				}

				/**
				 * Clears out the headshot from the current pitcher element.
				 */
				this.handleCurrentPitcherCard = function(){
					$('.current-pitcher').find('.face').remove();
				}

				/**
				 * Sets up necessary variables and data at the beginning of each play.
				 */
				this.setUpPlay = function(){
					if(this.newBatter){
						this.handleCurrentBatterCard();
						$('.pitch-thrown-ball').remove();
						$('#currentCount').css('color', '#000000');
					}

					if(gamePlayService.hasInningEnded()) this.handleCurrentPitcherCard();
					
					this.inning = gamePlayService.inning();
					this.baseInning = Math.floor(this.inning);
					this.currentInningForDisplay = __.formatInning(this.inning);
					this.currentInningForPlayByPlay = __.formatInning(this.inning, true);
					this.count = ('' + gamePlayService.balls() + '-' + gamePlayService.strikes());
					this.currentOuts = gamePlayService.outs();
					this.currentBases = baseRunningService.getBaseRunnersStatus();
					this.offense = gamePlayService.getOffense();
					this.defense = gamePlayService.getDefense();
					this.batter = gamePlayService.getBatter();
					this.pitcher = gamePlayService.getPitcher();
					
					if(!this.defense.currentPitcherScoreDeficit[this.pitcher.id]) this.defense.currentPitcherScoreDeficit[this.pitcher.id] = 0;

					baseRunningService.resetResults();
					gamePlayService.resetInning();
				}

				/**
				 * Runs a play.
				 */
				this.runPlay = function(){			
					var outsBeforePlay = this.currentOuts;
					var basesStatusBeforePlay = this.currentBases;
					var offenseScoreBeforePlay = this.offense.battingTotals.totalRuns;
					var defenseScoreBeforePlay = this.defense.battingTotals.totalRuns;
					var ballsBeforePlay = gamePlayService.balls();
					var strikesBeforePlay = gamePlayService.strikes();
					var transitionTimeout = 0;
					var stealAttempt = false;
					var sacrificeFly = false;
					var stealAttemptFailedFor3rdOut = false;
					var inningEndPitcherChange = false;
					var pitcherChange = null;
					var thisPlay = {};

					$timeout(function(params){
						var scope = params.scope;

						var pitch = pitchService.generatePitch();
						//console.log(pitch);
						//console.log(pitch.location);
						var stealAttempt = baseRunningService.checkForBaseStealing(pitch.atBatHandedness);
						var battingResults = battingService.handleBatter(pitch, stealAttempt);
						//console.log(battingResults);

						if(battingResults.fouledAway || battingResults.putIntoPlay || battingResults.hitByPitchOrWalk){
							stealAttempt = false;
						}

						var fieldingResults = fieldingService.fieldBall(battingResults);
						//console.log(fieldingResults);
						var baseRunningResults = baseRunningService.getResults();
						//console.log(baseRunningResults);
						//console.log(gamePlayService.balls() + '-' + gamePlayService.strikes());
						var inningEnded = gamePlayService.hasInningEnded();

						if(inningEnded) stealAttempt = false;

						//TO DO: THERE ISN'T ALWAYS A THROW ON STEAL->NO CREDIT FOR STEAL IF NOT (DEFENSIVE INDIFF)
						if(stealAttempt){
							baseRunningResults.stealAttempt = true;
							baseRunningResults.stealResults = [];
							baseRunningService.handleStealAttempt(scope.pitcher.handedness);

							//inning can end on steal attempt failure so refresh variable
							inningEnded = gamePlayService.hasInningEnded();
							stealAttemptFailedFor3rdOut = inningEnded;
						}




						//*****STATS*****

						//TO DO: NO PITCH IF PICKOFF ATTEMPT
						//PITCH COUNT
						scope.pitcher.pitches++;

						//FIELDER'S CHOICE
						var fieldersChoice = __.checkForFieldersChoice(fieldingResults);
						fieldingResults.fieldersChoice = fieldersChoice;

						//RBIs
						var currentOffenseScore = scope.offense.battingTotals.totalRuns;

						if(__.validRBI(scope.batter, battingResults, fieldingResults, baseRunningResults, currentOffenseScore, offenseScoreBeforePlay)){
							var runsBattedIn = (currentOffenseScore - offenseScoreBeforePlay);
							gamePlayService.handleRBI(scope.batter, runsBattedIn, (outsBeforePlay === 2));

							//SAC FLYs
							if(fieldingResults.ballCaught && (outsBeforePlay < 2)){
								sacrificeFly = true;
								gamePlayService.handleSacFlysBunts(scope.batter, appConstants.FLY_OUT_INDICATOR);
							}
						}

						//GROUNDOUTS (FLYOUTS HANDLED IN FIELDING SERVICE)
						if(baseRunningResults.playersThrownOut && (battingResults.battedBallType === battingConstants.BATTED_BALL_TYPES.GROUND_BALL) && __.batterThrownOutAt1st(scope.batter, baseRunningResults.playersThrownOut)){
							gamePlayService.handleGroundOutsFlyOuts(appConstants.GROUND_OUT_INDICATOR);
						}

						//BATTERS FACED
						if(scope.newBatter === undefined || scope.newBatter){
							scope.plateAppearancePitchNumber = 1;	
							scope.pitcher.battersFaced++;
						}
						else{
							scope.plateAppearancePitchNumber++;
						}

						//TOTAL STRIKES
						if(battingResults.contactMade || (battingResults.umpireCallOnNonSwing === appConstants.STRIKE) || (battingResults.swung && (battingResults.contactMade === false))){
							//FIRST PITCH STRIKES
							if(!ballsBeforePlay && !strikesBeforePlay) gamePlayService.handleFirstPitchStrikes();

							gamePlayService.handleTotalStrikes(battingResults);
						}

						var currentBaseRunners = baseRunningService.getBaseRunners();
						var nextBatter = gamePlayService.getBatter();

						//HITS
						if(battingResults.putIntoPlay && !fieldingResults.ballCaught){
							gamePlayService.handleHit({
								batter : scope.batter, 
								baseRunners : currentBaseRunners, 
								playersThrownOut : baseRunningResults.playersThrownOut, 
								fieldersChoice : fieldersChoice, 
								baseBatterAdvancedTo : fieldingResults.baseBatterAdvancedTo, 
								runnersOnBeforePlay : basesStatusBeforePlay.code,
								inTheParkHR : baseRunningResults.inTheParkHR,
								errorOnPlay: fieldingResults.errorOnPlay
							});
						}

						//AT BATS/PAs
						if((scope.batter.id !== nextBatter.id) || stealAttemptFailedFor3rdOut){
							if(!stealAttemptFailedFor3rdOut){
								gamePlayService.handlePlateAppearance(scope.batter, __.validAtBat(battingResults, fieldingResults, sacrificeFly), basesStatusBeforePlay.code);
							}

							gamePlayService.checkForPitcherChange(scope.inning);
							scope.newBatter = true;
						}
						else{
							scope.newBatter = false;
						}

						//LOB
						if(outsBeforePlay !== gamePlayService.outs()){
							var baseRunnersStatus = baseRunningService.getBaseRunnersStatus();
							var basesOccupied = baseRunnersStatus.code;
							var runnersCurrentlyOn = currentBaseRunners.length;
							var leftRISPwithTwoOut = (__.RISP(basesOccupied) && (outsBeforePlay === 2));

							gamePlayService.handleLOB(scope.batter, runnersCurrentlyOn, leftRISPwithTwoOut);	
						}
						else if(battingResults.homeRun){
							baseRunningService.clearBases();
						}

						//GIDP
						if(__.GIDP(battingResults, baseRunningResults)) gamePlayService.handleGIDP(scope.batter);
						
						//*****END STATS*****




						pitcherChange = gamePlayService.getPitcherChange();
						inningEndPitcherChange = (pitcherChange && pitcherChange.changeOnInningEnd);

						if(inningEnded){
							scope.fullInningEnded = ((gamePlayService.inning() % 1) === 0);
							scope.gameIsOver = gamePlayService.gameIsOver();
						}

						scope.count = (gamePlayService.balls() + '-' + gamePlayService.strikes());
						scope.animatePitch(pitch, battingResults);

						//delay refresh of info until a bit after pitch animation
						$timeout(function(){				
							scope.playByPlay = playByPlayService.generatePlayByPlay({
								inning: scope.currentInningForPlayByPlay,
								balls: ballsBeforePlay,
								strikes: strikesBeforePlay,
								bases: basesStatusBeforePlay,
								outs: outsBeforePlay,
								offense: scope.offense,
								defense: scope.defense,
								offenseScoreBeforePlay: offenseScoreBeforePlay,
								defenseScoreBeforePlay: defenseScoreBeforePlay,
								runnersOnBeforePlay: basesStatusBeforePlay.runnersOn,
								pitcher: scope.pitcher,
								batter: scope.batter,
								pitch: pitch,
								battingResults: battingResults,
								fieldingResults: fieldingResults,
								baseRunningResults: baseRunningResults,
								pitcherChange: ((inningEndPitcherChange && inningEnded) || (!inningEndPitcherChange && pitcherChange) ? pitcherChange : null)
							});

							thisPlay = _.head(scope.playByPlay[scope.currentInningForPlayByPlay]);
							thisPlay.scoringPlay = (battingResults.homeRun || baseRunningResults.playersWhoScored);

							scope.currentOuts = (inningEnded && (outsBeforePlay && (gamePlayService.outs() === 0)) ? 3 : gamePlayService.outs());
							scope.currentBases = baseRunningService.getBaseRunnersStatus();

							//console.log(scope.currentBases);

							if(scope.newBatter) scope.batter.gameStatLine = __.generatePlayerGameStatLine(scope.batter);
						}, appConstants.GAME_PLAY.PAUSE_FOR_PLAY_BY_PLAY);

						scope.pitchThrown = (pitch.pitchVelocity + ' mph ' + pitchConstants.PITCH_TYPES_FOR_DISPLAY[pitch.pitchSubType ? pitch.pitchSubType : pitch.pitchType]);
						scope.animatePitchResultingCount();	

						scope.gamePlayElement.style.webkitAnimation = 'none';
						scope.gamePlayElement.style.animation = 'none';

						scope.winningTeam = _.maxBy(scope.gameTeams, function(team){
							return team.battingTotals.totalRuns;
						});

						//console.log('inning: ' + scope.currentInningForDisplay);

						//INNING (HALF) END
						if(inningEnded){
							transitionTimeout = (appConstants.GAME_PLAY.PAUSE_ON_INNING_PA_END + appConstants.GAME_PLAY.INNING_END_TRANSITION_TIME);

							$timeout(function(){
								
								scope.playByPlay = playByPlayService.generatePlayByPlay({
									inning: scope.currentInningForPlayByPlay,
									inningEnded: true,
									fullInningEnded: scope.fullInningEnded,
									gameOver: scope.gameIsOver,
									winningTeam: scope.winningTeam
								});

								scope.gamePlayElement.style.webkitAnimation = 'in-game-transition ' + appConstants.GAME_PLAY.INNING_END_TRANSITION_TIME + 'ms ease-in';
								scope.gamePlayElement.style.animation = 'in-game-transition ' + appConstants.GAME_PLAY.INNING_END_TRANSITION_TIME + 'ms ease-in';

								//refresh view when opacity is 0 (after INNING_END_TRANSITION_TIME)
								$timeout(function(){
									if(baseRunningResults.clearBases) baseRunningService.clearBases();

									if(scope.gameIsOver){
										scope.showTeamStatsModal();
									}
									else{
										if(inningEndPitcherChange){
											gamePlayService.handlePitcherChange();
											scope.handleCurrentPitcherCard();
										}

										gamePlayService.setField(scope.defense, scope.offense);
										scope.setUpPlay();
									}

									//show inning begin call for next inning
									if(!scope.gameIsOver && scope.fullInningEnded){
										var currentPlayByPlayDisplay = __.formatInning(gamePlayService.inning(), true);

										scope.playByPlay = playByPlayService.generatePlayByPlay({
											inning: currentPlayByPlayDisplay,
											inningEnded: true,
											fullInningEnded: true,
											startOfInning: true
										});

										//switch the play by play view to the next inning
										scope.currentPlayByPlaySelected = currentPlayByPlayDisplay;
									}
								}, (appConstants.GAME_PLAY.INNING_END_TRANSITION_TIME / 2));

							}, appConstants.GAME_PLAY.PAUSE_ON_INNING_PA_END);
						}
						//PA END
						else if(scope.newBatter){
							transitionTimeout = (appConstants.GAME_PLAY.PAUSE_ON_INNING_PA_END + appConstants.GAME_PLAY.SHORT_TRANSITION_TIME);

							$timeout(function(){
								scope.gamePlayElement.style.webkitAnimation = 'in-game-transition ' + appConstants.GAME_PLAY.SHORT_TRANSITION_TIME + 'ms ease-in';
								scope.gamePlayElement.style.animation = 'in-game-transition ' + appConstants.GAME_PLAY.SHORT_TRANSITION_TIME + 'ms ease-in';

								//refresh view when opacity is 0 (after SHORT_TRANSITION_TIME)
								$timeout(function(){
									if(pitcherChange && !inningEndPitcherChange){
										gamePlayService.handlePitcherChange();
										scope.handleCurrentPitcherCard();
									}

									scope.setUpPlay();
								}, (appConstants.GAME_PLAY.SHORT_TRANSITION_TIME / 2));

							}, appConstants.GAME_PLAY.PAUSE_ON_INNING_PA_END);	
						}

						if(!scope.gameIsOver){
							$timeout(function(){
								//set up play from here if neither inning nor PA ended
								if(!transitionTimeout) scope.setUpPlay();

								scope.runPlay();
							}, transitionTimeout);
						}

					}, appConstants.GAME_PLAY.PAUSE_BETWEEN_PLAYS, true, {scope: this});
				}

				/**
				 * Fades gameplay page in, sets offense and defense and sets other things up for a new game starting.
				 */		
				this.initializeGame = function(){
					var beginGameAnimation = 'begin-game ' + appConstants.GAME_PLAY.SHORT_TRANSITION_TIME + 'ms linear forwards';
					this.gamePlayElement = document.getElementById('gamePlay');
					this.gamePlayElement.style.webkitAnimation = beginGameAnimation;
					this.gamePlayElement.style.animation = beginGameAnimation;

					gamePlayService.setField(this.gameTeams[0], this.gameTeams[1], true);
					this.setUpPlay();

					this.handleCurrentPitcherCard();
					this.handleCurrentBatterCard();
					
					this.plateAppearancePitchNumber = 1;
					this.newBatter = undefined;
					this.playByPlay = {};
					this.currentPlayByPlaySelected = this.currentInningForPlayByPlay;
				}

				/**
				 * Handles user closing the game by clearing out this component's data.
				 */
				this.endGame = function(){
					this.handleCurrentPitcherCard();
					this.handleCurrentBatterCard();
					this.playByPlay = {};
					this.gameTeams = [];
					this.pitcher = {};
					this.batter = {};
					this.winningTeam = {};
					this.gameIsOver = false;
					this.gameInProgress = false;
				}

				/**
				 * Initializes game (triggered on startGame being set to true) and throws the first pitch.
				 */
				this.$onChanges = function(){
					if(this.gameInProgress){
						teamsService.setUpTeamStats(this.gameTeams);

						var boxScore = teamsService.setUpBoxScore(this.gameTeams);
						this.playerBattingCategories = boxScore.playerBattingCategories;
						this.teamBattingCategories = boxScore.teamBattingCategories;
						this.pitchingCategories = boxScore.pitchingCategories;
						this.pitcherGameStats = boxScore.pitcherGameStats;
						this.teamPitchingCategories = boxScore.teamPitchingCategories;

						this.initializeGame();
						this.runPlay();
					}
				}
			}]
	});
}