/**
 * First page of the application where user can analyze and chooses teams to run a game with.
 */
module.exports = function(module){
	require('./services/teamsService')(module);
	require('./controllers/chooseTeamsCtrl')(module);
	require('./styles/chooseTeams.less');
}