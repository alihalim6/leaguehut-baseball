module.exports = function(module){
	require('./services/teamsService')(module);
	require('./controllers/chooseTeamsCtrl')(module);
	require('./styles/chooseTeams.less');
}