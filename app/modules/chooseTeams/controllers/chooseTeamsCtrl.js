module.exports = function(module){
	module.controller('chooseTeamsCtrl', chooseTeamsCtrl);

	chooseTeamsCtrl.$inject = ['$scope', 'teamsService', 'appConstants', 'baseRunningService', 'playByPlayService', 'gamePlayService'];
 
	function chooseTeamsCtrl($scope, teamsService, appConstants, baseRunningService, playByPlayService, gamePlayService){
		teamsService.getAllTeams().then(function(teams){
			$scope.teams = teams;
			$scope.chosenTeams = [];
			$scope.teamChosen = {};

			_.each($scope.teams, function(team){
				_.each(team.players, function(player){
					player.skillsList = [];

					if(player.infield){
						var infieldSkillsList = (player.position === appConstants.GAME_PLAY.POSITIONS.PITCHER) ? appConstants.PLAYER_SKILLS_DISPLAY.PITCHERS : appConstants.PLAYER_SKILLS_DISPLAY.INFIELD;
						player.skillsList.push.apply(player.skillsList, infieldSkillsList);
					}
					else{
						player.skillsList.push.apply(player.skillsList, appConstants.PLAYER_SKILLS_DISPLAY.OUTFIELD);
					}

					player.skillsList.push.apply(player.skillsList, appConstants.PLAYER_SKILLS_DISPLAY.GENERAL);
				
					if(player.position === appConstants.GAME_PLAY.POSITIONS.PITCHER){
						if(player.depthPosition === 1) player.isStartingPitcher = true;
						if(player.depthPosition === 2) player.isMiddleReliever = true;
						if(player.depthPosition === 3) player.isCloser = true;
					}
				});
			});

			$(document).ready(initializeSlides);
		});

		function initializeSlides(){
			$scope.bullpenToggle = appConstants.BULLPEN_INITIAL_TOGGLE;

			$('.choose-teams-carousel').slick({
		    	dots: true,
		    	autoplay: false,
		    	slidesToShow: 1
	  		});

	  		$scope.gameTeams = [];

	  		//allow modal to be shared with gamePlay component ($ctrl syntax)
	  		$scope.$ctrl = {
	  			closePlayerInfoModal: function(playerId){
					//clear out headshot if click on different player than previous; otherwise, new one is appended
					if($scope.$ctrl.playerInfo && playerId && (playerId !== $scope.$ctrl.playerInfo.playerId)){
						$('.player-info-modal').find('.face').remove();
					}

					$(getPlayerInfoModalId()).hide();
				},
				determineBarDisplay: function(team, playerId, skillRating){
					if(typeof team === 'number'){
						team = _.find($scope.teams, {id: team});
					}

					var player = _.find(team.players, {id: playerId});
					var overallRatingNumerator = (player.awareness + player.consistency + player.hitPower + player.throwPower);
					overallRatingNumerator += player.infield ? 0 : player.runSpeed;
					var overallRatingDenominator = player.infield ? 4 : 5;

					if(player.position === 'P'){
						overallRatingNumerator += (player.fastball + player.breakingBall + player.changeup);
						overallRatingDenominator += 3;
					}

					var overallRating = (overallRatingNumerator / overallRatingDenominator);
					
					if(skillRating){
						skillRating = player[_.camelCase(skillRating)];
					}

					var rating = Math.floor(skillRating || overallRating);
			
					return {
						width: rating + 'px',
						background: 'linear-gradient(to right, #b20000 0%, #039b30 ' + (100 - rating) + '%, #039b30 100%)'
					}
				}
	  		};

	  		///////////////////////////////
			//$scope.gameTeams[0] = _.find($scope.teams, {id: 9});//1 - RH batter; 2-LH
			//$scope.gameTeams[1] = _.find($scope.teams, {id: 6});//9 - RH pitcher; 10-LH
			//$scope.gameInProgress = true;
		}

		function getPlayerInfoModalId(){
			return ($scope.gameInProgress ? '#playerInfoGamePlay' : '#playerInfoChooseTeams');
		}

		$scope.showPlayerInfo = function(team, playerId){
			$scope.$ctrl.closePlayerInfoModal(playerId);
			var player = _.find(team.players, {id: playerId});
			var fastballPercentage = player.fastballPercentage;
			var sliderPercentage = player.sliderPercentage;
			var curveballPercentage = player.curveballPercentage;
			var changeupPercentage = player.changeupPercentage;
			
			$scope.$ctrl.playerInfo = {
				teamId: team.id,
				playerId: player.id,
				playerName: player.fullName,
				position: player.position,
				skillsList: player.skillsList,
				isPitcher: (player.position === 'P'),
				fastballPercentage: fastballPercentage,
				sliderPercentage: sliderPercentage,
				curveballPercentage: curveballPercentage,
				changeupPercentage: changeupPercentage,

				//absolute positioning for the pitch percentages
				curveballPercentageIndex: (sliderPercentage ? 3 : 2),
				changeupPercentageIndex: ((curveballPercentage && sliderPercentage) ? 4 : ((curveballPercentage || sliderPercentage) ? 3 : 2)),

				//hide pitch type if thrown 0% of the time
				hide: {
					Fastball: !fastballPercentage,
					Slider: !sliderPercentage,
					Curveball: !curveballPercentage,
					Changeup: !changeupPercentage
				}
			};

			$(getPlayerInfoModalId()).show();
		}

		$scope.toggleBullpen = function(){
			$scope.bullpenToggle = ($scope.bullpenToggle === appConstants.BULLPEN_INITIAL_TOGGLE) ? appConstants.BULLPEN_SECONDARY_TOGGLE : appConstants.BULLPEN_INITIAL_TOGGLE;
		}

		$scope.prevSlide = function(){
			$('.choose-teams-carousel').slick('slickPrev');
		}

		$scope.nextSlide = function(){
			$('.choose-teams-carousel').slick('slickNext');
		}

		$scope.chooseTeam = function(teamId, teamName){
			$scope.teamChosen[teamId] = true;

			//remove previous 2nd team chosen if applicable
			if($scope.chosenTeams.length === 2){
				var previous2ndTeamChosen = $scope.chosenTeams[1];
				$scope.teamChosen[previous2ndTeamChosen.id] = false;
				$scope.chosenTeams.pop();
			}
			
			$scope.chosenTeams.push({
				id: teamId,
				name: teamName
			});
		}

		$scope.removeChosenTeam = function(removedTeamIndex, teamId){
			$scope.teamChosen[teamId] = false;
			$scope.chosenTeams.splice(removedTeamIndex, 1);
		}

		$scope.startGame = function(){
			$scope.gameTeams = [];
			$scope.gameTeams[0] = _.find($scope.teams, {id: $scope.chosenTeams[0].id});
			$scope.gameTeams[1] = _.find($scope.teams, {id: $scope.chosenTeams[1].id});

			baseRunningService.clearBases();
			playByPlayService.resetPlayByPlay();
			gamePlayService.resetGame();

			$scope.gameInProgress = true;
		}

		$scope.$watch('gameInProgress', function(value){
			$scope.gameInProgress = value;

			//reset view after game is closed
			if(!value){
				initializeSlides();
				$scope.chosenTeams = [];
				$scope.teamChosen = {};
			}
		});
	}
}