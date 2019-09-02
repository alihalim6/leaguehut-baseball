module.exports = function(module){
	module.component('gamePlay', {
		template: require('../views/gamePlay.html'),
		controller: gamePlayCtrl,
		bindings: {
			startGame: '<',
			gameInProgress: '=',
			gameTeams: '=',
			showPlayerInfo: '=',
			closePlayerInfoModal: '=',
			determineBarDisplay: '=',
			playerInfo: '='
		}
	});

	function gamePlayCtrl(appUtility, gamePlayService, appConstants, pitchConstants, battingConstants, pitchService, battingService, fieldingService, baseRunningService, playByPlayService, $timeout, $compile){
		var __ = appUtility;

		this.setUpTeamStats = function(){
			_.each(this.gameTeams, function(team){
				team.atBatIndex = 0;
                team.pitchersBroughtIn = 0;
                team.currentPitcherScoreDeficit = {};

				team.inningScores = {
					'1' : 0,
					'2' : 0,
					'3' : 0,
					'4' : 0,
					'5' : 0,
					'6' : 0,
					'7' : 0,
					'8' : 0,
					'9' : 0
				};

				//these totals sit underneath player box score stats
				team.battingTotals = {
					totals : 'TEAM TOTALS',
					totalABs : 0,
					totalRuns : 0,
					totalHits : 0,
					totalBases : ' ',
					totalRbis : ' ',
					totalHRs : 0,
					totalWalks : 0,
					totalStrikeOuts : 0,
					totalLob : 0
				},

				team.totalErrors = 0

				team.batting = {
					doubles : [],
					triples : [],
					twoOutRbis : [],
					leftRISPwithTwoOut : [],
					sacFlys : [],
					sacBunts : [],
					GIDP : [],
					HR : [],
					SB : [],
					CS : [],
					hitsWithRISP : 0,
					atBatsWithRISP : 0
				}
			});
		}

		this.setUpBoxScore = function(){
			var teamIndex = 0;
			this.playerBattingCategories = [' ', 'AB', 'R', 'H', 'TB', 'RBI', 'HR', 'BB', 'SO', 'LOB', 'E'];
			this.teamBattingCategories = [
				{
					label: 'DOUBLES',
					id: appConstants.STATS_DISPLAY.DOUBLES
				},
				{
					label: 'TRIPLES',
					id: appConstants.STATS_DISPLAY.TRIPLES
				},
				{
					label: 'HOMERUNS',
					id: appConstants.STATS_DISPLAY.HOMERUNS
				},
				{
					label: '2-OUT RBIs',
					id: appConstants.STATS_DISPLAY.TWO_OUT_RBIS
				},
				{
					label: 'LEFT RISP w/ 2 OUTS',
					id: appConstants.STATS_DISPLAY.LEFT_RISP_WITH_TWO_OUTS
				},
				{
					label: 'TEAM W/ RISP',
					id: appConstants.STATS_DISPLAY.HITTING_WITH_RISP,
					displayDirectValue: true
				},
				{
					label: 'SAC FLYS',
					id: appConstants.STATS_DISPLAY.SAC_FLYS
				},
				{
					label: 'GIDP',
					id: appConstants.STATS_DISPLAY.GIDP
				},
				{
					label: 'STOLEN BASES',
					id: appConstants.STATS_DISPLAY.STOLEN_BASES
				},
				{
					label: 'CAUGHT STEALING',
					id: appConstants.STATS_DISPLAY.CAUGHT_STEALING
				}
			];
			this.pitchingCategories = [' ', 'IP', 'H', 'R', 'BB', 'K', 'PITCHES'];
			this.pitcherGameStats = [
				{
					label: 'IP',
					id: appConstants.STATS_DISPLAY.INNINGS_PITCHED
				},
				{
					label: 'H',
					id: appConstants.STATS_DISPLAY.HITS_ALLOWED
				},
				{
					label: 'R',
					id: appConstants.STATS_DISPLAY.RUNS_ALLOWED
				},
				{
					label: 'BB',
					id: appConstants.STATS_DISPLAY.BATTERS_WALKED
				},
				{
					label: 'K',
					id: appConstants.STATS_DISPLAY.BATTERS_STRUCK_OUT
				},
				{
					label: 'PITCHES',
					id: appConstants.STATS_DISPLAY.PITCHES
				}
			];

			this.teamPitchingCategories = [
				{
					label: 'PITCHES',
					id: appConstants.STATS_DISPLAY.PITCHES
				},
				{
					label: 'TOTAL STRIKES',
					id: appConstants.STATS_DISPLAY.TOTAL_STRIKES
				},
				{
					label: 'CALLED',
					id: appConstants.STATS_DISPLAY.CALLED_STRIKES,
					subStat: true
				},
				{
					label: 'SWINGING',
					id: appConstants.STATS_DISPLAY.SWINGING_STRIKES,
					subStat: true
				},
				{
					label: 'FOUL',
					id: appConstants.STATS_DISPLAY.FOUL_STRIKES,
					subStat: true
				},
				{
					label: 'IN PLAY',
					id: appConstants.STATS_DISPLAY.BALLS_PUT_INTO_PLAY,
					subStat: true
				},
				{
					label: 'GROUNDOUTS',
					id: appConstants.STATS_DISPLAY.GROUNDOUTS
				},
				{
					label: 'FLYOUTS',
					id: appConstants.STATS_DISPLAY.FLYOUTS
				},
				{
					label: 'BATTERS FACED',
					id: appConstants.STATS_DISPLAY.BATTERS_FACED
				},
				{
					label: 'FIRST PITCH STRIKES',
					id: appConstants.STATS_DISPLAY.FIRST_PITCH_STRIKES
				}
			];

			_.each(this.gameTeams, function(team, index){
				teamIndex = index;

				_.each(team.players, function(player){
					player.plateAppearances = 0;
					player.atBats = 0;
					player.hits = 0;
					player.errors = 0;
					player.totalBases = 0;
					player.rbis = 0;
					player.runs = 0;
					player.walks = 0;
					player.strikeOuts = 0;
					player.lob = 0;
					player.singles = 0;
					player.doubles = 0;
					player.triples = 0;
					player.twoOutRbis = 0;
					player.leftRISPwithTwoOut = 0;
					player.sacFlys = 0;
					player.sacBunts = 0;
					player.GIDP = 0;
					player.HR = 0;
					player.SB = 0;
					player.CS = 0;
					player.hitByPitch = 0;

					player.statDisplay = {};

					if(player.position === appConstants.GAME_PLAY.POSITIONS.PITCHER){
						player.pitches = 0;
						player.inningsPitched = 0.0;
						player.hitsAllowed = 0;
						player.runsAllowed = 0;
						player.battersWalked = 0;
						player.battersStruckOut = 0;
						player.battersHitByPitch = 0;
						player.homeRunsAllowed = 0;
						player.groundOuts = 0;
						player.flyOuts = 0;
						player.battersFaced = 0;
						player.totalStrikes = 0;
						player.firstPitchStrikes = 0;
						player.calledStrikes = 0;
						player.swingingStrikes = 0;
						player.foulBalls = 0;
						player.ballsPutIntoPlay = 0;

						//TODO: allow these to by tallied in extra innings

						player.walksAllowedByInning = {
							'1' : 0,
							'2' : 0,
							'3' : 0,
							'4' : 0,
							'5' : 0,
							'6' : 0,
							'7' : 0,
							'8' : 0,
							'9' : 0
						};

						player.homeRunsAllowedByInning = {
							'1' : 0,
							'2' : 0,
							'3' : 0,
							'4' : 0,
							'5' : 0,
							'6' : 0,
							'7' : 0,
							'8' : 0,
							'9' : 0
						};

						player.hitsAllowedByInning = {
							'1' : 0,
							'2' : 0,
							'3' : 0,
							'4' : 0,
							'5' : 0,
							'6' : 0,
							'7' : 0,
							'8' : 0,
							'9' : 0
						};

						player.runsAllowedByInning = {
							'1' : 0,
							'2' : 0,
							'3' : 0,
							'4' : 0,
							'5' : 0,
							'6' : 0,
							'7' : 0,
							'8' : 0,
							'9' : 0
						};

						var pitcherChangeEvaluation = function(params){
							var justPitched = (params.defense.id === this.teamId);
							var makeChange = false;
							var badPerformance = false;
							var currentInning = Math.floor(params.inning);
							var twoInningsAgo = ((params.inning >= 3) ? (currentInning - 2) : 0);
							var oneInningAgo = ((params.inning >= 2) ? (currentInning - 1) : 0);

							var walksStrikeoutsDelta = (this.battersWalked - this.battersStruckOut);
							var homeRunsAllowedDelta = (this.homeRunsAllowedByInning[currentInning] * pitchConstants.PERFORMANCE_WEIGHT.HR);
							var hitsAllowedDelta = (this.hitsAllowedByInning[currentInning] * pitchConstants.PERFORMANCE_WEIGHT.HITS);
							var walksAllowedDelta = (this.walksAllowedByInning[currentInning] * pitchConstants.PERFORMANCE_WEIGHT.WALKS);
							var runsAllowedCurrentInningDelta = (this.runsAllowedByInning[currentInning] * pitchConstants.PERFORMANCE_WEIGHT.RUNS_CURRENT_INNING);
							var deficitDelta = (params.defense.currentPitcherScoreDeficit[this.id] * pitchConstants.PERFORMANCE_WEIGHT.DEFICIT);
							var runsAllowedPreviousInningsDelta = 0;

							if(twoInningsAgo) runsAllowedPreviousInningsDelta += (this.runsAllowedByInning[twoInningsAgo] * pitchConstants.PERFORMANCE_WEIGHT.RUNS_PREV_INNINGS);
							if(oneInningAgo) runsAllowedPreviousInningsDelta += (this.runsAllowedByInning[oneInningAgo] * pitchConstants.PERFORMANCE_WEIGHT.RUNS_PREV_INNINGS);

							console.log('P performance: ' + (walksStrikeoutsDelta + homeRunsAllowedDelta + hitsAllowedDelta + walksAllowedDelta + runsAllowedCurrentInningDelta + deficitDelta + runsAllowedPreviousInningsDelta));

							badPerformance = (__.getRandomIntInclusive(pitchConstants.BAD_PERFORMANCE_MIN, pitchConstants.BAD_PERFORMANCE_MAX) <= 
								(walksStrikeoutsDelta + homeRunsAllowedDelta + hitsAllowedDelta + walksAllowedDelta + runsAllowedCurrentInningDelta + deficitDelta + runsAllowedPreviousInningsDelta));

							//take pitcher out if on inning end, he is (at or) above pitch count for game
							//OR we've reached at least the end of the 8th or 9th
							//OR he is not performing well
							makeChange = ((params.inningEnded && justPitched && ((this.pitchCount && (this.pitches >= this.pitchCount)) || ((params.inning >= 8) && (params.inning < 10)))) || badPerformance);

							return {
								makeChange: makeChange,
								changeOnInningEnd: (params.inningEnded || (!params.inningEnded && makeChange && (params.currentOuts === 2))),
								dueToBadPerformance: badPerformance
							};
						};

						if(player.depthPosition === 1){
							player.active = true;
							player.inactive = false;
							player.isStartingPitcher = true;
							player.pitchCount = __.determinePitchCountForGame(player.basePitchCount);
							player.pitcherTypeToFollow = appConstants.GAME_PLAY.POSITIONS.MR;
							player.takePitcherOut = pitcherChangeEvaluation;

							team.startingPitcher = player;
						}
						else{
							if(player.depthPosition === 2){
								player.isMiddleReliever = true;

								//change to closer
								/*player.takePitcherOut = function(params){
									var justPitched = (defense.id === this.teamId);
									var laterInningsMin = 7;
									var laterInningsMax = 8.5;
									var bool1 = chance.bool();
									var bool2 = chance.bool();
									var makeChange = (bool1 && bool2);

									//take MR out if manager decided to take this pitcher out after he just pitched one of the later innings
									//OR he just pitched the 8th
									return (params.inningEnded && (((params.inning >= laterInningsMin) && (params.inning < laterInningsMax) && makeChange) || (params.inning >= laterInningsMax)) && justPitched);
								};*/
								player.takePitcherOut = pitcherChangeEvaluation;

								team.middleReliever = player;
							}

							if(player.depthPosition === 3){
								player.isCloser = true;
								player.takePitcherOut = function(){
									return {makeChange: false};
								};

								team.closer = player;
							}

							player.active = false;
							player.inactive = true;
						}
					}

					player.x = appConstants.GAME_PLAY.POSITION_PROFILE[player.position].x;
					player.y = appConstants.GAME_PLAY.POSITION_PROFILE[player.position].y;
					player.infield = appConstants.GAME_PLAY.POSITION_PROFILE[player.position].infield;
					player.fieldSide = appConstants.GAME_PLAY.POSITION_PROFILE[player.position].fieldSide;
				});
			});

		}

		this.showTeamStatsModal = function(){
			$('#teamStatsModal').show();
		}

		this.closeTeamStatsModal = function(){
			$('#teamStatsModal').hide();
		}

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

			var potentialMiscalledBallReposition = _.find(pitchConstants.MISCALLED_BALL_REPOSITION, function(config){
				return _.includes(config.locations, locationKey);
			});


			//SET KEYFRAME

			//HBP
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
			    for(var i = 0; i < keyframeRules.length; i++){
			    	keyframe.deleteRule('0%');
			    	keyframe.deleteRule('100%');
				}

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

			    //REPOSITION MISCALLED BALL IF WOULD DISPLAY TOO FAR IN ZONE
			    if((battingResults.umpireCallOnNonSwing === appConstants.BALL) && potentialMiscalledBallReposition){
			    	var positionToChange = (potentialMiscalledBallReposition.repositionX ? 'x' : 'y');

			    	//left/top of zone
		    		if((finalPitchXY[positionToChange] >= potentialMiscalledBallReposition.repositionLimit) && potentialMiscalledBallReposition.isGreaterThanLimit){
						finalPitchXY[positionToChange] = __.getRandomDecimalInclusive(potentialMiscalledBallReposition.zoneLimit, potentialMiscalledBallReposition.repositionLimit, 5);
					}
					//bottom/right of zone
					else if((finalPitchXY[positionToChange] <= potentialMiscalledBallReposition.repositionLimit) && !potentialMiscalledBallReposition.isGreaterThanLimit){
						finalPitchXY[positionToChange] = __.getRandomDecimalInclusive(potentialMiscalledBallReposition.repositionLimit, potentialMiscalledBallReposition.zoneLimit, 5);
					}
			    }

			    initialPitchXY = {
			    	x: (finalPitchXY.x + (xMovementMultiplier * __.getRandomDecimalInclusive(pitchMovementRanges.horizontal.min, pitchMovementRanges.horizontal.max, 5))),
			    	//vertical movement is always down so initial y is lower (subtracted)
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

		this.handleShowPlayerInfo = function(team, playerId){
			this.showPlayerInfo(team, playerId);
		}

		this.setCurrentPlayByPlayInning = function(inning){
			this.currentPlayByPlaySelected = inning;
		}

		this.handleCurrentBatterCard = function(){
			$('.current-batter').find('.face').remove();
		}

		this.handleCurrentPitcherCard = function(){
			$('.current-pitcher').find('.face').remove();
		}

		this.setUpPlay = function(){
			if(this.newBatter){
				this.handleCurrentBatterCard();
				$('.pitch-thrown-ball').remove();
				$('#currentCount').css('color', '#000000');
			}

			if(gamePlayService.hasInningEnded()) this.handleCurrentPitcherCard();
			
			this.inning = gamePlayService.inning();
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
			gamePlayService.setInningEnded(false);
		}

		this.runPlay = function(){			
			var outsBeforePlay = this.currentOuts;
			var basesStatusBeforePlay = this.currentBases;
			var stealAttempt = false;
			var sacrificeFly = false;
			var stealAttemptFailedFor3rdOut = false;
			var offenseScoreBeforePlay = this.offense.battingTotals.totalRuns;
			var defenseScoreBeforePlay = this.defense.battingTotals.totalRuns;
			var ballsBeforePlay = gamePlayService.balls();
			var strikesBeforePlay = gamePlayService.strikes();
			var transitionTimeout = 0;
			var pitcherChange = null;
			var inningEndPitcherChange = false;

			$timeout(function(params){
				var scope = params.scope;

				var pitch = pitchService.generatePitch();
				console.log(pitch);
				console.log(pitch.location);

				var stealAttempt = baseRunningService.checkForBaseStealing(pitch.atBatHandedness);

				var battingResults = battingService.handleBatter(pitch);
				console.log(battingResults);

				if(battingResults.fouledAway || battingResults.putIntoPlay || battingResults.hitByPitchOrWalk){
					stealAttempt = false;
				}

				var fieldingResults = fieldingService.fieldBall(battingResults);
				console.log(fieldingResults);

				var baseRunningResults = baseRunningService.getResults();
				console.log(baseRunningResults);

				console.log(gamePlayService.balls() + '-' + gamePlayService.strikes());

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
				if(baseRunningResults.playersThrownOut && (baseRunningResults.playersThrownOut.length > 0) 
					&& (battingResults.battedBallType === battingConstants.BATTED_BALL_TYPES.GROUND_BALL) && __.batterThrownOutAt1st(scope.batter, baseRunningResults.playersThrownOut)){
					gamePlayService.handleGroundOutsFlyOuts(appConstants.GROUND_OUT_INDICATOR);
				}

				if(scope.newBatter === undefined || scope.newBatter){
					scope.plateAppearancePitchNumber = 1;

					//BATTERS FACED
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

				//HITS
				if(battingResults.putIntoPlay && !fieldingResults.ballCaught){
					gamePlayService.handleHit({
						batter : scope.batter, 
						baseRunners : currentBaseRunners, 
						playersThrownOut : baseRunningResults.playersThrownOut, 
						fieldersChoice : fieldersChoice, 
						baseBatterAdvancedTo : fieldingResults.baseBatterAdvancedTo, 
						runnersOnBeforePlay : basesStatusBeforePlay.code,
						inTheParkHR : baseRunningResults.inTheParkHR
					});
				}

				var nextBatter = gamePlayService.getBatter();

				if((scope.batter.id !== nextBatter.id) || stealAttemptFailedFor3rdOut){
					//AT BATS/PAs
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
					//couldn't use code for runnersCurrentlyOn for scenario when runner who went home 
					//is set back a base on inning end (see updateBaseRunners);
					//when this happens, and a diff runner went to 3rd, the details.code sees 1 runner on 3rd even
					//though there are 2, after setting the former runner back a base
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

					scope.currentOuts = (inningEnded && (outsBeforePlay && (gamePlayService.outs() === 0)) ? 3 : gamePlayService.outs());
					scope.currentBases = baseRunningService.getBaseRunnersStatus();

					console.log(scope.currentBases);

					if(scope.newBatter) scope.batter.gameStatLine = __.generatePlayerGameStatLine(scope.batter);
				}, appConstants.GAME_PLAY.PAUSE_FOR_PLAY_BY_PLAY);

				scope.pitchThrown = (pitch.pitchVelocity + ' mph ' + pitchConstants.PITCH_TYPES_FOR_DISPLAY[pitch.pitchSubType ? pitch.pitchSubType : pitch.pitchType]);
				scope.animatePitchResultingCount();	

				scope.gamePlayElement.style.webkitAnimation = 'none';
				scope.gamePlayElement.style.animation = 'none';

				//INNING (HALF) END
				if(inningEnded){
					transitionTimeout = (appConstants.GAME_PLAY.PAUSE_ON_INNING_PA_END + appConstants.GAME_PLAY.INNING_END_TRANSITION_TIME);

					if(inningEndPitcherChange) gamePlayService.handlePitcherChange();

					$timeout(function(){
						gamePlayService.setField(scope.defense, scope.offense);

						scope.playByPlay = playByPlayService.generatePlayByPlay({
							inning: scope.currentInningForPlayByPlay,
							inningEnded: true,
							fullInningEnded: scope.fullInningEnded,
							gameOver: scope.gameIsOver,
							winningTeam: _.maxBy(scope.gameTeams, function(team){
								return team.battingTotals.totalRuns;
							})
						});

						scope.gamePlayElement.style.webkitAnimation = 'in-game-transition ' + appConstants.GAME_PLAY.INNING_END_TRANSITION_TIME + 'ms ease-in';
						scope.gamePlayElement.style.animation = 'in-game-transition ' + appConstants.GAME_PLAY.INNING_END_TRANSITION_TIME + 'ms ease-in';

						//refresh view when opacity is 0
						$timeout(function(){
							if(baseRunningResults.clearBases) baseRunningService.clearBases();

							if(scope.gameIsOver){
								scope.showTeamStatsModal();
							}
							else{
								if(inningEndPitcherChange) scope.handleCurrentPitcherCard();
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

					if(pitcherChange && !inningEndPitcherChange){
						gamePlayService.handlePitcherChange();
					}

					$timeout(function(){
						scope.gamePlayElement.style.webkitAnimation = 'in-game-transition ' + appConstants.GAME_PLAY.SHORT_TRANSITION_TIME + 'ms ease-in';
						scope.gamePlayElement.style.animation = 'in-game-transition ' + appConstants.GAME_PLAY.SHORT_TRANSITION_TIME + 'ms ease-in';

						//refresh view when opacity is 0
						$timeout(function(){
							if(pitcherChange && !inningEndPitcherChange) scope.handleCurrentPitcherCard();

							scope.setUpPlay();
						}, (appConstants.GAME_PLAY.SHORT_TRANSITION_TIME / 2));

					}, appConstants.GAME_PLAY.PAUSE_ON_INNING_PA_END);	
				}

				if(!scope.gameIsOver){
					$timeout(function(){
						if(!transitionTimeout) scope.setUpPlay();

						scope.runPlay();
					}, transitionTimeout);
				}

			}, appConstants.GAME_PLAY.PAUSE_BETWEEN_PLAYS, true, {scope: this});
		}

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

		this.endGame = function(){
			this.handleCurrentPitcherCard();
			this.handleCurrentBatterCard();
			this.playByPlay = {};
			this.gameTeams = [];
			this.pitcher = {};
			this.batter = {};
			this.gameIsOver = false;
			this.gameInProgress = false;
		}

		/*
		 * Initialize game (triggered on startGame being set to true).
		 */
		this.$onChanges = function(){
			if(this.gameInProgress){
				this.setUpTeamStats();
				this.setUpBoxScore();
				this.initializeGame();
				this.runPlay();
			}
		}
	}
}