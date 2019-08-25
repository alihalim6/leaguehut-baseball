module.exports = function(module){
	require('./constants/pitchConstants')(module);
	require('./constants/battingConstants')(module);
	require('./constants/fieldingConstants')(module);
	require('./constants/baseRunningConstants')(module);
	require('./services/gamePlayService')(module);
	require('./services/pitchService')(module);
	require('./services/battingService')(module);
	require('./services/fieldingService')(module);
	require('./services/baseRunningService')(module);
	require('./services/playByPlayService')(module);
	require('./components/gamePlay')(module);
	require('./styles/gamePlay.less');
}