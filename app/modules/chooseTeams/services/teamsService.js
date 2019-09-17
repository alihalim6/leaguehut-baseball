/**
 * Handles initialization and retrieval of the teams and some gameplay.
 */
module.exports = function(module){
	module.service('teamsService', teamsService);

	teamsService.$inject = ['$q', 'appConstants', 'pitchConstants', 'appUtility'];

	function teamsService($q, appConstants, pitchConstants, appUtility){
        var __ = appUtility;
		var firestore = firebase.firestore();
	    var playersRef = firestore.collection('players');
	    var teamsRef = firestore.collection('teams');
	    var players = [];
	    var teams = [];

        var api = {
            getAllTeams: getAllTeams,
            setUpTeamStats: setUpTeamStats,
            setUpBoxScore: setUpBoxScore
        }

        return api;

        /**
         * Retrieves all the teams from firebase storage.
         */
	    function getTeams(){
	    	var teamsDeferral = $q.defer();

	    	if(!teams.length){
				teamsRef.get().then(function(teamList){
					teamsDeferral.resolve(teamList);
				}, function(error){
		    		alert('Error getting teams: ' + error + '.  Please refresh the page to try again.');
		    	});
			}
			else{
				teamsDeferral.resolve(teams);
			}

	    	return teamsDeferral.promise;
	    }

        /**
         * Retrieves all the players from firebase storage.
         */
	    function getPlayers(){
	    	var playersDeferral = $q.defer();

	    	if(!players.length){
		    	playersRef.get().then(function(playerList){
					playersDeferral.resolve(playerList);
				}, function(error){
		    		alert('Error getting players: ' + error + '.  Please refresh the page to try again.');
		    	});
	    	}
	    	else{
	    		playersDeferral.resolve(players);
	    	}

	    	return playersDeferral.promise;
	    }

        /**
         * Processes all the teams, setting them up for display and gameplay.
         */
	    function getAllTeams(){
	    	var deferred = $q.defer();

	    	$q.all([getTeams(), getPlayers()]).then(function(promises){
	    		var teamList = promises[0];
	    		var playerList = promises[1];
 		
    			teamList.forEach(function(team){
                    var teamPlayers = [];
    				var currentTeam = {
    					id: team.get('teamId'),
    					name: team.get('name'),
    					nameAbbreviation: team.get('nameAbbreviation'),
                        atBatIndex: 0,
                        pitchersBroughtIn: 0,
    					players: {},
                        currentPitcherScoreDeficit: {}
    				};

    				playerList.forEach(function(player){
                        var playerTeamId = player.get('teamId');

    					if(playerTeamId === currentTeam.id){
    						var currentPlayer = {
                                teamId: playerTeamId,
    							id: player.get('playerId'),
    							position: player.get('position'),
    							teamPosition: player.get('position'),
    							depthPosition: player.get('depthPosition'),
    							firstName: player.get('firstName'),
    							lastName: player.get('lastName'),
    							fullName: player.get('fullName'),
    							handedness: player.get('handedness'),
    							battingOrder: player.get('battingOrder'),
    							fieldSide: player.get('fieldSide'),
    							infield: player.get('infield'),
    							awareness: player.get('awareness'),
    							consistency: player.get('consistency'),
    							hitPower: player.get('hitPower'),
    							propensityToSwing: player.get('propensityToSwing'),
    							runSpeed: player.get('runSpeed'),
    							throwPower: player.get('throwPower'),
    							windupTime: player.get('windupTime'),
    							basePitchCount: player.get('basePitchCount'),
    							breakingBall: player.get('breakingBallRating'),
    							changeup: player.get('changeupRating'),
    							fastball: player.get('fastballRating'),
    							changeupPercentage: player.get('changeupPercentage'),
    							curveballPercentage: player.get('curveballPercentage'),
    							fastballPercentage: player.get('fastballPercentage'),
    							sliderPercentage: player.get('sliderPercentage')
    						};


    						//append depth position to 'P' to distinguish between starting pitchers and middle relievers/closers
    						if(currentPlayer.position === appConstants.GAME_PLAY.POSITIONS.PITCHER){
    							currentPlayer.teamPosition += currentPlayer.depthPosition;
    						}

    						currentTeam.players[currentPlayer.teamPosition] = currentPlayer;
    						players.push(currentPlayer);
    					}
    				});

                    _.each(currentTeam.players, function(player){
                        teamPlayers.push(player);
                    });

                    currentTeam.players = teamPlayers.sort(function(a, b){
                        return a.battingOrder - b.battingOrder;
                    });

    				teams.push(currentTeam);
    			});

    			deferred.resolve(teams);
	    	}, function(error){
	    		deferred.reject(error);
	    	});

	    	return deferred.promise;
	    }

        /**
         * Initialize each team's game stats.
         */
        function setUpTeamStats(gameTeams){
            _.each(gameTeams, function(team){
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

                team.totalErrors = 0;

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

        /**
         * Initializes the box score and team stats modal categories, and other player-specific info.
         */
        function setUpBoxScore(gameTeams){
            var teamIndex = 0;
            var boxScore = {};

            boxScore.playerBattingCategories = [' ', 'AB', 'R', 'H', 'TB', 'RBI', 'HR', 'BB', 'SO', 'LOB', 'E'];
            boxScore.teamBattingCategories = [
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

            boxScore.pitchingCategories = [' ', 'IP', 'H', 'R', 'BB', 'K', 'PITCHES'];
            boxScore.pitcherGameStats = [
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

            boxScore.teamPitchingCategories = [
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

            _.each(gameTeams, function(team, index){
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

                        /**
                         * Evaluates pitcher's current performance and makes a call whether or not to take him out of the game.
                         */
                        var pitcherChangeEvaluation = function(params){
                            var justPitched = (params.defense.id === this.teamId);
                            var makeChange = false;
                            var badPerformance = false;
                            var performanceNumber = 0;
                            var currentInning = Math.floor(params.inning);
                            var threeInningsAgo = ((params.inning >= 4) ? (currentInning - 3) : 0);
                            var twoInningsAgo = ((params.inning >= 3) ? (currentInning - 2) : 0);
                            var oneInningAgo = ((params.inning >= 2) ? (currentInning - 1) : 0);

                            var walksStrikeoutsDelta = (this.battersWalked - this.battersStruckOut);
                            var homeRunsAllowedDelta = (this.homeRunsAllowedByInning[currentInning] * pitchConstants.PERFORMANCE_WEIGHT.HR);
                            var hitsAllowedDelta = (this.hitsAllowedByInning[currentInning] * pitchConstants.PERFORMANCE_WEIGHT.HITS);
                            var walksAllowedDelta = (this.walksAllowedByInning[currentInning] * pitchConstants.PERFORMANCE_WEIGHT.WALKS);
                            var runsAllowedCurrentInningDelta = (this.runsAllowedByInning[currentInning] * pitchConstants.PERFORMANCE_WEIGHT.RUNS_CURRENT_INNING);
                            var deficitDelta = (params.defense.currentPitcherScoreDeficit[this.id] * pitchConstants.PERFORMANCE_WEIGHT.DEFICIT);

                            var runsAllowedPreviousInningsDelta = 0;
                            var hitsAllowedPreviousInningsDelta = 0;
                            var walksAllowedPreviousInningsDelta = 0;

                            if(threeInningsAgo) runsAllowedPreviousInningsDelta += (this.runsAllowedByInning[threeInningsAgo] * pitchConstants.PERFORMANCE_WEIGHT.RUNS_PREV_INNINGS);
                            
                            if(twoInningsAgo){
                                runsAllowedPreviousInningsDelta += (this.runsAllowedByInning[twoInningsAgo] * pitchConstants.PERFORMANCE_WEIGHT.RUNS_PREV_INNINGS);
                                hitsAllowedPreviousInningsDelta += (this.hitsAllowedByInning[twoInningsAgo] * pitchConstants.PERFORMANCE_WEIGHT.HITS_PREV_INNINGS);
                            }

                            if(oneInningAgo){
                                runsAllowedPreviousInningsDelta += (this.runsAllowedByInning[oneInningAgo] * pitchConstants.PERFORMANCE_WEIGHT.RUNS_PREV_INNINGS);
                                hitsAllowedPreviousInningsDelta += (this.hitsAllowedByInning[oneInningAgo] * pitchConstants.PERFORMANCE_WEIGHT.HITS_PREV_INNINGS);
                                walksAllowedPreviousInningsDelta += (this.walksAllowedByInning[oneInningAgo] * pitchConstants.PERFORMANCE_WEIGHT.WALKS_PREV_INNINGS);
                            }

                            performanceNumber = (walksStrikeoutsDelta + homeRunsAllowedDelta + hitsAllowedDelta + walksAllowedDelta + runsAllowedCurrentInningDelta 
                                    + deficitDelta + runsAllowedPreviousInningsDelta + hitsAllowedPreviousInningsDelta + walksAllowedPreviousInningsDelta);

                            //console.log('P performance: ' + performanceNumber);

                            badPerformance = (__.getRandomIntInclusive(pitchConstants.BAD_PERFORMANCE_MIN, pitchConstants.BAD_PERFORMANCE_MAX) <= performanceNumber);

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

            return boxScore;
        }

	}
}