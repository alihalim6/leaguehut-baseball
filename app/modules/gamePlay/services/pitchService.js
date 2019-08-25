module.exports = function(module){
	module.service('pitchService', pitchService);

	pitchService.$inject = ['appUtility', 'gamePlayService', 'pitchConstants', 'appConstants'];

	function pitchService(appUtility, gamePlayService, pitchConstants, appConstants){
		var __ = appUtility;
		var pitch = {};
		var pitcher = {};
		var batter = {};

		var api = {
			generatePitch: generatePitch
		};

		return api;

		function determineNonFbVelocity(pitchType){
			if(pitchType === pitchConstants.PITCH_TYPES.SLIDER){
				//avg FB-SL diff is 10.06
				return pitcher.fastball - pitchConstants.AVG_SL_VELOCITY_REL_TO_FB;
			}
			else if(pitchType === pitchConstants.PITCH_TYPES.CURVEBALL){
				//14.55
				return pitcher.fastball - pitchConstants.AVG_CB_VELOCITY_REL_TO_FB;
			}
			else{
				//9.87
				return pitcher.fastball - pitchConstants.AVG_CU_VELOCITY_REL_TO_FB;
			}
		}

		function generateVelocity(velocity){
			var delta = chance.bool() ? 1 : -1;

			if(pitcher.consistency < pitchConstants.CON_TIER_3_MIN){
				velocity += (delta * __.getRandomIntInclusive(0, 4));
			}			
			else if(pitcher.consistency < pitchConstants.CON_TIER_2_MIN){
				velocity += (delta * __.getRandomIntInclusive(0, 3));
			}			
			else if(pitcher.consistency < pitchConstants.CON_TIER_1_MIN){
				velocity += (delta * __.getRandomIntInclusive(0, 2));
			}			
			else{
				velocity += (delta * __.getRandomIntInclusive(0, 1));
			}			

			return velocity;
		}

		function applyCountLogicToPitchLoc(determinedLocation, locAtIndexAbove, locAtIndexBelow){
			var countPitchPercs = pitchConstants.COUNT_PITCH_PERCENTAGES[pitch.atBatHandedness];
			var percentagesForBallCount = countPitchPercs[gamePlayService.balls()];
			var avgInZoneForCount = percentagesForBallCount[gamePlayService.strikes()];
			var pitchInStrikeZone = __.isPitchInStrikeZone(determinedLocation.location);
			var countLogicNum = 0;
			var pitchShouldBeInZone = false;
			var indexDifference = 0;
			var finalLocation = determinedLocation;
			
			countLogicNum = __.getRandomDecimalInclusive(0, 100, 1);
			pitchShouldBeInZone = countLogicNum <= avgInZoneForCount;
			
			//determined loc agrees, set that as pitch
			if((pitchInStrikeZone && pitchShouldBeInZone) || (!pitchInStrikeZone && !pitchShouldBeInZone)){
				//do nothing, already defaulting to originally determined loc
			}
			else{
				//check neighboring locs for if they agree

				if((locAtIndexAbove.location && __.isPitchInStrikeZone(locAtIndexAbove.location) && pitchInStrikeZone) || 
				  	(locAtIndexAbove.location && !__.isPitchInStrikeZone(locAtIndexAbove.location) && !pitchInStrikeZone)){
					finalLocation = locAtIndexAbove;
					indexDifference = determinedLocation.index - locAtIndexAbove.index;
				}
				
				if((locAtIndexBelow.location && __.isPitchInStrikeZone(locAtIndexBelow.location) && pitchInStrikeZone) || 
				  	(locAtIndexBelow.location && !__.isPitchInStrikeZone(locAtIndexBelow.location) && !pitchInStrikeZone)){
					//only set to this loc if it's index is closer to the orig randomly generated num than locAtIndexAbove's index
					//OR if locAtIndexAbove wasn't set to be the location
					if(indexDifference > Math.abs(determinedLocation.index - locAtIndexBelow.index) || !indexDifference){
						finalLocation = locAtIndexBelow;
					}
				}
			}
			
			pitch.location = finalLocation.location;
			pitch.swingPerc = finalLocation.swingPerc;
			pitch.contactPerc = finalLocation.contactPerc;
			pitch.cStrikePerc = finalLocation.cStrikePerc;

			//for pitch type logic
			pitch.pitchTypePercentages = finalLocation.pitchTypePerc;
			pitch.pitchTypeSwingPercentages = finalLocation.pitchTypeSwingPerc;

			return;
		}

		function determineLocationAndMore(){
			var location = __.getRandomDecimalInclusive(0, 100, 1);
			var locationValues;
			var countPosition = __.pitcherCountPosition(gamePlayService.balls(), gamePlayService.strikes());
			var pitchTypeIndex = 0;
			var maxCountLogicPercentage = 0;

			//************* as batter, vs (e.g.) L as L *************

			if((pitcher.handedness === appConstants.LEFT) && (batter.handedness === appConstants.LEFT)){
				pitch.atBatHandedness = 'LL';
				locationValues = pitchConstants.LL_PITCH;
			}
			else if((pitcher.handedness === appConstants.RIGHT) && (batter.handedness === appConstants.LEFT)){
				pitch.atBatHandedness = 'RL';
				locationValues = pitchConstants.RL_PITCH;
			}
			else if((pitcher.handedness === appConstants.LEFT) && (batter.handedness === appConstants.RIGHT)){
				pitch.atBatHandedness = 'LR';
				locationValues = pitchConstants.LR_PITCH;
			}
			else if((pitcher.handedness === appConstants.RIGHT) && (batter.handedness === appConstants.RIGHT)){
				pitch.atBatHandedness = 'RR';
				locationValues = pitchConstants.RR_PITCH;
			}
	
			for(var i = 0; i < locationValues.length; i++){
				if(location <= locationValues[i].index){
					var determinedLocation = {
						location : locationValues[i].location,
						swingPerc : locationValues[i].swing,
						contactPerc : locationValues[i].contact,
						cStrikePerc : locationValues[i].cStrike,
						index : location,
						pitchTypePerc : locationValues[i].pitchTypePerc,
						pitchTypeSwingPerc : locationValues[i].pitchTypeSwingPerc
					};

					var locAtIndexAbove = {
						location: "",
						swingPerc: "",
						contactPerc: "",
						cStrikePerc: "",
						index: "",
						pitchTypePerc: null,
						pitchTypeSwingPerc: null
					};

					var locAtIndexBelow = {
						location: "",
						swingPerc: "",
						contactPerc: "",
						cStrikePerc: "",
						index: "",
						pitchTypePerc: null,
						pitchTypeSwingPerc: null
					};

					//not first location
					if(i > 0){
						locAtIndexAbove.location = locationValues[i - 1].location;
						locAtIndexAbove.swingPerc = locationValues[i - 1].swing;
						locAtIndexAbove.contactPerc = locationValues[i - 1].contact;
						locAtIndexAbove.cStrikePerc = locationValues[i - 1].cStrike;
						locAtIndexAbove.index = locationValues[i - 1].index;
						locAtIndexAbove.pitchTypePerc = locationValues[i - 1].pitchTypePerc;
						locAtIndexAbove.pitchTypeSwingPerc = locationValues[i - 1].pitchTypeSwingPerc;
					}

					//not last location
					if(i !== (locationValues.length - 1)){
						locAtIndexBelow.location = locationValues[i + 1].location;
						locAtIndexBelow.swingPerc = locationValues[i + 1].swing;
						locAtIndexBelow.contactPerc = locationValues[i + 1].contact;
						locAtIndexBelow.cStrikePerc = locationValues[i + 1].cStrike;
						locAtIndexBelow.index = locationValues[i + 1].index;
						locAtIndexBelow.pitchTypePerc = locationValues[i + 1].pitchTypePerc;
						locAtIndexBelow.pitchTypeSwingPerc = locationValues[i + 1].pitchTypeSwingPerc;
					}

					//get avg % pitch is in or out of zone for this count
					//generate random num for whether pitch should be in zone/out of zone
					//if above determined loc already agrees, do nothing
					//else look at the locations at index below and above (if they are defined) and see if they agree
					//grab the closer (index-wise) agreeing location (if either agree; if not, do nothing)
					applyCountLogicToPitchLoc(determinedLocation, locAtIndexAbove, locAtIndexBelow);

					//only consider pitches pithcer throws for type count logic
					_.each(pitch.pitchTypePercentages, function(pitchTypeCountPercentages, pitchType){
						var pitchTypePercProperty = pitchConstants.PITCH_TYPE_PERCENTAGES[pitchType];
						var pitcherThrowsPitch = (pitcher[pitchTypePercProperty] > 0);

						if(pitcherThrowsPitch) maxCountLogicPercentage += pitchTypeCountPercentages[countPosition];
					});

					pitch.countLogicNum = __.getRandomDecimalInclusive(0, maxCountLogicPercentage, 1);
					
					_.each(pitch.pitchTypePercentages, function(pitchTypeCountPercentages, pitchType){
						var pitchTypePercProperty = pitchConstants.PITCH_TYPE_PERCENTAGES[pitchType];
						var pitcherThrowsPitch = (pitcher[pitchTypePercProperty] > 0);

						if(pitcherThrowsPitch){
							pitchTypeIndex += pitchTypeCountPercentages[countPosition];

							if(pitch.countLogicNum <= pitchTypeIndex){
								pitch.countLogicPitchType = pitchType;

								return false;
							}
						}
					});

					return pitch.location;
				}
			}

		}

		function countLogicOverridesArsenal(pitchTypeNum, arsenalPercentage, arsenalPercentageMin, arsenalPercentageMax){
			var adjustedPitchTypeNum = ((pitch.countLogicNum + pitchTypeNum) / 2);
			var belowMin = adjustedPitchTypeNum <= arsenalPercentageMin;
			var aboveMax = adjustedPitchTypeNum > arsenalPercentageMax;

			return (belowMin || aboveMax) && arsenalPercentage > 0;	
		}

		function checkForHitByPitch(){
			if(_.includes(pitchConstants.HBP_LOCATIONS, pitch.location)){
				//more chance of happening if quality is lower

				var hitByPitchChance = pitchConstants.HIT_BY_PITCH;
				var hitByPitchNum = __.getRandomDecimalInclusive(0, 100, 2);
				var hitByPitchQualityNum = __.getRandomDecimalInclusive(pitchConstants.MIN_QUAL_FOR_HBP_CHECK, pitchConstants.MAX_QUAL_FOR_HBP_CHECK, 2);
				var pitchQualityIsLowEnough = hitByPitchQualityNum > pitch.pitchQuality;
				var hitByPitchDelta = (__.get100minusAttribute(pitch.pitchQuality) * pitchConstants.QUAL_HBP_MULTIPLIER);
				hitByPitchDelta *= pitchQualityIsLowEnough ? 1 : -1;
				hitByPitchChance += hitByPitchDelta;
				pitch.hitByPitch = (hitByPitchNum <= hitByPitchChance);
			}
		}

		function generatePitch(){
			//clear out pitch from last play
			pitch = {};

			pitcher = gamePlayService.getPitcher();
			batter = gamePlayService.getBatter();
			var pitchTypeNum = __.getRandomDecimalInclusive(0, 100, 2);
			var location = determineLocationAndMore();
			var velocity = 0;
			var pitchRating = 0;
			var finalPitchType = '';
			var arsenalPercentage = 0;
			var arsenalPercentageMin = 0;
			var arsenalPercentageMax = 0;
			var breakingBallQuality = __.determineQualityOrBatterPitchID(pitcher.breakingBall, pitcher.consistency, pitch, true);

			var pitchTypes = {
				FB : {
					velocity : generateVelocity(pitcher.fastball),
					quality : __.determineQualityOrBatterPitchID(pitcher.fastball, pitcher.consistency, pitch, true)
				},
				SL : {
					velocity : generateVelocity(determineNonFbVelocity(pitchConstants.PITCH_TYPES.SLIDER)),
					quality : breakingBallQuality,
					pitchSubType : pitchConstants.PITCH_TYPES.SLIDER
				},
				CB : {
					velocity : generateVelocity(determineNonFbVelocity(pitchConstants.PITCH_TYPES.CURVEBALL)),
					quality : breakingBallQuality,
					pitchSubType: pitchConstants.PITCH_TYPES.CURVEBALL
				},
				CU : {
					velocity : generateVelocity(determineNonFbVelocity(pitchConstants.PITCH_TYPES.CHANGEUP)),
					quality : __.determineQualityOrBatterPitchID(pitcher.changeup, pitcher.consistency, pitch, true)
				}
			};

			if(pitchTypeNum <= pitcher.fastballPercentage){
				arsenalPercentage = pitcher.fastballPercentage;
				arsenalPercentageMin = 0;
				arsenalPercentageMax = pitcher.fastballPercentage;
				finalPitchType = pitchConstants.PITCH_TYPES.FASTBALL;
			}
			else if(pitchTypeNum <= pitcher.fastballPercentage + pitcher.sliderPercentage){
				arsenalPercentage = pitcher.sliderPercentage;
				arsenalPercentageMin = pitcher.fastballPercentage;
				arsenalPercentageMax = arsenalPercentageMin + pitcher.sliderPercentage;
				finalPitchType = pitchConstants.PITCH_TYPES.SLIDER;
			}
			else if(pitchTypeNum <= pitcher.fastballPercentage + pitcher.sliderPercentage + pitcher.curveballPercentage){
				arsenalPercentage = pitcher.curveballPercentage;
				arsenalPercentageMin = pitcher.fastballPercentage + pitcher.sliderPercentage;
				arsenalPercentageMax = arsenalPercentageMin + pitcher.curveballPercentage;
				finalPitchType = pitchConstants.PITCH_TYPES.CURVEBALL;
			}
			else{
				arsenalPercentage = pitcher.CUperc;
				arsenalPercentageMin = pitcher.fastballPercentage + pitcher.sliderPercentage + pitcher.curveballPercentage;
				arsenalPercentageMax = pitchConstants.MAX_ARSENAL_PERCENTAGE;//if count logic pulls arsenal num any higher, make sure to stay as CU (some arsenals add up to a little above 100)
				finalPitchType = pitchConstants.PITCH_TYPES.CHANGEUP;
			}

			if(countLogicOverridesArsenal(pitchTypeNum, arsenalPercentage, arsenalPercentageMin, arsenalPercentageMax)){
				finalPitchType = pitch.countLogicPitchType;
			}

			if(pitchTypes[finalPitchType].pitchSubType){
				pitch.pitchSubType = pitchTypes[finalPitchType].pitchSubType;
			}

			pitch.pitchType = ((finalPitchType === pitchConstants.PITCH_TYPES.SLIDER) || (finalPitchType === pitchConstants.PITCH_TYPES.CURVEBALL)) ? pitchConstants.PITCH_TYPES.BREAKING_BALL : finalPitchType;
			pitch.pitchVelocity = pitchTypes[finalPitchType].velocity;
			pitch.pitchQuality = pitchTypes[finalPitchType].quality;

			//if throwing o-zone pitch with 3 balls and qual is good enough, determine loc again to try and get a zone to avoid a walk
			if(gamePlayService.balls() === 3 && !__.isPitchInStrikeZone(location) && pitch.pitchQuality > (pitchConstants.MAX_QUAL_FOR_CSTRIKE_CHECK / 2)){
				determineLocationAndMore();
			}

			checkForHitByPitch();

			return pitch;
		}

	}
}