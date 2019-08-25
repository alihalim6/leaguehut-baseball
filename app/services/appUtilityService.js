module.exports = function(module){
	module.service('appUtility', appUtilityService);

	appUtilityService.$inject = ['appConstants', 'pitchConstants', 'battingConstants', 'fieldingConstants'];

	function appUtilityService(appConstants, pitchConstants, battingConstants, fieldingConstants){
		var api = {
			getRandomIntInclusive: getRandomIntInclusive,
			getRandomDecimalInclusive: getRandomDecimalInclusive,
			get100minusAttribute: get100minusAttribute,
			formatInning : formatInning,
			formatOuts: formatOuts,
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

		function getRandomIntInclusive(_min, _max) {
  			return (new Chance).integer({min: _min, max: _max});
		}

		function getRandomDecimalInclusive(_min, _max, _decimalPlaces) {
  			return (new Chance).floating({min: _min, max: _max, fixed: _decimalPlaces});
		}

		function get100minusAttribute(attribute){
			return (100 - attribute);
		}

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

		function formatOuts(outs){
			return outs + (outs === 1 ? " Out" : " Outs");
		}

		function determinePitchCountForGame(pitcherBaseCount){
			return getRandomIntInclusive(pitcherBaseCount - pitchConstants.GAME_PITCH_COUNT_RANGE, pitcherBaseCount + pitchConstants.GAME_PITCH_COUNT_RANGE);
		}

		function determineQualityOrBatterPitchID(rating, consistency, pitch, isForPitchQual){
			if(consistency == 100){
				consistency = appConstants.GAME_PLAY.DEFAULT_CONSISTENCY_IF_100;
			}
			else if(consistency == 0){
				consistency = appConstants.GAME_PLAY.DEFAULT_CONSISTENCY_IF_0;
			}

			var multiplierDecimal = isForPitchQual ? pitchConstants.PITCH_QUALITY_MULTIPLIER : battingConstants.BATTER_MULTIPLIER;
			var multiplier = getRandomIntInclusive(0, get100minusAttribute(consistency)) * multiplierDecimal;
			var delta = 0;
			var aidedByConsistency = (getRandomIntInclusive(0, 100) <= consistency);

			if(multiplier > 0){
				if(pitch && (pitch.pitchType === pitchConstants.PITCH_TYPES.FASTBALL)){
					delta = (pitch.pitchVelocity * multiplier);
				}
				else{
					delta = (rating * multiplier);
				}

				delta *= aidedByConsistency ? 1 : -1;
				rating = (rating + delta);
			}

			return rating;
		}

		function isPitchInStrikeZone(pitchLocation){
			return (pitchLocation.indexOf('S') == 0);
		}

		function pitcherCountPosition(balls, strikes){
			//even
			if(balls === strikes) return 'even';
			//behind
			//3-2 count is considered behind for pitcher (via fangraphs)
			else if(balls > strikes) return 'behind';
			//ahead
			else if(balls < strikes) return 'ahead';
		}

		function batterCountPosition(balls, strikes){
			//even
			if(balls === strikes) return 'even';
			//behind
			//3-2 count is considered ahead for batter (via fangraphs)
			else if(balls > strikes) return 'ahead';
			//ahead
			else if(balls < strikes) return 'behind';
		}

		function getX2Y2(x1, y1, distance, angle){
    		return {
					x : x1 + (distance * Math.cos(angle)),
					y : y1 + (distance * Math.sin(angle))
				};
    	}

    	function getAngleBetweenTwoPoints(startXY, endXY){
			var subtractFromX = false;
    		var subtractFromY = false;
    		var atanX = 0;
    		var atanY = 0;

			if(endXY.x < startXY.x){
				subtractFromX = true;
				atanX = (Math.abs(endXY.x - startXY.x) * -1);
			}
			else{
				atanX = (endXY.x - startXY.x);
			}

			if(endXY.y < startXY.y){ 
				subtractFromY = true;
				atanY = (Math.abs(endXY.y - startXY.y) * -1);
			}
			else{
				atanY = (endXY.y - startXY.y);
			}


			return Math.atan2(atanY, atanX);
		}

    	function getDistance(start, end){
        	return Math.sqrt((Math.pow(end.x - start.x, 2)) + (Math.pow(end.y - start.y, 2)));
    	}

    	function convertToRadians(angle){
		    return (angle * (Math.PI / 180));
		}

		function RISP(runners){
			return ((runners != 0) && (runners != 1));
		}

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

		function mphToFps(mph){
			return (mph * 1.466668);
		}

		function roundDownToNearest5(x){
    		return (Math.floor(x / 5) * 5);
		}

		function checkForFieldersChoice(fieldingResults){
			//if batter wasn't caught out, there was an attempt on a base, and a play could have been made at base batter advanced to
			if(fieldingResults.baseBatterAdvancedTo && fieldingResults.firstThrowToBase && fieldingResults.playToBeMadeOnBatter){

				//first throw was not to batter's base
				if(fieldingResults.baseBatterAdvancedTo != fieldingResults.firstThrowToBase){

					//second throw was not to batter's base either
					if(fieldingResults.secondThrowToBase && fieldingResults.baseBatterAdvancedTo != fieldingResults.secondThrowToBase){
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

		function GIDP(battingResults, baseRunningResults){
			return ((battingResults.battedBallType === battingConstants.BATTED_BALL_TYPES.GROUND_BALL) 
				&& (baseRunningResults.firstAttemptRunnerSafe === false) && (baseRunningResults.secondAttemptRunnerSafe === false));
		}

		function validRBI(batter, battingResults, fieldingResults, baseRunningResults, currOffenseScore, prevOffenseScore){
			return (battingResults.putIntoPlay && !fieldingResults.errorOnPlay && (currOffenseScore !== prevOffenseScore) && !GIDP(battingResults, baseRunningResults));
		}

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

		function validAtBat(battingResults, fieldingResults, sacrificeFly){
			return (!battingResults.hitByPitchOrWalk && !sacrificeFly && !fieldingResults.sacrificeBunt) /*OR REACH ON INTERFERANCE*/;
		}

		function translatePitchLocationForPlayByPlay(location){
			var inZone = isPitchInStrikeZone(location);
			var locationCode = (((location.length === 2) || inZone) ? location : location.substring(1, 2));
			var locations = (inZone ? pitchConstants.IN_ZONE_PLAY_CALL_LOCATIONS : pitchConstants.OUT_OF_ZONE_PLAY_CALL_LOCATIONS);

			return locations[locationCode];
		}

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