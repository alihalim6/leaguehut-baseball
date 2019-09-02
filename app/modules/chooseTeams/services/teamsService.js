module.exports = function(module){
	module.service('teamsService', teamsService);

	teamsService.$inject = ['$q'];

	function teamsService($q){
		var firestore = firebase.firestore();
	    var playersRef = firestore.collection('players');
	    var teamsRef = firestore.collection('teams');
	    var players = [];
	    var teams = [];

        var api = {
            getAllTeams: getAllTeams
        }

        return api;

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


    						//append depth position to 'P' to distinguish between
    						//starting pitchers and middle relievers/closers
    						if(currentPlayer.position === 'P'){
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

	}
}