/**
 * Utility functions used throughout the application.
 */
module.exports = function(module){
	module.service('appUtility', appUtilityService);

	appUtilityService.$inject = ['appConstants', 'pitchConstants', 'battingConstants', 'fieldingConstants'];

	function appUtilityService(appConstants, pitchConstants, battingConstants, fieldingConstants){
		var api = {
			getRandomIntInclusive: getRandomIntInclusive,
			getRandomDecimalInclusive: getRandomDecimalInclusive,
			get100minusAttribute: get100minusAttribute,
			formatInning : formatInning,
			determinePitchCountForGame: determinePitchCountForGame,
			determineQualityOrBatterPitchID: determineQualityOrBatterPitchID,
			isPitchInStrikeZone: isPitchInStrikeZone,
			pitcherCountPosition: pitcherCountPosition,
			batterCountPosition: batterCountPosition,
			getX2Y2: getX2Y2,
			getAngleBetweenTwoPoints: getAngleBetweenTwoPoints,
			getDistance: getDistance,
			convertToRadians: convertToRadians,
			RISP: RISP,
			determineBaseThrowVelocity: determineBaseThrowVelocity,
			mphToFps: mphToFps,
			roundDownToNearest5: roundDownToNearest5,
			checkForFieldersChoice: checkForFieldersChoice,
			GIDP: GIDP,
			validRBI: validRBI,
			batterThrownOutAt1st: batterThrownOutAt1st,
			validAtBat: validAtBat,
			translatePitchLocationForPlayByPlay: translatePitchLocationForPlayByPlay,
			generatePlayerGameStatLine: generatePlayerGameStatLine
		};

		return api;

		/**
		 * Returns a random integer bewteen the given min and max, inclusive.
		 */
		function getRandomIntInclusive(_min, _max) {
  			return (new Chance).integer({min: _min, max: _max});
		}

		/**
		 * Returns a random float bewteen the given min and max with the given number of decimal places, inclusive.
		 */
		function getRandomDecimalInclusive(_min, _max, _decimalPlaces) {
  			return (new Chance).floating({min: _min, max: _max, fixed: _decimalPlaces});
		}

		/**
		 * Returns the result of subtracting the given number from 100.
		 */
		function get100minusAttribute(attribute){
			return (100 - attribute);
		}

		/**
		 * Returns a a representation of the current inning as requested.
		 */
		function formatInning(inning, noHalf){
			var half;
			var suffix = 'th';
			var inningNoHalf;

			//top
			if((inning % 1) === 0){
				half = 'TOP';
			}
			else{
				half = 'BOT';
			}

			//1st inning
			if(Math.floor(inning) == 1) suffix = 'st';
			//2nd inning
			else if(Math.floor(inning) == 2) suffix = 'nd';
			//3rd inning
			else if(Math.floor(inning) == 3) suffix = 'rd';

			inningNoHalf = (Math.floor(inning) + suffix);

			if(noHalf) return inningNoHalf;

			return (half + ' ' + inningNoHalf);
		}

		/**
		 * Returns a pitcher's target pitch count for the game based on his predefined base amount.
		 */
		function determinePitchCountForGame(pitcherBaseCount){
			return getRandomIntInclusive((pitcherBaseCount - pitchConstants.GAME_PITCH_COUNT_RANGE), (pitcherBaseCount + pitchConstants.GAME_PITCH_COUNT_RANGE));
		}

		/**
		 * Multi-purpose function that returns a pitch's quality or how well a batter sees a pitch, based on skillset.
		 */
		function determineQualityOrBatterPitchID(rating, consistency, pitch, isForPitchQual){
			if(consistency == 100) consistency = appConstants.GAME_PLAY.DEFAULT_CONSISTENCY_IF_100;
			else if(consistency == 0) consistency = appConstants.GAME_PLAY.DEFAULT_CONSISTENCY_IF_0;

			var multiplierDecimal = (isForPitchQual ? pitchConstants.PITCH_QUALITY_MULTIPLIER : battingConstants.BATTER_MULTIPLIER);
			var multiplier = getRandomIntInclusive(0, get100minusAttribute(consistency)) * multiplierDecimal;
			var delta = 0;
			var aidedByConsistency = (getRandomIntInclusive(0, 100) <= consistency);
			var property = rating;

			if(multiplier > 0){
				if(pitch && (pitch.pitchType === pitchConstants.PITCH_TYPES.FASTBALL)) property = pitch.pitchVelocity;

				delta = (property * multiplier);
				delta *= (aidedByConsistency ? 1 : -1);
				rating = (rating + delta);
			}

			return rating;
		}

		/**
		 * Returns whether or not a pitch was thrown in a batter's strike zone.
		 */
		function isPitchInStrikeZone(pitchLocation){
			return (pitchLocation.indexOf('S') == 0);
		}

		/**
		 * Returns the leverage position of a pitcher based on the current count.
		 */
		function pitcherCountPosition(balls, strikes){
			//even
			if(balls === strikes) return 'even';
			//behind
			//3-2 count is considered behind for pitcher (via fangraphs)
			else if(balls > strikes) return 'behind';
			//ahead
			else if(balls < strikes) return 'ahead';
		}

		/**
		 * Returns the leverage position of a batter based on the current count.
		 */
		function batterCountPosition(balls, strikes){
			//even
			if(balls === strikes) return 'even';
			//behind
			//3-2 count is considered ahead for batter (via fangraphs)
			else if(balls > strikes) return 'ahead';
			//ahead
			else if(balls < strikes) return 'behind';
		}

		/**
		 * Returns the second point of a line given the first point, distance and angle.
		 */
		function getX2Y2(x1, y1, distance, angle){
    		return {
				x : x1 + (distance * Math.cos(angle)),
				y : y1 + (distance * Math.sin(angle))
			};
    	}

    	/**
		 * Returns the angle between two points.
		 */
    	function getAngleBetweenTwoPoints(startXY, endXY){
    		var atanX = 0;
    		var atanY = 0;

			if(endXY.x < startXY.x){
				atanX = (Math.abs(endXY.x - startXY.x) * -1);
			}
			else{
				atanX = (endXY.x - startXY.x);
			}

			if(endXY.y < startXY.y){ 
				atanY = (Math.abs(endXY.y - startXY.y) * -1);
			}
			else{
				atanY = (endXY.y - startXY.y);
			}


			return Math.atan2(atanY, atanX);
		}

		/**
		 * Returns the distance between two points.
		 */
    	function getDistance(start, end){
        	return Math.sqrt((Math.pow(end.x - start.x, 2)) + (Math.pow(end.y - start.y, 2)));
    	}

    	/**
		 * Converts a raw angle into radians.
		 */
    	function convertToRadians(angle){
		    return (angle * (Math.PI / 180));
		}

		/**
		 * Returns whether or not there were runners in scoring position on a play.
		 */
		function RISP(runners){
			return ((runners != 0) && (runners != 1));
		}

		/**
		 * Returns a base velocity for a player given his position.
		 */
		function determineBaseThrowVelocity(player, infielder){
			if(player){
				if(!infielder){
					if(player.position === appConstants.GAME_PLAY.POSITIONS.CENTER_FIELDER) return fieldingConstants.THROW_VELOCITY_CF;
					else return fieldingConstants.THROW_VELOCITY_CORNER_OUTFIELDER;
				}

				if(player.position === appConstants.GAME_PLAY.POSITIONS.PITCHER) return player.fastball;
			}

			return fieldingConstants.THROW_VELOCITY_INFIELDER;
		}

		/**
		 * Converts the given mph to fps.
		 */
		function mphToFps(mph){
			return (mph * 1.466668);
		}

		/**
		 * Rounds the given number down to the nearest number that 5 is a factor of.
		 */
		function roundDownToNearest5(x){
    		return (Math.floor(x / 5) * 5);
		}

		/**
		 * Returns true if there was a fielder's choice on the play.
		 */
		function checkForFieldersChoice(fieldingResults){
			//if batter wasn't caught out, there was an attempt on a base and a play could have been made at base batter advanced to
			if(fieldingResults.baseBatterAdvancedTo && fieldingResults.firstThrowToBase && fieldingResults.playToBeMadeOnBatter){
				//first throw was not to batter's base
				if(fieldingResults.baseBatterAdvancedTo != fieldingResults.firstThrowToBase){

					//second throw was not to batter's base either
					if(fieldingResults.secondThrowToBase && (fieldingResults.baseBatterAdvancedTo !== fieldingResults.secondThrowToBase)){
						return true;
					}
					//there was no second throw after first throw to base other than batter's
					else if(!fieldingResults.secondThrowToBase){
						return true;
					}
				}

				//first or second throw was to batter's base
				return false;
			}

			return false;
		}

		/**
		 * Returns whether or not the batter on a play grounded into a double play.
		 */
		function GIDP(battingResults, baseRunningResults){
			return ((battingResults.battedBallType === battingConstants.BATTED_BALL_TYPES.GROUND_BALL) && (baseRunningResults.firstAttemptRunnerSafe === false) && (baseRunningResults.secondAttemptRunnerSafe === false));
		}

		/**
		 * Returns whether or not the run(s) batted in on a play should be tallied as such for a batter.
		 */
		function validRBI(batter, battingResults, fieldingResults, baseRunningResults, currOffenseScore, prevOffenseScore){
			return (battingResults.putIntoPlay && !fieldingResults.errorOnPlay && (currOffenseScore !== prevOffenseScore) && !GIDP(battingResults, baseRunningResults));
		}

		/**
		 * Returns whether or not the batter was thrown out at first base on a play.
		 */
		function batterThrownOutAt1st(batter, runnersThrownOut){
			var batterThrownOut = false;

			_.each(runnersThrownOut, function(runner){
				if((runner.position === batter.position) && (runner.base == 1)){
					batterThrownOut = true;
					return false;
				}
			});

			return batterThrownOut;
		}

		/**
		 * Returns whether or not the last at bat should be counted as such.
		 */
		function validAtBat(battingResults, fieldingResults, sacrificeFly){
			return (!battingResults.hitByPitchOrWalk && !sacrificeFly && !fieldingResults.sacrificeBunt) /*OR REACH ON INTERFERANCE*/;
		}

		/**
		 * Returns a partial description of where a pitch was thrown relative to the batter's strike zone.
		 */
		function translatePitchLocationForPlayByPlay(location){
			var inZone = isPitchInStrikeZone(location);
			var locationCode = (((location.length === 2) || inZone) ? location : location.substring(1, 2));
			var locations = (inZone ? pitchConstants.IN_ZONE_PLAY_CALL_LOCATIONS : pitchConstants.OUT_OF_ZONE_PLAY_CALL_LOCATIONS);

			return locations[locationCode];
		}

		/**
		 * Returns the game stat line for the current batter.
		 */
		function generatePlayerGameStatLine(batter){
			return (batter.atBats ? batter.hits + ' FOR ' + batter.atBats : '') +
					(batter.walks ? ((batter.atBats ? ', ' : '') + (batter.walks > 1 ? batter.walks + ' WALKS' : 'WALK')) : '') +
					(batter.runs ? ((batter.atBats || batter.walks ? ', ' : '') + (batter.runs > 1 ? batter.runs + ' R' : '' + 'R')) : '') +
					(batter.doubles ? (', ' + (batter.doubles > 1 ? batter.doubles + ' DOUBLES' : 'DOUBLE')) : '') +
					(batter.triples ? (', ' + (batter.triples > 1 ? batter.triples + ' TRIPLES' : 'TRIPLE')) : '') +
					(batter.HR ? (', ' + (batter.HR > 1 ? batter.HR + ' HR' : 'HR')) : '') +
					(batter.rbis ? ((batter.atBats || batter.sacFlys ? ', ' : '') + (batter.rbis > 1 ? batter.rbis + ' RBI' : 'RBI')) : '') +
					(batter.strikeOuts ? (', ' + (batter.strikeOuts > 1 ? batter.strikeOuts + ' STRIKEOUTS' : 'STRIKEOUT')) : '') +
					(batter.sacFlys ? (', ' + (batter.sacFlys > 1 ? batter.sacFlys + ' SAC FLYS' : 'SAC FLY')) : '') +
					(batter.hitByPitch ? ((batter.atBats || batter.walks || batter.sacFlys ? ', ' : '') + (batter.hitByPitch > 1 ? batter.hitByPitch + ' HBP' : 'HBP')) : '');
		}

	}
}