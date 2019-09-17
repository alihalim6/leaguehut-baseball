/**
 * Generates all of the properties of the batting result of a pitch thrown.
 */
module.exports = function(module){
	module.service('battingService', battingService);

	battingService.$inject = ['appUtility', 'gamePlayService', 'appConstants', 'battingConstants', 'pitchConstants', 'baseRunningService'];

	function battingService(appUtility, gamePlayService, appConstants, battingConstants, pitchConstants, baseRunningService){
		var __ = appUtility;
		var batter = {};
		var pitch = {};
		var battingResults = {};

		var api = {
			handleBatter: handleBatter
		};

		return api;

		/**
		 * Applies data-informed logic to the batter's chance of swinging at the pitch based on the current count.
		 */
		function applyCountLogicToSwingChance(chanceOfSwinging){
			var countSwingPercs;
			var percsForBallCount;
			var avgSwingForCount = 0;
			var difference = 0;

			countSwingPercs = (__.isPitchInStrikeZone(pitch.location) ? battingConstants.COUNT_SWING_PERCS.zone[pitch.atBatHandedness] : battingConstants.COUNT_SWING_PERCS.o_zone[pitch.atBatHandedness]);
			percsForBallCount = countSwingPercs[gamePlayService.balls()];
			avgSwingForCount = percsForBallCount[gamePlayService.strikes()];
			difference = (Math.abs(chanceOfSwinging - avgSwingForCount) / battingConstants.LOGIC_SWING_CHANCE_DIVIDER);//bring the chance of swinging COUNT_LOGIC_SWING_CHANCE_DIVIDER to the avg swing perc for this count
			difference = ((chanceOfSwinging > avgSwingForCount) ? difference : (difference * -1));

			return (chanceOfSwinging + difference);
		}

		/**
		 * Applies data-informed logic to the batter's chance of swinging at the pitch based on the pitch type.
		 */
		function applyPitchTypeLogicToSwingChance(chanceOfSwinging){
			var countPosition = __.batterCountPosition(gamePlayService.balls(), gamePlayService.strikes());//ahead, behind or even
			var pitchType = (pitch.pitchSubType ? pitch.pitchSubType : pitch.pitchType);
			var pitchTypeSwingPercentages = pitch.pitchTypeSwingPercentages[pitchType];
			var pitchTypeSwingChance = pitchTypeSwingPercentages[countPosition];
			var difference = (Math.abs(chanceOfSwinging - pitchTypeSwingChance) / battingConstants.LOGIC_SWING_CHANCE_DIVIDER);//bring the chance of swinging LOGIC_SWING_CHANCE_DIVIDER to the avg swing perc for this pitch type/count position
			difference = ((chanceOfSwinging > pitchTypeSwingChance) ? difference : (difference * -1));

			return (chanceOfSwinging + difference);
		}

		/**
		 * Applies data-informed logic to the batter's chance of swinging at the pitch based on there being two strikes in the current count.
		 */
		function applyTwoStrikeCountLogicToSwingChance(idDifference){
			var positiveId = battingResults.positiveId;
			var pitchInStrikeZone = __.isPitchInStrikeZone(pitch.location);
			var negativeCloseOnZone = (!positiveId && pitchInStrikeZone && (idDifference <= battingConstants.BATTER_CLOSE_NEG_ID_MAX));
			var likelySwingAndMissThreshold = (pitchInStrikeZone ? battingConstants.IN_ZONE_LIKELY_SWING_MISS_THRESHHOLD : battingConstants.OUT_OF_ZONE_LIKELY_SWING_MISS_THRESHHOLD);
			var negativeNotClose = (!positiveId && (idDifference > likelySwingAndMissThreshold));
			var positiveOnZone = (positiveId && pitchInStrikeZone);
			battingResults.likelySwingAndMiss = negativeNotClose;

			//if in-zone pitch seen well enough, batter is more lkely to swing to avoid a strikeout looking OR
			//pitch thrown well enough to increase chance that batter chases
			if(positiveOnZone || negativeCloseOnZone || negativeNotClose){
				var oneHundredMinusFinalChance = __.get100minusAttribute(battingResults.chanceOfSwinging);
				var chanceOfSwingingPostIncrease = (battingResults.chanceOfSwinging + __.getRandomDecimalInclusive(oneHundredMinusFinalChance - battingConstants.SWING_INCREASE_MIN_SUBTRACTER, oneHundredMinusFinalChance, 1));

				battingResults.chanceOfSwinging = chanceOfSwingingPostIncrease;
			}
		}

		/**
		 * Determines how likely batter is to swing at a pitch.
		 */
		function generateSwingLikeliness(idDifference, stealAttempt){
			var multiplier = 0;
			var delta = 0;
			var adjustedPTSdetla = 0;
			var chanceOfSwinging = 0;
			var adjustedPTS = batter.propensityToSwing;
			var pitchInStrikeZone = __.isPitchInStrikeZone(pitch.location);
			var moreLikelyToSwing = battingResults.positiveId;
			var likelyToChase = false;
			var guaranteeSwing = false;

			if(!pitchInStrikeZone){
				//positively identified pitch outside the zone;
				//check to see if more likely to swing at it instead of taking the BALL depending on aggression
				if(battingResults.positiveId){
					//random number only to PTS_MODIFIER to lessen the effect of batters with low PTS not swinging often
					moreLikelyToSwing = (__.getRandomIntInclusive(0, battingConstants.PTS_MODIFIER) <= batter.propensityToSwing);
				}

				//pitch outsize of zone not seen well;
				//more aware batters will be less likely to swing so as to take a BALL (not chase)
				else{
					moreLikelyToSwing = (idDifference > battingConstants.BATTER_ID_MORE_LIKELY_SWING_MIN);
					likelyToChase = moreLikelyToSwing;
				}
			}

			//pitch in zone not seen well;
			//more aware batters will be more likely to swing so as to try and not get a STRIKE looking
			else if(!battingResults.positiveId){
				moreLikelyToSwing = ((idDifference <= battingConstants.BATTER_ID_MORE_LIKELY_SWING_DIFF_MAX) && (__.getRandomIntInclusive(0, 100) <= __.getRandomIntInclusive(0, batter.awareness)));
			}
			//pitch in zone seen well
			else{
				guaranteeSwing = true;
			}

			adjustedPTSdetla = ((moreLikelyToSwing ? batter.propensityToSwing : __.get100minusAttribute(batter.propensityToSwing)) * battingConstants.BATTER_MULTIPLIER);

			if(moreLikelyToSwing){
				adjustedPTS = ((batter.propensityToSwing + Math.floor(adjustedPTSdetla) > 100) ? 100 : (batter.propensityToSwing + Math.floor(adjustedPTSdetla)));
				multiplier = (__.getRandomIntInclusive(0, batter.propensityToSwing) + (idDifference / battingConstants.BATTER_ID_DIFF_DIVIDER));
			}
			else{
				adjustedPTS = ((batter.propensityToSwing - Math.ceil(adjustedPTSdetla)) < 0) ?  0 : (batter.propensityToSwing - Math.ceil(adjustedPTSdetla));
				multiplier = Math.abs(__.getRandomIntInclusive(0, __.get100minusAttribute(batter.propensityToSwing)) - (idDifference / battingConstants.BATTER_ID_DIFF_DIVIDER));
			}

			delta = (Math.abs(adjustedPTS - battingConstants.ADJUSTED_PTS_SUBTRACTOR) * (multiplier * battingConstants.BATTER_MULTIPLIER));

			if(delta) delta = (moreLikelyToSwing ? delta : (delta * -1));	

			chanceOfSwinging = (pitch.swingPerc + delta);
			chanceOfSwinging = applyCountLogicToSwingChance(chanceOfSwinging);			
			chanceOfSwinging = applyPitchTypeLogicToSwingChance(chanceOfSwinging);

			if(guaranteeSwing) chanceOfSwinging = 100;

			chanceOfSwinging = ((chanceOfSwinging > 100) ? 100 : chanceOfSwinging);
			chanceOfSwinging = ((chanceOfSwinging < 0) ? 0 : chanceOfSwinging);

			//increase chance of swinging for batter if determined chance is low but they are likely to chase
			if((chanceOfSwinging <= battingConstants.BATTER_SWING_CHASE_CHANCE_MAX) && likelyToChase){
				var oneHundredMinusFinalChance = __.get100minusAttribute(chanceOfSwinging);
				chanceOfSwinging += __.getRandomDecimalInclusive((oneHundredMinusFinalChance - battingConstants.BATTER_SWING_CHASE_MAX), (oneHundredMinusFinalChance - battingConstants.BATTER_SWING_CHASE_MIN), 1);
			}

			battingResults.chanceOfSwinging = chanceOfSwinging;

			if((gamePlayService.strikes() === 2) && !guaranteeSwing){
				applyTwoStrikeCountLogicToSwingChance(idDifference);
			}

			//decrease chance of swinging if base steal is set to be attempted
			if(stealAttempt) battingResults.chanceOfSwinging /= battingConstants.STEAL_ON_PLAY_SWING_CHANCE_DIVIDER;
		}

		/**
		 * Determines how likely batter is to make contact with a pitch he swings at.
		 */
		function generateContactLikeliness(idDifference){
			var positiveId = battingResults.positiveId;
			var multiplier = (idDifference * (positiveId ? battingConstants.SWING_CONTACT_ID_MULTIPLIER : -battingConstants.SWING_CONTACT_ID_MULTIPLIER));
			var alphaNum = __.getRandomIntInclusive(0, battingConstants.SWING_CONTACT_ALPHA_NUM_MAX);			
			var alpha = (alphaNum * (idDifference * battingConstants.BATTER_MULTIPLIER));
			var avgContactPerc = pitch.contactPerc;
			var aidedByConsistency = (__.getRandomIntInclusive(0, 100) <= __.getRandomIntInclusive(0, batter.consistency));
			var beta = (__.getRandomIntInclusive(0, batter.awareness) * battingConstants.SWING_CONTACT_DELTA_MULTIPLIER);
			var gamma = (__.getRandomIntInclusive(0, __.get100minusAttribute(batter.awareness)) * battingConstants.SWING_CONTACT_DELTA_MULTIPLIER);
			var delta = 0;

			//increase likelihood of contact
			if(aidedByConsistency || positiveId || (!positiveId && idDifference <= battingConstants.SWING_CONTACT_ID_DIFF_MAX)){
				delta = (((alphaNum + alpha) > __.get100minusAttribute(batter.consistency)) ? (multiplier + beta) : (multiplier - gamma));
				battingResults.chanceOfContact = (((avgContactPerc + delta) > 100) ? 100 : (avgContactPerc + delta));
			}
			//decrease likelihood
			else{
				if(delta < 0) delta = Math.abs(((alphaNum + alpha) <= batter.consistency) ? (multiplier - beta) : (multiplier + gamma));
				//if positive, flip into negative so that it is ADDED to chance of contact
				else delta *= -1;
				
				battingResults.chanceOfContact = (((avgContactPerc - delta) < 0) ? 0 : (avgContactPerc - delta));
			}

			if(battingResults.likelySwingAndMiss) battingResults.chanceOfContact = __.getRandomDecimalInclusive(0, battingConstants.LIKELY_SWING_MISS_CONTACT_CHANCE_MAX, 1);
		}

		/**
		 * Determines if the contacted ball is a ground ball, fly ball, line drive, or popup, as well as the direction it's hit.
		 */
		function determineBattedBallTypeAndDirection(distTypeConstants, distDirectionConstants){
			var foulPlayable = battingResults.fouledBallPlayable;
			var fieldSectionNum = __.getRandomDecimalInclusive(0, 100, 1);
			var pullPerc = (foulPlayable ? distDirectionConstants.FOUL_PULL_PERC : distDirectionConstants.PULL_PERC);
			var midPerc = (foulPlayable ? distDirectionConstants.FOUL_BEHIND_PERC : distDirectionConstants.CENTER_PERC);
			var oppoPerc = (foulPlayable ? distDirectionConstants.FOUL_OPPO_PERC : distDirectionConstants.OPPO_PERC);
			//playable foul balls are only popups or fly balls so set random percentage range to GB-FlyB for them then set pitch to be a PU
			var battedBallTypeNum = __.getRandomDecimalInclusive((foulPlayable ? distTypeConstants.GB_PERC : 0), (foulPlayable ? (distTypeConstants.GB_PERC + distTypeConstants.FLYB_PERC) : 100), 1);

			if(battedBallTypeNum <= distTypeConstants.GB_PERC){
				battingResults.battedBallType = battingConstants.BATTED_BALL_TYPES.GROUND_BALL;
			}
			else if(battedBallTypeNum <= (distTypeConstants.GB_PERC + distTypeConstants.FLYB_PERC)){
				var popUpNum = (foulPlayable ? 0 : __.getRandomDecimalInclusive(0, 100, 1));
				battingResults.battedBallType = battingConstants.BATTED_BALL_TYPES.FLY_BALL;
				
				if(popUpNum <= distTypeConstants.IFFB_PERC){
					battingResults.battedBallType = battingConstants.BATTED_BALL_TYPES.POPUP;
				}
			}
			else{
				battingResults.battedBallType = battingConstants.BATTED_BALL_TYPES.LINE_DRIVE;
			}

			if(fieldSectionNum <= pullPerc){
				battingResults.fieldSectionHitTo = battingConstants.FIELD_SECTIONS.PULL;
			}
			else if(fieldSectionNum <= (pullPerc + midPerc)){
				battingResults.fieldSectionHitTo = battingConstants.FIELD_SECTIONS.CENTER;
			}
			else{
				battingResults.fieldSectionHitTo = battingConstants.FIELD_SECTIONS.OPPOSITE;
			}
		}

		/**
		 * Determines how far the ball is hit by evaluating the batter's hit power in relation to a tier determined by chance for this play.
		 */
		function determineHitDistance(distConstants, idDifference){
			var hitPowerTier;
			var thisHitTier;
			var distancesForPitchType;
			var distancesForBallType;
			var distancesForTier;
			var pitchType = pitch.pitchType;
			
			//determine distance later (after angle is set) if playable foul ball
			if(battingResults.fouledBallPlayable){
				battingResults.pitchTypeSeen = pitchType;
				battingResults.distConstants = distConstants;

				return;
			}

			//1 is the highest tier (most distance), 4 is lowest

			//'a' represents default tier for batter (their hit power), 'b', 'c' and 'd' the other 3 tiers
			thisHitTier = chance.character({pool: 'aaaaabbbccd'});

			//WEAK HIT
			if(((thisHitTier === 'a') && (batter.hitPower < battingConstants.HTP_TIER_3_MIN)) //weak hitter in their default tier
				|| ((thisHitTier === 'b') && (batter.hitPower < battingConstants.HTP_TIER_2_MIN)) //ok or weak hitter with weak hit
				|| ((thisHitTier === 'd') && (batter.hitPower >= battingConstants.HTP_TIER_2_MIN))){ //good or power hitter with weak hit

				hitPowerTier = 4;
			}

			//OK HIT
			else if(((thisHitTier === 'a') && (batter.hitPower < battingConstants.HTP_TIER_2_MIN)) //ok hitter in their default tier
				|| ((thisHitTier === 'b') && ((batter.hitPower >= battingConstants.HTP_TIER_2_MIN) && (batter.hitPower < battingConstants.HTP_TIER_1_MIN))) //good hitter with ok hit
				|| ((thisHitTier === 'c') && ((batter.hitPower >= battingConstants.HTP_TIER_1_MIN) || (batter.hitPower < battingConstants.HTP_TIER_3_MIN)))){ //power or weak hitter with ok hit

				hitPowerTier = 3;
			}

			//GOOD HIT
			else if(((thisHitTier === 'a') && (batter.hitPower < battingConstants.HTP_TIER_1_MIN)) //good hitter in their default tier
				|| ((thisHitTier === 'b') && (batter.hitPower >= battingConstants.HTP_TIER_1_MIN)) //power hitter with good hit
				|| ((thisHitTier === 'c') && ((batter.hitPower >= battingConstants.HTP_TIER_3_MIN) && (batter.hitPower < battingConstants.HTP_TIER_2_MIN))) //ok hitter with good hit
				|| ((thisHitTier === 'd') && (batter.hitPower < battingConstants.HTP_TIER_3_MIN))){ //weak hitter with good hit

				hitPowerTier = 2;
			}

			//POWER HIT
			else{
				hitPowerTier = 1;

				//idDifference is abs value, so e.g. down 30 on the pitch, that is greater than the min so knock down to tier 2
				if(!battingResults.positiveId && (idDifference > battingConstants.POWER_HIT_ID_DIFF_MIN)){
					hitPowerTier = 2;
				}
			}

			//shorter distances
			if((battingResults.battedBallType === battingConstants.BATTED_BALL_TYPES.GROUND_BALL) || (battingResults.battedBallType === battingConstants.BATTED_BALL_TYPES.POPUP)){
				distancesForPitchType = distConstants[battingResults.battedBallType];
				battingResults.hitDistance = __.getRandomIntInclusive(distancesForPitchType[pitchType].min, distancesForPitchType[pitchType].max);
			}
			//further
			else if((battingResults.battedBallType === battingConstants.BATTED_BALL_TYPES.FLY_BALL) || (battingResults.battedBallType === battingConstants.BATTED_BALL_TYPES.LINE_DRIVE)){
				distancesForBallType = distConstants[battingResults.battedBallType];
				distancesForPitchType = distancesForBallType[pitchType];
				distancesForTier = distancesForPitchType[hitPowerTier - 1];
				battingResults.hitDistance = __.getRandomIntInclusive(distancesForTier.min, distancesForTier.max);
			}
			
		}

		/**
		 * Generates the properties of the action taken on the pitch thrown.
		 */
		function handleBatter(_pitch, stealAttempt){
			//clear out batter results from last play
			battingResults = {};			
			
			batter = gamePlayService.getBatter();
			pitch = _pitch;

			var batterID = __.determineQualityOrBatterPitchID(batter.awareness, batter.consistency);
			var positiveId = false;
			var swung = false;
			var contactMade = false;
			var putIntoPlay = false;
			var clearBases = false;
			var advanceRunner = false;
			var swingLikelinessNum = __.getRandomDecimalInclusive(0, 100, 2);
			var contactLikelinessNum = __.getRandomDecimalInclusive(0, 100, 2);
			var idDifference;
			var hitByPitchOrWalk;

			battingResults.batterPitchIdentification = batterID;
			idDifference = Math.abs(batterID - pitch.pitchQuality);
			battingResults.positiveId = (batterID >= pitch.pitchQuality);

			generateSwingLikeliness(idDifference, stealAttempt);
			swung = (swingLikelinessNum <= battingResults.chanceOfSwinging);
			
			if(!pitch.hitByPitch){
				battingResults.swung = swung;

				if(swung){
					generateContactLikeliness(idDifference);
					contactMade = (contactLikelinessNum <= battingResults.chanceOfContact);
					battingResults.contactMade = contactMade;

					if(contactMade){
						putIntoPlay = (__.getRandomDecimalInclusive(0, 100, 1) <= battingConstants.PERC_CONTACTED_PUT_INTO_PLAY);
						battingResults.fouledBallPlayable = (!putIntoPlay && (__.getRandomDecimalInclusive(0, 100, 1) <= battingConstants.PERC_FOULED_CAUGHT_FOR_OUT));

						//put into play
						if(putIntoPlay || battingResults.fouledBallPlayable){
							battingResults.putIntoPlay = true;
							battingResults.plateAppearanceEnded = !battingResults.fouledBallPlayable;

							if(pitch.atBatHandedness === 'LL'){
								determineBattedBallTypeAndDirection(battingConstants.LL_PUT_INTO_PLAY[0], battingConstants.LL_PUT_INTO_PLAY[1]);
								determineHitDistance(battingConstants.LL_PUT_INTO_PLAY[2], idDifference);
							}
							else if(pitch.atBatHandedness === 'RL'){
								determineBattedBallTypeAndDirection(battingConstants.RL_PUT_INTO_PLAY[0], battingConstants.RL_PUT_INTO_PLAY[1]);
								determineHitDistance(battingConstants.RL_PUT_INTO_PLAY[2], idDifference);
							}
							else if(pitch.atBatHandedness === 'LR'){
								determineBattedBallTypeAndDirection(battingConstants.LR_PUT_INTO_PLAY[0], battingConstants.LR_PUT_INTO_PLAY[1]);
								determineHitDistance(battingConstants.LR_PUT_INTO_PLAY[2], idDifference);
							}
							else{
								determineBattedBallTypeAndDirection(battingConstants.RR_PUT_INTO_PLAY[0], battingConstants.RR_PUT_INTO_PLAY[1]);
								determineHitDistance(battingConstants.RR_PUT_INTO_PLAY[2], idDifference);
							}
						}

						//foul
						else{
							battingResults.fouledAway = true;
							gamePlayService.updateCount({addStrike : true, fouledAway : true});
						}
					}
					//swing and miss
					else{
						clearBases = gamePlayService.updateCount({addStrike : true});
						battingResults.struckOutSwinging = (gamePlayService.strikes() === 0);
					}
				}
				//no swing
				else{
					var cStrikePerc = pitch.cStrikePerc;
					var umpireCallNum = __.getRandomDecimalInclusive(0, 100, 2);

					if((cStrikePerc < 100) && (cStrikePerc > 0)){
						var umpireCallQualityNum = __.getRandomDecimalInclusive(pitchConstants.MIN_QUAL_FOR_CSTRIKE_CHECK, pitchConstants.MAX_QUAL_FOR_CSTRIKE_CHECK, 2);
						var aidedByPitchQuality = (umpireCallQualityNum <= pitch.pitchQuality);
						var umpireCallDelta = (pitch.pitchQuality * pitchConstants.QUAL_CSTRIKE_MULTIPLIER);
						umpireCallDelta *= (aidedByPitchQuality ? 1 : -1);
						var finalCalledStrikePerc = (cStrikePerc + umpireCallDelta);
						battingResults.umpireCallOnNonSwing = ((umpireCallNum <= finalCalledStrikePerc) ? appConstants.STRIKE : appConstants.BALL);
					}
					else{
						battingResults.umpireCallOnNonSwing = ((cStrikePerc === 100) ? appConstants.STRIKE : appConstants.BALL);
					}

					if(battingResults.umpireCallOnNonSwing === appConstants.BALL){
						advanceRunner = gamePlayService.updateCount({addBall : true});
						hitByPitchOrWalk = appConstants.WALK;
						battingResults.walked = advanceRunner;
					}
					else{
						clearBases = gamePlayService.updateCount({addStrike : true});
						battingResults.struckOutLooking = (gamePlayService.strikes() === 0);
					}
				}

			}
			//HBP
			else{
				gamePlayService.handleHitByPitch(batter);
				advanceRunner = gamePlayService.updateCount({plateAppearanceEnded : appConstants.HIT_BY_PITCH});
				hitByPitchOrWalk = appConstants.HIT_BY_PITCH;
			}
			
			if(clearBases){
				baseRunningService.setClearBases();
			}
			else if(advanceRunner){
				baseRunningService.startBaseRunners(0, batter);
				battingResults.hitByPitchOrWalk = true;
				baseRunningService.handlePlayAction({hitByPitchOrWalk : hitByPitchOrWalk, batter : batter});
			}

			return battingResults;
		}
	}
}