var _ = require('lodash');
_.camelCase = require('lodash.camelcase');
var angular = require('angular');
var ngRoute = require('angular-route');
var app = angular.module('leaguehutBaseball', ['ngRoute']);

require('./router')(app);
require('./app/styles/app.less');
require('./jquery');
require('./slick');
require('./chance');
require('./app/styles/slick.less');
require('./app/styles/slick-theme.less');
require('./app/constants/appConstants')(app);
require('./app/services/appUtilityService')(app);
require('./app/directives/scripts/svgIcon')(app);
require('./app/directives/scripts/playerInfoModal')(app);
require('./app/modules/chooseTeams')(app);
require('./app/modules/gamePlay')(app);