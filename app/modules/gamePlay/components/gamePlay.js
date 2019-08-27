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
					label: 'FOULED',
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
					player.pitches = 0;

					player.inningsPitched = 0.0;
					player.hitsAllowed = 0;
					player.runsAllowed = 0;
					player.battersWalked = 0;
					player.battersStruckOut = 0;
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

					player.statDisplay = {};

					if(player.position === appConstants.GAME_PLAY.POSITIONS.PITCHER){
						if(player.depthPosition === 1){
							player.active = true;
							player.isStartingPitcher = true;
							player.pitchCount = __.determinePitchCountForGame(player.basePitchCount);
							player.pitcherTypeToFollow = appConstants.GAME_PLAY.POSITIONS.MR;

							player.takePitcherOut = function(inning, defense){
								var justPitched = (defense.id === this.teamId);

								//take starter out if on inning end, he is (at or) above pitch count for game
								//OR we've reached at least the bottom of the 8th
								return ((this.pitches >= this.pitchCount) || (((inning === 8.5) || (inning === 9)) && justPitched));
							}

							team.startingPitcher = player;
						}
						else{
							if(player.depthPosition === 2){
								player.isMiddleReliever = true;

								//change to closer
								player.takePitcherOut = function(inning, defense){
									var justPitched = (defense.id === this.teamId);

									//if this pitcher just pitched 8th inning, take him out for closer
									return (((inning === 8.5) || (inning === 9)) && justPitched);
								};

								team.middleReliever = player;
							}

							if(player.depthPosition === 3){
								player.isCloser = true;
								player.takePitcherOut = false;

								team.closer = player;
							}

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

			$timeout(function(params){
				//don't show count when PA ends
				if(params.newBatter) $('#currentCount').css('color', '#ffffff');
				
				$('#currentCount').show();
				$('#pitchThrown').hide();
			}, appConstants.GAME_PLAY.PITCH_RESULTING_COUNT_ANIMATION_TIME, true, {newBatter: this.newBatter, count: this.count});
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

				$timeout(function(params){
					pitchThrownBallElement.innerHTML = params.pitchNumber;
				}, appConstants.GAME_PLAY.PITCH_ANIMATION_PA_PITCH_NUMBER_TIME, true, {pitchNumber: this.plateAppearancePitchNumber});
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

			if(gamePlayService.hasInningEnded()){
				this.handleCurrentPitcherCard();
				
				//bottom half of inning ended
				if((this.inning % 1) > 0) this.fullInningEnded = true;
			}

			this.inning = gamePlayService.inning();
			this.currentInningForDisplay = __.formatInning(this.inning);
			this.currentInningForPlayByPlay = __.formatInning(this.inning, true);
			this.count = ('' + gamePlayService.balls() + '-' + gamePlayService.strikes());
			this.currentOuts = gamePlayService.outs();
			this.currentBases = baseRunningService.getBaseRunnersStatus();
			baseRunningService.resetResults();
			gamePlayService.setInningEnded(false);
		}

		this.initializeGame = function(){
			this.setUpPlay();
			gamePlayService.setField(this.gameTeams[0], this.gameTeams[1], true);
			this.handleCurrentPitcherCard();
			this.handleCurrentBatterCard();
			this.currentPlayByPlaySelected = this.currentInningForPlayByPlay;
			this.plateAppearancePitchNumber = 1;
			this.newBatter = undefined;
		}

		this.runPlay = function(){
			this.offense = gamePlayService.getOffense();
			this.defense = gamePlayService.getDefense();
			this.batter = gamePlayService.getBatter();
			this.pitcher = gamePlayService.getPitcher();
		}

		this.throwPitch = function(){
			this.setUpPlay();
			this.runPlay();
			this.newBatter;
			
			var outsBeforePlay = this.currentOuts;
			var basesStatusBeforePlay = this.currentBases;
			var stealAttempt = false;
			var sacrificeFly = false;
			var stealAttemptFailedFor3rdOut = false;
			var offenseScoreBeforePlay = this.offense.battingTotals.totalRuns;
			var defenseScoreBeforePlay = this.defense.battingTotals.totalRuns;
			var ballsBeforePlay = gamePlayService.balls();
			var strikesBeforePlay = gamePlayService.strikes();

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
				baseRunningService.handleStealAttempt(this.pitcher.handedness);

				//inning can end on steal attempt failure so refresh variable
				inningEnded = gamePlayService.hasInningEnded();
				stealAttemptFailedFor3rdOut = inningEnded;
			}

			//TO DO: NO PITCH IF PICKOFF ATTEMPT
			//PITCH COUNT
			this.pitcher.pitches++;

			//FIELDER'S CHOICE
			var fieldersChoice = __.checkForFieldersChoice(fieldingResults);
			fieldingResults.fieldersChoice = fieldersChoice;

			//RBIs
			var currentOffenseScore = this.offense.battingTotals.totalRuns;

			if(__.validRBI(this.batter, battingResults, fieldingResults, baseRunningResults, currentOffenseScore, offenseScoreBeforePlay)){
				var runsBattedIn = (currentOffenseScore - offenseScoreBeforePlay);
				gamePlayService.handleRBI(this.batter, runsBattedIn, (outsBeforePlay === 2));

				//SAC FLYs
				if(fieldingResults.ballCaught && (outsBeforePlay < 2)){
					sacrificeFly = true;
					gamePlayService.handleSacFlysBunts(this.batter, appConstants.FLY_OUT_INDICATOR);
				}
			}

			//GROUNDOUTS (FLYOUTS HANDLED IN FIELDING SERVICE)
			if(baseRunningResults.playersThrownOut && (baseRunningResults.playersThrownOut.length > 0) 
				&& (battingResults.battedBallType === battingConstants.BATTED_BALL_TYPES.GROUND_BALL) && __.batterThrownOutAt1st(this.batter, baseRunningResults.playersThrownOut)){
				gamePlayService.handleGroundOutsFlyOuts(appConstants.GROUND_OUT_INDICATOR);
			}

			if(this.newBatter === undefined || this.newBatter){
				this.plateAppearancePitchNumber = 1;

				//BATTERS FACED
				this.pitcher.battersFaced++;
			}
			else{
				this.plateAppearancePitchNumber++;
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
					batter : this.batter, 
					baseRunners : currentBaseRunners, 
					playersThrownOut : baseRunningResults.playersThrownOut, 
					fieldersChoice : fieldersChoice, 
					baseBatterAdvancedTo : fieldingResults.baseBatterAdvancedTo, 
					runnersOnBeforePlay : basesStatusBeforePlay.code,
					inTheParkHR : baseRunningResults.inTheParkHR
				});
			}

			var nextBatter = gamePlayService.getBatter();

			if((this.batter.id !== nextBatter.id) || stealAttemptFailedFor3rdOut){
				//AT BATS/PAs
				if(!stealAttemptFailedFor3rdOut){
					gamePlayService.handlePlateAppearance(this.batter, __.validAtBat(battingResults, fieldingResults, sacrificeFly), basesStatusBeforePlay.code);
				}

				this.newBatter = true;
				this.batter.gameStatLine = __.generatePlayerGameStatLine(this.batter);
			}
			else{
				this.newBatter = false;
			}

			//LOB
			if((outsBeforePlay !== gamePlayService.outs()) || gamePlayService.gameIsOver()){
				var baseRunnersStatus = baseRunningService.getBaseRunnersStatus();
				var basesOccupied = baseRunnersStatus.code;
				//couldn't use code for runnersCurrentlyOn for scenario when runner who went home 
				//is set back a base on inning end (see updateBaseRunners);
				//when this happens, and a diff runner went to 3rd, the details.code sees 1 runner on 3rd even
				//though there are 2, after setting the former runner back a base
				var runnersCurrentlyOn = currentBaseRunners.length;
				var leftRISPwithTwoOut = (__.RISP(basesOccupied) && (outsBeforePlay === 2));

				gamePlayService.handleLOB(this.batter, runnersCurrentlyOn, leftRISPwithTwoOut);	
			}
			else if(battingResults.homeRun){
				baseRunningService.clearBases();
			}

			this.currentOuts = (inningEnded ? 3 : gamePlayService.outs());
			//fresh pull since HR could've been hit
			this.currentBases = baseRunningService.getBaseRunnersStatus();

			//GIDP
			if(__.GIDP(battingResults, baseRunningResults)) gamePlayService.handleGIDP(this.batter);
			
			if(baseRunningResults.clearBases) baseRunningService.clearBases();
			
			if(inningEnded) pitch.pitcherChange = gamePlayService.updateOffenseAndDefense();
			
			this.count = ('' + gamePlayService.balls() + '-' + gamePlayService.strikes());

			this.playByPlay = playByPlayService.generatePlayByPlay({
				inning: this.currentInningForPlayByPlay,
				balls: ballsBeforePlay,
				strikes: strikesBeforePlay,
				bases: basesStatusBeforePlay,
				outs: outsBeforePlay,
				offense: this.offense,
				defense: this.defense,
				offenseScoreBeforePlay: offenseScoreBeforePlay,
				defenseScoreBeforePlay: defenseScoreBeforePlay,
				runnersOnBeforePlay: basesStatusBeforePlay.runnersOn,
				pitcher: this.pitcher,
				batter: this.batter,
				pitch: pitch,
				battingResults: battingResults,
				fieldingResults: fieldingResults,
				baseRunningResults: baseRunningResults
			});

			var lastPlay = _.head(this.playByPlay[this.currentInningForPlayByPlay]);
			this.pitchThrown = (lastPlay.pitchVelocity + ' mph ' + lastPlay.pitchType);
			this.animatePitchResultingCount();
			this.animatePitch(pitch, battingResults);

			//add a separator play call when inning half ends
			if(inningEnded){
				var endOfInning = {
					playByPlay: this.playByPlay,
					inningForPlayByPlay: this.currentInningForPlayByPlay,
				    inning: this.inning,
				    gameOver: gamePlayService.gameIsOver()
				};

				$timeout(function(params){
					params.playByPlay = playByPlayService.generatePlayByPlay({
						inning: params.inningForPlayByPlay,
						inningEnded: inningEnded,
						fullInningEnded: ((params.inning % 1) > 0),
						gameOver: params.gameOver
					});
				}, appConstants.GAME_PLAY.PAUSE_ON_INNING_END, true, endOfInning);
			}

			//switch the play by play view to the new inning
			if(this.fullInningEnded){
				this.currentPlayByPlaySelected = this.currentInningForPlayByPlay;
				this.fullInningEnded = false;
			}

			if(!gamePlayService.gameIsOver()){
				if(!inningEnded){
					/*$timeout(function(){
						this.setUpPlay();
						this.runPlay();
					}, appConstants.GAME_PLAY.PAUSE_BETWEEN_PLAYS);*///USE PARAMS AS DONE ABOVE
				}
			}
			else{
				this.gameIsOver = true;
			}

		}

		this.endGame = function(){
			this.handleCurrentPitcherCard();
			this.handleCurrentBatterCard();
			this.playByPlay = {};
			baseRunningService.clearBases();
			playByPlayService.resetPlayByPlay();
			gamePlayService.resetGame();
			//reset team selection screen so it displays fresh in case window was resized after starting game
			$('.choose-teams-carousel').slick('slickGoTo', 0, true);

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