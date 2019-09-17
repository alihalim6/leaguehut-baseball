/**
 * Modal displaying information about a player.
 */
module.exports = function(module){
	module.directive('playerInfoModal', playerInfoModal);

	playerInfoModal.$inject = [];
 
	function playerInfoModal(){
		return {
			restrict: 'E',
			template : require('../views/playerInfoModal.html')
		}
	}
}