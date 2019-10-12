/**
 * Controller for the page where user can analyze and choose teams for the game.
 */
module.exports = function(module){
	module.controller('chooseTeamsCtrl', ['$scope', 'teamsService', 'appConstants', 'baseRunningService', 'playByPlayService', 'gamePlayService', function chooseTeamsCtrl($scope, teamsService, appConstants, baseRunningService, playByPlayService, gamePlayService){
		teamsService.getAllTeams().then(function(teams){
			$scope.teams = teams;
			$scope.chosenTeams = [];
			$scope.teamChosen = {};

			_.each($scope.teams, function(team){
				_.each(team.players, function(player){
					player.skillsList = [];

					//set player's list of skills to display in his player info modal
					if(player.infield){
						var infieldSkillsList = (player.position === appConstants.GAME_PLAY.POSITIONS.PITCHER) ? appConstants.PLAYER_SKILLS_DISPLAY.PITCHERS : appConstants.PLAYER_SKILLS_DISPLAY.INFIELD;
						player.skillsList = _.concat(player.skillsList, infieldSkillsList);
					}
					else{
						player.skillsList = _.concat(player.skillsList, appConstants.PLAYER_SKILLS_DISPLAY.OUTFIELD);
					}

					player.skillsList = _.concat(player.skillsList, appConstants.PLAYER_SKILLS_DISPLAY.GENERAL);
				
					if(player.position === appConstants.GAME_PLAY.POSITIONS.PITCHER){
						if(player.depthPosition === 1) player.isStartingPitcher = true;
						if(player.depthPosition === 2) player.isMiddleReliever = true;
						if(player.depthPosition === 3) player.isCloser = true;
					}
				});
			});

			$(document).ready(initializeSlides);
		});

		/**
		 * Sets up the carousel of teams that user can swipe/click through and analyze players by viewing their ratings and modal.
		 */
		function initializeSlides(){
			$scope.bullpenToggle = appConstants.BULLPEN_INITIAL_TOGGLE;

			$('.choose-teams-carousel').slick({
		    	dots: true,
		    	autoplay: false,
		    	slidesToShow: 1
	  		});

	  		$scope.gameTeams = [];

	  		//allow modal to be shared with gamePlay component (which uses $ctrl syntax)
	  		$scope.$ctrl = {
	  			closePlayerInfoModal: function(playerId){
					//clear out headshot if user clicks on different player than previous
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
					overallRatingNumerator += (player.infield ? 0 : player.runSpeed);
					var overallRatingDenominator = (player.infield ? 4 : 5);

					if(player.position === appConstants.GAME_PLAY.POSITIONS.PITCHER){
						overallRatingNumerator += (player.fastball + player.breakingBall + player.changeup);
						overallRatingDenominator += 3;
					}

					var overallRating = (overallRatingNumerator / overallRatingDenominator);
					
					if(skillRating) skillRating = player[_.camelCase(skillRating)];

					var rating = Math.floor(skillRating || overallRating);
			
					return {
						width: rating + 'px',
						background: 'linear-gradient(to right, #b20000 0%, #039b30 ' + (100 - rating) + '%, #039b30 100%)'
					}
				}
	  		};

			//$scope.gameTeams[0] = _.find($scope.teams, {id: 9});
			//$scope.gameTeams[1] = _.find($scope.teams, {id: 6});
			//$scope.gameInProgress = true;
		}

		/**
		 * Returns the appropriate player info modal element based on whether or not user is on the choose teams page or in a game.
		 */
		function getPlayerInfoModalId(){
			return ($scope.gameInProgress ? '#playerInfoGamePlay' : '#playerInfoChooseTeams');
		}

		/**
		 * Opens an info modal for the given player.
		 */
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
				isPitcher: (player.position === appConstants.GAME_PLAY.POSITIONS.PITCHER),
				fastballPercentage: fastballPercentage,
				sliderPercentage: sliderPercentage,
				curveballPercentage: curveballPercentage,
				changeupPercentage: changeupPercentage,

				//these indeces determine the absolute positioning for the pitch percentages
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

		/**
		 * Sets the appropriate label for the section of the team slide that shows the middle reliever and closer based on whether user opened or closed it.
		 */
		$scope.toggleBullpen = function(){
			$scope.bullpenToggle = ($scope.bullpenToggle === appConstants.BULLPEN_INITIAL_TOGGLE) ? appConstants.BULLPEN_SECONDARY_TOGGLE : appConstants.BULLPEN_INITIAL_TOGGLE;
		}

		/**
		 * Goes to the previous team slide.
		 */
		$scope.prevSlide = function(){
			$('.choose-teams-carousel').slick('slickPrev');
		}

		/**
		 * Goes to the next team slide.
		 */
		$scope.nextSlide = function(){
			$('.choose-teams-carousel').slick('slickNext');
		}

		/**
		 * Handles the selection of a team from its slide.
		 */
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

		/**
		 * Handles the removal of a previously selected team.
		 */
		$scope.removeChosenTeam = function(removedTeamIndex, teamId){
			$scope.teamChosen[teamId] = false;
			$scope.chosenTeams.splice(removedTeamIndex, 1);
		}

		/**
		 * Handles the launch of a game after two teams have been chosen and clears out any service data that may be lingering.
		 */
		$scope.startGame = function(){
			$scope.gameTeams = [];
			$scope.gameTeams[0] = _.find($scope.teams, {id: $scope.chosenTeams[0].id});
			$scope.gameTeams[1] = _.find($scope.teams, {id: $scope.chosenTeams[1].id});

			baseRunningService.clearBases();
			playByPlayService.resetPlayByPlay();
			gamePlayService.resetGame();

			$scope.gameInProgress = true;
		}

		/**
		 * Resets the choose teams page if a game is closed.
		 */
		$scope.$watch('gameInProgress', function(value){
			$scope.gameInProgress = value;

			//game not in progress
			if(!value){
				initializeSlides();
				$scope.chosenTeams = [];
				$scope.teamChosen = {};
			}
		});
	}]);
}