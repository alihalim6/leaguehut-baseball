/**
 * Generates all of the properties of a pitch thrown.
 */
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

		/**
		 * Determines the base velocity of a non-fastball pitch.
		 */
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

		/**
		 * Determines the final velocity of a pitch.
		 */
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

		/**
		 * Applies data-informed logic to the pitch's determined location based on the current count.
		 */
		function applyCountLogicToPitchLoc(determinedLocation, locAtIndexAbove, locAtIndexBelow){
			var countPitchPercs = pitchConstants.COUNT_PITCH_PERCENTAGES[pitch.atBatHandedness];
			var percentagesForBallCount = countPitchPercs[gamePlayService.balls()];
			var avgInZoneForCount = percentagesForBallCount[gamePlayService.strikes()];
			var pitchInStrikeZone = __.isPitchInStrikeZone(determinedLocation.location);
			var countLogicNum = 0;
			var indexDifference = 0;
			var pitchShouldBeInZone = false;			
			var finalLocation = determinedLocation;
			
			countLogicNum = __.getRandomDecimalInclusive(0, 100, 1);
			pitchShouldBeInZone = (countLogicNum <= avgInZoneForCount);
			
			//determined loc agrees
			if((pitchInStrikeZone && pitchShouldBeInZone) || (!pitchInStrikeZone && !pitchShouldBeInZone)){
				//do nothing, defaulting to originally determined loc
			}
			//check neighboring locs
			else{	
				if((locAtIndexAbove.location && __.isPitchInStrikeZone(locAtIndexAbove.location) && pitchInStrikeZone) || 
				  	(locAtIndexAbove.location && !__.isPitchInStrikeZone(locAtIndexAbove.location) && !pitchInStrikeZone)){
					finalLocation = locAtIndexAbove;
					indexDifference = (determinedLocation.index - locAtIndexAbove.index);
				}
				
				if((locAtIndexBelow.location && __.isPitchInStrikeZone(locAtIndexBelow.location) && pitchInStrikeZone) || 
				  	(locAtIndexBelow.location && !__.isPitchInStrikeZone(locAtIndexBelow.location) && !pitchInStrikeZone)){
					//only set to this loc if it's index is closer to the orig randomly generated num than locAtIndexAbove's index
					//OR if locAtIndexAbove wasn't set to be the location
					if((indexDifference > Math.abs(determinedLocation.index - locAtIndexBelow.index)) || !indexDifference){
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
			var pitchTypeIndex = 0;
			var maxCountLogicPercentage = 0;
			//ahead, behind or even
			var countPosition = __.pitcherCountPosition(gamePlayService.balls(), gamePlayService.strikes());

			//as [handedness]-batter vs [pitcher-handedness] (e.g. as L vs L)
			if(pitcher.handedness === appConstants.LEFT) pitch.atBatHandedness = ((batter.handedness === appConstants.RIGHT) ? 'RL' : 'LL');
			else pitch.atBatHandedness = ((batter.handedness === appConstants.RIGHT) ? 'RR' : 'LR');
			
			locationValues = pitchConstants[pitch.atBatHandedness + '_PITCH'];
	
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
						location: '',
						swingPerc: '',
						contactPerc: '',
						cStrikePerc: '',
						index: '',
						pitchTypePerc: null,
						pitchTypeSwingPerc: null
					};

					var locAtIndexBelow = {
						location: '',
						swingPerc: '',
						contactPerc: '',
						cStrikePerc: '',
						index: '',
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

					applyCountLogicToPitchLoc(determinedLocation, locAtIndexAbove, locAtIndexBelow);

					//only consider pitches the pitcher throws for type count logic
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

					//issue seen where this finalPitchType was undefined later on and maybe due to this being undefined so default it to fastball
					if(!pitch.countLogicPitchType) pitch.countLogicPitchType = pitchConstants.PITCH_TYPES.FASTBALL;

					return pitch.location;
				}
			}

		}

		/**
		 * Determines if the pitch type determined by taking the current count into consideration should be set as the final pitch type over the type determined by pitcher's arsenal.
		 */
		function countLogicOverridesArsenal(pitchTypeNum, arsenalPercentage, arsenalPercentageMin, arsenalPercentageMax){
			var adjustedPitchTypeNum = ((pitch.countLogicNum + pitchTypeNum) / 2);
			var belowMin = adjustedPitchTypeNum <= arsenalPercentageMin;
			var aboveMax = adjustedPitchTypeNum > arsenalPercentageMax;

			return ((belowMin || aboveMax) && arsenalPercentage > 0);	
		}

		/**
		 * Determines by chance that the batter is hit by pitch and that the pitch thrown is in a location that would hit the batter.  Lower quality pitches have a higher chance of hitting batter.
		 */
		function checkForHitByPitch(){
			if(_.includes(pitchConstants.HBP_LOCATIONS, pitch.location)){
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

		/**
		 * Creates a pitch and all of its properties for a play.
		 */
		function generatePitch(){
			//clear out pitch from last play
			pitch = {};

			pitcher = gamePlayService.getPitcher();
			batter = gamePlayService.getBatter();
			var pitchTypeNum = __.getRandomDecimalInclusive(0, 100, 2);
			var location = determineLocationAndMore();
			var finalPitchType = '';
			var velocity = 0;
			var pitchRating = 0;
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
			else if(pitchTypeNum <= (pitcher.fastballPercentage + pitcher.sliderPercentage)){
				arsenalPercentage = pitcher.sliderPercentage;
				arsenalPercentageMin = pitcher.fastballPercentage;
				arsenalPercentageMax = arsenalPercentageMin + pitcher.sliderPercentage;
				finalPitchType = pitchConstants.PITCH_TYPES.SLIDER;
			}
			else if(pitchTypeNum <= (pitcher.fastballPercentage + pitcher.sliderPercentage + pitcher.curveballPercentage)){
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

			//issue seen once in a million pitches where finalPitchType was somehow undefined here so default it to fastball
			if(!finalPitchType) pitch.finalPitchType = pitchConstants.PITCH_TYPES.FASTBALL;

			if(pitchTypes[finalPitchType].pitchSubType){
				pitch.pitchSubType = pitchTypes[finalPitchType].pitchSubType;
			}

			pitch.pitchType = ((finalPitchType === pitchConstants.PITCH_TYPES.SLIDER) || (finalPitchType === pitchConstants.PITCH_TYPES.CURVEBALL)) ? pitchConstants.PITCH_TYPES.BREAKING_BALL : finalPitchType;
			pitch.pitchVelocity = pitchTypes[finalPitchType].velocity;
			pitch.pitchQuality = pitchTypes[finalPitchType].quality;

			//if throwing out of zone pitch with 3 balls and quality is good enough, determine loc again to try and get a zone loc to avoid a walk
			if((gamePlayService.balls() === 3) && !__.isPitchInStrikeZone(location) && (pitch.pitchQuality > (pitchConstants.MAX_QUAL_FOR_CSTRIKE_CHECK / 2))){
				determineLocationAndMore();
			}

			checkForHitByPitch();

			return pitch;
		}

	}
}