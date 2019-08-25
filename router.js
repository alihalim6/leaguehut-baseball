module.exports = function(module){
	module.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider){
		// Initialize Firebase
	    var config = {
	      apiKey: "AIzaSyDGedy9g9bTinj9Aq_JYlXs5Ia8LWpWHMY",
	      authDomain: "leaguehut-baseball.firebaseapp.com",
	      databaseURL: "https://leaguehut-baseball.firebaseio.com",
	      projectId: "leaguehut-baseball",
	      storageBucket: "leaguehut-baseball.appspot.com",
	      messagingSenderId: "641518700922"
	    };

	    firebase.initializeApp(config);
		$locationProvider.html5Mode(true);
		
		$routeProvider.
			/*when('/chooseTeams', {
				template : require('./app/modules/chooseTeams/views/chooseTeams.html'),
				controller : 'chooseTeamsCtrl'
			}).
			otherwise({
				redirectTo : '/chooseTeams'
			});*/
			when('/', {
				template : require('./app/modules/chooseTeams/views/chooseTeams.html'),
				controller : 'chooseTeamsCtrl'
			});
	}]);
}