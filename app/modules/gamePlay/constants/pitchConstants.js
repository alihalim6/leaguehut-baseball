/**
 * Constants related to pitches.
 */
module.exports = function(module){
	var PITCH_ANIMATION_GLOBAL = {
		MIN_TOP: 20,
		MAX_TOP: 252,
		MIN_LEFT: 22,
		MAX_LEFT_LEFT: 70,
		MIN_LEFT_RIGHT: 232,
		MAX_LEFT: 278,

		MAX_TOP_HIGH: 47,
		MIN_TOP_UP: 48,
		MAX_TOP_UP: 109,
		MIN_TOP_MID: 110,
		MAX_TOP_MID: 170,
		MIN_TOP_DOWN: 171,
		MAX_TOP_DOWN: 228,
		MIN_TOP_LOW: 229,
		MAX_TOP_LOW: 252,

		MIN_LEFT_CENTER_LEFT: 71,
		MAX_LEFT_CENTER_LEFT: 125,

		MIN_LEFT_CENTER: 126,
		MAX_LEFT_CENTER: 176,

		MIN_LEFT_CENTER_RIGHT: 177,
		MAX_LEFT_CENTER_RIGHT: 231,

		MAX_TOP_FOR_UP_MISCALLED_BALL: 57,
		MIN_TOP_FOR_DOWN_MISCALLED_BALL: 217,
		MIN_LEFT_FOR_RIGHT_MISCALLED_BALL: 221,
		MAX_LEFT_FOR_LEFT_MISCALLED_BALL: 82,

		MIN_TOP_FOR_HIGH_MISCALLED_STRIKE: 43,
		MIN_LEFT_FOR_LEFT_MISCALLED_STRIKE: 67,
		MAX_TOP_FOR_LOW_MISCALLED_STRIKE: 233,
		MAX_LEFT_FOR_RIGHT_MISCALLED_STRIKE: 236
	};

	module.constant('pitchConstants', {
		GAME_PITCH_COUNT_RANGE: 10,

		CON_TIER_1_MIN : 80,
		CON_TIER_2_MIN : 50,
		CON_TIER_3_MIN : 15,

		AVG_SL_VELOCITY_REL_TO_FB : 8,
		AVG_CB_VELOCITY_REL_TO_FB : 14,
		AVG_CU_VELOCITY_REL_TO_FB : 10,

		MAX_ARSENAL_PERCENTAGE : 102,

		PITCH_QUALITY_MULTIPLIER: 0.0075,
		MAX_QUAL_FOR_CSTRIKE_CHECK : 120,
		MIN_QUAL_FOR_CSTRIKE_CHECK : 50,
		QUAL_CSTRIKE_MULTIPLIER : 0.05,

		HIT_BY_PITCH : 0.24,//% of pitches that hit batter
		HBP_LOCATIONS : ['HI', 'MIU', 'MIM', 'MID', 'LI'],
		MAX_QUAL_FOR_HBP_CHECK : 100,
		MIN_QUAL_FOR_HBP_CHECK : 0,
		QUAL_HBP_MULTIPLIER : 0.04,

		PERFORMANCE_WEIGHT : {
			HR: 3,
			HITS: 3,
			HITS_PREV_INNINGS: 2,
			RUNS_CURRENT_INNING: 5,
			RUNS_PREV_INNINGS: 4,
			DEFICIT: 4,
			WALKS: 2,
			WALKS_PREV_INNINGS: 1
		},

		BAD_PERFORMANCE_MIN : 30,
		BAD_PERFORMANCE_MAX : 100,

		PITCH_TYPES : {
			FASTBALL : 'FB',
			SLIDER : 'SL',
			CURVEBALL : 'CB',
			CHANGEUP : 'CU',
			BREAKING_BALL : 'BB'
		},

		PITCH_TYPES_FOR_DISPLAY : {
			FB : 'Fastball',
			SL : 'Slider',
			CB : 'Curveball',
			CU : 'Changeup'
		},

		PARTIAL_INNINGS_DISPLAY : {
			'.0': '',
			'.1': ' and 1/3',
			'.2': ' and 2/3'
		},

		PITCH_TYPE_PERCENTAGES : {
			FB : 'fastballPercentage',
			SL : 'sliderPercentage',
			CB : 'curveballPercentage',
			CU : 'changeupPercentage'
		},

		OUT_OF_ZONE_PLAY_CALL_LOCATIONS : {
			O: 'outside',
			I: 'inside',
			L: 'low',
			H: 'high',
			HA: 'high and away',
			HI: 'high inside',
			LI: 'low inside',
			LA: 'low and away'
		},

		IN_ZONE_PLAY_CALL_LOCATIONS : {
			SC: (chance.bool() ? 'right over the plate' : 'right down the middle'),
			SUO: 'up and away',
			SUM: (chance.bool() ? 'at the top of the zone' : 'up'),
			SUI: 'up inside',
			SCO: (chance.bool() ? 'a bit outside' : 'outside'),
			SCI: (chance.bool() ? 'inside' : 'a bit inside'),
			SDO: 'low and away',
			SDM: (chance.bool() ? 'down' : 'at the bottom of the zone'),
			SDI: 'down inside'
		},

		PITCH_ANIMATION_MOVEMENT : {
			FB: {
				vertical: {
					min: 3,
					max: 18
				},
				horizontal: {
					min: 0,
					max: 15
				}
			},
			SL: {
				vertical: {
					min: 35,
					max: 50
				},
				horizontal: {
					min: 38,
					max: 58
				}
			},
			CB: {
				vertical: {
					min: 50,
					max: 75
				},
				horizontal: {
					min: 4,
					max: 10
				}
			},
			CU: {
				vertical: {
					min: 10,
					max: 16
				},
				horizontal: {
					min: 4,
					max: 14
				}
			}
		},

		//average pitch in zone% for each count in zone and out;
		//balls : [0 strikes, 1 strikes, ...]
		COUNT_PITCH_PERCENTAGES : {
			LL : {
				'0' : [58.1, 48.6, 35.5],
				'1' : [59.9, 53.6, 40.2],
				'2' : [64.5, 61.5, 51.6],
				'3' : [70.6, 68.8, 62.5]
			},
			RL : {
				'0' : [54.6, 45.9, 33.7],
				'1' : [56.1, 51, 40.2],
				'2' : [59.7, 57.8, 49.3],
				'3' : [65.2, 64.6, 61.1]
			},
			LR : {
				'0' : [57.5, 46, 34],
				'1' : [57, 51.6, 39.3],
				'2' : [61.5, 58, 47.9],
				'3' : [69.6, 65.3, 59.3]
			},
			RR : {
				'0' : [60, 49.6, 36],
				'1' : [60.5, 54.4, 42],
				'2' : [65, 60.7, 51.1],
				'3' : [68.6, 67.7, 63.3]
			}
		},

		//locations are combination of batter handedness and pitch location

		MISCALLED_PITCH_REPOSITION : [
			//HIGH
			{
				locations: ['RMHI', 'RMHM', 'RMHO', 'LMHI', 'LMHM', 'LMHO'],
				repositionLimit: PITCH_ANIMATION_GLOBAL.MIN_TOP_FOR_HIGH_MISCALLED_STRIKE,
				zoneLimit: PITCH_ANIMATION_GLOBAL.MAX_TOP_HIGH
			},
			//UP
			{
				locations: ['RSUI', 'RSUM', 'RSUO', 'LSUI', 'LSUM', 'LSUO'],
				repositionLimit: PITCH_ANIMATION_GLOBAL.MAX_TOP_FOR_UP_MISCALLED_BALL,
				zoneLimit: PITCH_ANIMATION_GLOBAL.MIN_TOP_UP,
				isGreaterThanLimit: true
			},
			//DOWN
			{
				locations: ['RSDI', 'RSDM', 'RSDO', 'LSDI', 'LSDM', 'LSDO'],
				repositionLimit: PITCH_ANIMATION_GLOBAL.MIN_TOP_FOR_DOWN_MISCALLED_BALL,
				zoneLimit: PITCH_ANIMATION_GLOBAL.MAX_TOP_DOWN
			},
			//LOW
			{
				locations: ['RMLI', 'RMLM', 'RMLO', 'LMLI', 'LMLM', 'LMLO'],
				repositionLimit: PITCH_ANIMATION_GLOBAL.MAX_TOP_FOR_LOW_MISCALLED_STRIKE,
				zoneLimit: PITCH_ANIMATION_GLOBAL.MIN_TOP_LOW,
				isGreaterThanLimit: true
			},


			//R HIGH INSIDE/L HIGH AWAY
			{
				locations: ['RHI, LHA'],
				repositionLimitY: PITCH_ANIMATION_GLOBAL.MAX_TOP_HIGH,
				zoneLimitY: PITCH_ANIMATION_GLOBAL.MIN_TOP_FOR_HIGH_MISCALLED_STRIKE,
				repositionLimitX: PITCH_ANIMATION_GLOBAL.MAX_LEFT_FOR_LEFT_MISCALLED_BALL,
				zoneLimitX: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER_LEFT,
				repositionXY: true
			},
			//R HIGH AWAY/L HIGH INSIDE
			{
				locations: ['RHA', 'LHI'],
				repositionLimitY: PITCH_ANIMATION_GLOBAL.MAX_TOP_HIGH,
				zoneLimitY: PITCH_ANIMATION_GLOBAL.MIN_TOP_FOR_HIGH_MISCALLED_STRIKE,
				repositionLimitX: PITCH_ANIMATION_GLOBAL.MAX_LEFT_FOR_RIGHT_MISCALLED_STRIKE,
				zoneLimitX: PITCH_ANIMATION_GLOBAL.MIN_LEFT_RIGHT,
				repositionXY: true
			},
			

			//R LOW INSIDE/L LOW AWAY
			{
				locations: ['RLI, LLA'],
				repositionLimitY: PITCH_ANIMATION_GLOBAL.MAX_TOP_FOR_LOW_MISCALLED_STRIKE,
				zoneLimitY: PITCH_ANIMATION_GLOBAL.MIN_TOP_LOW,
				repositionLimitX: PITCH_ANIMATION_GLOBAL.MAX_LEFT_FOR_LEFT_MISCALLED_BALL,
				zoneLimitX: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER_LEFT,
				repositionXY: true
			},
			//R LOW AWAY/L LOW INSIDE
			{
				locations: ['RLA', 'LLI'],
				repositionLimitY: PITCH_ANIMATION_GLOBAL.MAX_TOP_FOR_LOW_MISCALLED_STRIKE,
				zoneLimitY: PITCH_ANIMATION_GLOBAL.MIN_TOP_LOW,
				repositionLimitX: PITCH_ANIMATION_GLOBAL.MAX_LEFT_FOR_RIGHT_MISCALLED_STRIKE,
				zoneLimitX: PITCH_ANIMATION_GLOBAL.MIN_LEFT_RIGHT,
				repositionXY: true
			},
		

			//OUT OF ZONE R IN/L OUT
			{
				locations: ['RMIU', 'RMIM', 'RMID', 'LMOU', 'LMOM', 'LMOD'],
				repositionLimit: PITCH_ANIMATION_GLOBAL.MIN_LEFT_FOR_LEFT_MISCALLED_STRIKE,
				zoneLimit: PITCH_ANIMATION_GLOBAL.MAX_LEFT_LEFT,
				repositionX: true
			},
			//ZONE R IN/L OUT
			{
				locations: ['RSCI', 'LSCO'],
				repositionLimit: PITCH_ANIMATION_GLOBAL.MAX_LEFT_FOR_LEFT_MISCALLED_BALL,
				zoneLimit: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER_LEFT,
				repositionX: true,
				isGreaterThanLimit: true
			},
			//OUT OF ZONE R OUT/L IN
			{
				locations: ['RMOU', 'RMOM', 'RMOD', 'LMIU', 'LMIM', 'LMID'],
				repositionLimit: PITCH_ANIMATION_GLOBAL.MAX_LEFT_FOR_RIGHT_MISCALLED_STRIKE,
				zoneLimit: PITCH_ANIMATION_GLOBAL.MIN_LEFT_RIGHT,
				repositionX: true,
				isGreaterThanLimit: true
			},
			//ZONE R OUT/L IN
			{
				locations: ['RSCO', 'LSCI'],
				repositionLimit: PITCH_ANIMATION_GLOBAL.MIN_LEFT_FOR_RIGHT_MISCALLED_BALL,
				zoneLimit: PITCH_ANIMATION_GLOBAL.MAX_LEFT_CENTER_RIGHT,
				repositionX: true
			}
		],

		PITCH_ANIMATION : [
			//HIGH

			{
				locations: ['RHI', 'LHA'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_HIGH,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_LEFT
				}
			},
			{
				locations: ['RMHI', 'LMHO'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_HIGH,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER_LEFT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_CENTER_LEFT
				}
			},
			{
				locations: ['RMHM', 'LMHM'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_HIGH,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_CENTER,
				}
			},
			{
				locations: ['RMHO', 'LMHI'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_HIGH,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER_RIGHT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_CENTER_RIGHT
				}
			},
			{
				locations: ['RHA', 'LHI'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_HIGH,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_RIGHT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT
				}
			},



			//UP

			{
				locations: ['RMIU', 'LMOU'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_UP,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_UP,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_LEFT
				}
			},
			{
				locations: ['RSUI', 'LSUO'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_UP,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_UP,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER_LEFT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_CENTER_LEFT
				}
			},
			{
				locations: ['RSUM', 'LSUM'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_UP,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_UP,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_CENTER,
				}
			},
			{
				locations: ['RSUO', 'LSUI'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_UP,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_UP,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER_RIGHT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_CENTER_RIGHT
				}
			},
			{
				locations: ['RMOU', 'LMIU'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_UP,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_UP,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_RIGHT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT
				}
			},



			//MID

			{
				locations: ['RMIM', 'LMOM'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_MID,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_MID,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_LEFT
				}
			},
			{
				locations: ['RSCI', 'LSCO'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_MID,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_MID,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER_LEFT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_CENTER_LEFT
				}
			},
			{
				locations: ['RSC', 'LSC'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_MID,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_MID,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_CENTER,
				}
			},
			{
				locations: ['RSCO', 'LSCI'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_MID,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_MID,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER_RIGHT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_CENTER_RIGHT
				}
			},
			{
				locations: ['RMOM', 'LMIM'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_MID,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_MID,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_RIGHT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT
				}
			},
		

			
			//DOWN

			{
				locations: ['RMID', 'LMOD'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_DOWN,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_DOWN,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_LEFT
				}
			},
			{
				locations: ['RSDI', 'LSDO'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_DOWN,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_DOWN,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER_LEFT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_CENTER_LEFT
				}
			},
			{
				locations: ['RSDM', 'LSDM'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_DOWN,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_DOWN,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_CENTER,
				}
			},
			{
				locations: ['RSDO', 'LSDI'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_DOWN,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_DOWN,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER_RIGHT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_CENTER_RIGHT
				}
			},
			{
				locations: ['RMOD', 'LMID'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_DOWN,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_DOWN,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_RIGHT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT
				}
			},



			//LOW

			{
				locations: ['RLI', 'LLA'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_LOW,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_LOW,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_LEFT
				}
			},
			{
				locations: ['RMLI', 'LMLO'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_LOW,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_LOW,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER_LEFT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_CENTER_LEFT
				}
			},
			{
				locations: ['RMLM', 'LMLM'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_LOW,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_LOW,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_CENTER,
				}
			},
			{
				locations: ['RMLO', 'LMLI'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_LOW,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_LOW,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_CENTER_RIGHT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT_CENTER_RIGHT
				}
			},
			{
				locations: ['RLA', 'LLI'],
				ranges: {
					minTop: PITCH_ANIMATION_GLOBAL.MIN_TOP_LOW,
					maxTop: PITCH_ANIMATION_GLOBAL.MAX_TOP_LOW,
					minLeft: PITCH_ANIMATION_GLOBAL.MIN_LEFT_RIGHT,
					maxLeft: PITCH_ANIMATION_GLOBAL.MAX_LEFT
				}
			}
		],

		//*****
		//numbers taken from heat maps from 2017 season initially;
		//adjusted to more accurate Pitch Info->Plate Discipline on leaderboard page;
		//52.9 vs 46.4 pitches thrown in zone (6.5 diff);
		//adjusted by adding .4 (6.5/16 OOZ locs) to each out of zone loc number and subtracting .7 (6.5/9 Z locs) from in zone numbers
		
		//UPDATE 7/8/18: chance percentages are off (e.g. for RR -- https://www.fangraphs.com/zonegridbase.aspx?playerid=&position=B&ss=&se=&type=0&hand=RR&count=all&blur=0&grid=5&view=pit&pitch=&season=2017&data=pi)
		//not sure why (maybe they tweaked data for season after I entered them), but nothing is off by more than 1%
		//same for swing; nothing off more than a couple % (e.g. RL -- https://www.fangraphs.com/zonegridbase.aspx?playerid=&position=B&ss=&se=&type=2&hand=RL&count=all&blur=0&grid=5&view=pit&pitch=&season=2017&data=pi)
		//pitch contact: (e.g. LL -- https://www.fangraphs.com/zonegridbase.aspx?playerid=&position=B&ss=&se=&type=3&hand=LL&count=all&blur=0&grid=5&view=pit&pitch=&season=2017&data=pi)
		//pitchTypePerc dropdown selections-> FB: FA, FC, FS, SI...SL: SL, KN...CB: CU...CU: CH

		//*****
		//pitchTypePerc is number of pitches thrown at loc relative to the other 3 pitch types at loc;
		//behind/ahead refers to where pitcher is on count
		//*****

		LL_PITCH : [
			{location : 'LA', chance : 9.4, index : 9.4, swing : 19, contact : 26, cStrike : 2,
				pitchTypePerc : {
					FB : {even : 30.2, behind : 48.3, ahead : 18.0},
					SL : {even : 43.7, behind : 33.2, ahead : 52.4},
					CB : {even : 23.8, behind : 15.6, ahead : 27.6},
					CU : {even : 2.1, behind : 2.6, ahead : 1.8}
				},
				pitchTypeSwingPerc : {
					FB : {even : 7, behind : 8, ahead : 7},
					SL : {even : 20, behind : 23, ahead : 24},
					CB : {even : 15, behind : 21, ahead : 17},
					CU : {even : 35, behind : 8, ahead : 11}
				}
			},
			{location : 'SDO', chance : 7.9, index : 17.3, swing : 52, contact : 76, cStrike : 75,
				pitchTypePerc : {
					FB : {even : 55.5, behind : 70.6, ahead : 42.0},
					SL : {even : 28.3, behind : 19.6, ahead : 37.7},
					CB : {even : 13.6, behind : 7.2, ahead : 16.6},
					CU : {even : 2.4, behind : 2.3, ahead : 3.6}
				},
				pitchTypeSwingPerc : {
					FB : {even : 32, behind : 47, ahead : 43},
					SL : {even : 61, behind : 81, ahead : 68},
					CB : {even : 60, behind : 79, ahead : 63},
					CU : {even : 56, behind : 64, ahead : 48}
				}
			},
			{location : 'SC', chance : 7.7, index : 25, swing : 73, contact : 90, cStrike : 100,
				pitchTypePerc : {
					FB : {even : 68.7, behind : 79.8, ahead : 58.5},
					SL : {even : 18.5, behind : 13.5, ahead : 23.4},
					CB : {even : 10.1, behind : 4.1, ahead : 14.5},
					CU : {even : 2.5, behind : 2.4, ahead : 3.4}
				},
				pitchTypeSwingPerc : {
					FB : {even : 66, behind : 92, ahead : 80},
					SL : {even : 59, behind : 80, ahead : 68},
					CB : {even : 53, behind : 84, ahead : 43},
					CU : {even : 81, behind : 87, ahead : 80}
				}
			},
			{location : 'MLO', chance : 7.4, index : 32.4, swing : 38, contact : 43, cStrike : 11,
				pitchTypePerc : {
					FB : {even : 38.6, behind : 52.2, ahead : 20.2},
					SL : {even : 36.5, behind : 30.8, ahead : 43.6},
					CB : {even : 20.2, behind : 10.7, ahead : 28.8},
					CU : {even : 4.5, behind : 6.1, ahead : 7.2}
				},
				pitchTypeSwingPerc : {
					FB : {even : 14, behind : 27, ahead : 19},
					SL : {even : 44, behind : 53, ahead : 48},
					CB : {even : 38, behind : 50, ahead : 42},
					CU : {even : 23, behind : 32, ahead : 44}
				}
			},
			{location : 'SCO', chance : 7, index : 39.4, swing : 57, contact : 83, cStrike : 89,
				pitchTypePerc : {
					FB : {even : 69.6, behind : 79.3, ahead : 64.4},
					SL : {even : 19.1, behind : 14.0, ahead : 21.7},
					CB : {even : 15.5, behind : 5.2, ahead : 11.5},
					CU : {even : 1.3, behind : 1.3, ahead : 2.3}
				},
				pitchTypeSwingPerc : {
					FB : {even : 43, behind : 65, ahead : 59},
					SL : {even : 61, behind : 82, ahead : 68},
					CB : {even : 49, behind : 79, ahead : 63},
					CU : {even : 68, behind : 73, ahead : 53}
				}
			},
			{location : 'SDM', chance : 6.8, index : 46.2, swing : 64, contact : 85, cStrike : 88,
				pitchTypePerc : {
					FB : {even : 59.4, behind : 71.8, ahead : 47.9},
					SL : {even : 24.0, behind : 16.9, ahead : 30.0},
					CB : {even : 12.5, behind : 6.5, ahead : 15.4},
					CU : {even : 3.9, behind : 4.6, ahead : 6.4}
				},
				pitchTypeSwingPerc : {
					FB : {even : 50, behind : 71, ahead : 65},
					SL : {even : 61, behind : 81, ahead : 70},
					CB : {even : 60, behind : 92, ahead : 59},
					CU : {even : 85, behind : 91, ahead : 81}
				}
			},
			{location : 'MOD', chance : 6.1, index : 52.3, swing : 25, contact : 57, cStrike : 8,
				pitchTypePerc : {
					FB : {even : 52.8, behind : 69.3, ahead : 39.6},
					SL : {even : 33.3, behind : 21.7, ahead : 42.7},
					CB : {even : 12.4, behind : 7.0, ahead : 16.0},
					CU : {even : 1.2, behind : 1.8, ahead : 1.5}
				},
				pitchTypeSwingPerc : {
					FB : {even : 9, behind : 18, ahead : 11},
					SL : {even : 32, behind : 43, ahead : 31},
					CB : {even : 25, behind : 46, ahead : 40},
					CU : {even : 25, behind : 13, ahead : 0}
				}
			},
			{location : 'MLM', chance : 4.9, index : 57.2, swing : 42, contact : 53, cStrike : 13,
				pitchTypePerc : {
					FB : {even : 49.1, behind : 64.6, ahead : 31.1},
					SL : {even : 27.2, behind : 18.1, ahead : 29.8},
					CB : {even : 15.7, behind : 8.8, ahead : 23.3},
					CU : {even : 11.2, behind : 8.3, ahead : 15.6}
				},
				pitchTypeSwingPerc : {
					FB : {even : 26, behind : 34, ahead : 29},
					SL : {even : 45, behind : 57, ahead : 50},
					CB : {even : 48, behind : 67, ahead : 48},
					CU : {even : 45, behind : 50, ahead : 62}
				}
			},
			{location : 'SCI', chance : 4.6, index : 61.8, swing : 69, contact : 93, cStrike : 75,
				pitchTypePerc : {
					FB : {even : 70.6, behind : 81.5, ahead : 71.2},
					SL : {even : 16.4, behind : 9.5, ahead : 13.5},
					CB : {even : 8.8, behind : 5.1, ahead : 9.7},
					CU : {even : 4.0, behind : 3.7, ahead : 5.4}
				},
				pitchTypeSwingPerc : {
					FB : {even : 69, behind : 90, ahead : 79},
					SL : {even : 39, behind : 52, ahead : 48},
					CB : {even : 33, behind : 57, ahead : 43},
					CU : {even : 74, behind : 91, ahead : 76}
				}
			},
			{location : 'SUM', chance : 4.5, index : 66.3, swing : 68, contact : 80, cStrike : 82,
				pitchTypePerc : {
					FB : {even : 77.1, behind : 82.8, ahead : 77.0},
					SL : {even : 12.6, behind : 10.3, ahead : 13.1},
					CB : {even : 9.3, behind : 5.0, ahead : 8.5},
					CU : {even : 0.8, behind : 1.7, ahead : 1.2}
				},
				pitchTypeSwingPerc : {
					FB : {even : 63, behind : 90, ahead : 74},
					SL : {even : 46, behind : 75, ahead : 41},
					CB : {even : 29, behind : 49, ahead : 34},
					CU : {even : 50, behind : 88, ahead : 60}
				}
			},
			{location : 'MOM', chance : 4.5, index : 70.8, swing : 22, contact : 66, cStrike : 10,
				pitchTypePerc : {
					FB : {even : 66.4, behind : 76.5, ahead : 64.6},
					SL : {even : 21.7, behind : 16.4, ahead : 23.6},
					CB : {even : 10.7, behind : 5.6, ahead : 10.1},
					CU : {even : 1.0, behind : 1.4, ahead : 1.4}
				},
				pitchTypeSwingPerc : {
					FB : {even : 14, behind : 20, ahead : 20},
					SL : {even : 28, behind : 37, ahead : 34},
					CB : {even : 25, behind : 28, ahead : 25},
					CU : {even : 22, behind : 0, ahead : 14}
				}
			},
			{location : 'SDI', chance : 3.1, index : 73.9, swing : 60, contact : 85, cStrike : 62,
				pitchTypePerc : {
					FB : {even : 70.4, behind : 75.4, ahead : 60.9},
					SL : {even : 14.5, behind : 12.1, ahead : 16.2},
					CB : {even : 9.4, behind : 5.0, ahead : 9.8},
					CU : {even : 5.8, behind : 7.2, ahead : 12.8}
				},
				pitchTypeSwingPerc : {
					FB : {even : 58, behind : 75, ahead : 67},
					SL : {even : 40, behind : 47, ahead : 40},
					CB : {even : 36, behind : 69, ahead : 61},
					CU : {even : 80, behind : 82, ahead : 73}
				}
			},
			{location : 'SUO', chance : 3, index : 76.9, swing : 51, contact : 78, cStrike : 68,
				pitchTypePerc : {
					FB : {even : 77.5, behind : 86.7, ahead : 79.5},
					SL : {even : 13.7, behind : 9.5, ahead : 14.3},
					CB : {even : 7.7, behind : 3.1, ahead : 5.5},
					CU : {even : 0.9, behind : 0.5, ahead : 0.5}
				},
				pitchTypeSwingPerc : {
					FB : {even : 45, behind : 64, ahead : 52},
					SL : {even : 36, behind : 60, ahead : 40},
					CB : {even : 22, behind : 53, ahead : 31},
					CU : {even : 38, behind : 100, ahead : 67}
				}
			},
			{location : 'SUI', chance : 2.7, index : 79.6, swing : 62, contact : 83, cStrike : 45,
				pitchTypePerc : {
					FB : {even : 74.4, behind : 82.3, ahead : 74.6},
					SL : {even : 13.5, behind : 9.6, ahead : 12.9},
					CB : {even : 8.8, behind : 6.0, ahead : 10.2},
					CU : {even : 3.1, behind : 2.0, behind : 2.1}
				},
				pitchTypeSwingPerc : {
					FB : {even : 64, behind : 82, ahead : 71},
					SL : {even : 26, behind : 55, ahead : 34},
					CB : {even : 11, behind : 45, ahead : 14},
					CU : {even : 73, behind : 78, ahead : 67}
				}
			},
			{location : 'MHM', chance : 2.7, index : 82.3, swing : 34, contact : 60, cStrike : 4,
				pitchTypePerc : {
					FB : {even : 79.7, behind : 87.0, ahead : 91.1},
					SL : {even : 10.6, behind : 7.7, ahead : 6.1},
					CB : {even : 8.4, behind : 4.4, ahead : 2.4},
					CU : {even : 1.2, behind : 0.7, ahead : 0.2}
				},
				pitchTypeSwingPerc : {
					FB : {even : 31, behind : 44, ahead : 32},
					SL : {even : 15, behind : 28, ahead : 24},
					CB : {even : 0, behind : 10, ahead : 0},
					CU : {even : 33, behind : 0, ahead : 0}
				}
			},
			{location : 'MIM', chance : 2.6, index : 84.9, swing : 38, contact : 84, cStrike : 2,
				pitchTypePerc : {
					FB : {even : 80.5, behind : 84.3, ahead : 82.5},
					SL : {even : 7.0, behind : 6.6, ahead : 5.6},
					CB : {even : 5.5, behind : 3.8, ahead : 5.2},
					CU : {even : 6.8, behind : 5.0, ahead : 6.5}
				},
				pitchTypeSwingPerc : {
					FB : {even : 39, behind : 43, ahead : 45},
					SL : {even : 10, behind : 17, ahead : 5},
					CB : {even : 10, behind : 8, ahead : 25},
					CU : {even : 39, behind : 38, ahead : 63}
				}
			},
			{location : 'MHI', chance : 2.2, index : 87.1, swing : 26, contact : 58, cStrike : 2,
				pitchTypePerc : {
					FB : {even : 70.2, behind : 76.2, ahead : 84.9},
					SL : {even : 15.2, behind : 10.4, ahead : 6.8},
					CB : {even : 12.5, behind : 7.5, ahead : 6.8},
					CU : {even : 1.9, behind : 5.1, ahead : 1.3}
				},
				pitchTypeSwingPerc : {
					FB : {even : 26, behind : 36, ahead : 27},
					SL : {even : 5, behind : 5, ahead : 12},
					CB : {even : 2, behind : 15, ahead : 6},
					CU : {even : 57, behind : 50, ahead : 14}
				}
			},
			{location : 'MLI', chance : 2.2, index : 89.3, swing : 38, contact : 60, cStrike : 7,
				pitchTypePerc : {
					FB : {even : 56.3, behind : 74.3, ahead : 49.3},
					SL : {even : 16.8, behind : 13.1, ahead : 13.4},
					CB : {even : 12.7, behind : 1.6, ahead : 11.2},
					CU : {even : 14.0, behind : 10.9, ahead : 25.8}
				},
				pitchTypeSwingPerc : {
					FB : {even : 26, behind : 32, ahead : 32},
					SL : {even : 29, behind : 31, ahead : 42},
					CB : {even : 35, behind : 68, ahead : 33},
					CU : {even : 61, behind : 40, ahead : 45}
				}
			},
			{location : 'MIU', chance : 2.1, index : 91.4, swing : 26, contact : 85, cStrike : 1,
				pitchTypePerc : {
					FB : {even : 76.6, behind : 78.8, ahead : 85.0},
					SL : {even : 9.4, behind : 8.3, ahead : 4.9},
					CB : {even : 8.9, behind : 7.5, ahead : 6.2},
					CU : {even : 4.8, behind : 5.1, ahead : 3.7}
				},
				pitchTypeSwingPerc : {
					FB : {even : 22, behind : 35, ahead : 36},
					SL : {even : 5, behind : 25, ahead : 5},
					CB : {even : 0, behind : 13, ahead : 5},
					CU : {even : 35, behind : 33, ahead : 38}
				}
			},
			{location : 'MOU', chance : 1.9, index : 93.3, swing : 17, contact : 76, cStrike : 4,
				pitchTypePerc : {
					FB : {even : 79.1, behind : 80.8, ahead : 82.8},
					SL : {even : 12.5, behind : 13.1, ahead : 12.5},
					CB : {even : 7.6, behind : 5.3, ahead : 4.2},
					CU : {even : 0.6, behind : 0.5, ahead : 0.3}
				},
				pitchTypeSwingPerc : {
					FB : {even : 10, behind : 20, ahead : 19},
					SL : {even : 5, behind : 31, ahead : 9},
					CB : {even : 4, behind : 67, ahead : 22},
					CU : {even : 0, behind : 0, ahead : 0}
				}
			},
			{location : 'MHO', chance : 1.8, index : 95.1, swing : 23, contact : 68, cStrike : 4,
				pitchTypePerc : {
					FB : {even : 82.2, behind : 86.0, ahead : 94.8},
					SL : {even : 7.9, behind : 3.8, ahead : 2.7},
					CB : {even : 8.3, behind : 6.9, ahead : 1.7},
					CU : {even : 1.4, behind : 3.1, ahead : 0.6}
				},
				pitchTypeSwingPerc : {
					FB : {even : 19, behind : 27, ahead : 28},
					SL : {even : 0, behind : 13, ahead : 40},
					CB : {even : 4, behind : 0, ahead : 11},
					CU : {even : 25, behind : 0, ahead : 25}
				}
			},
			{location : 'MID', chance : 1.7, index : 96.8, swing : 33, contact : 71, cStrike : 0,
				pitchTypePerc : {
					FB : {even : 75.9, behind : 82.7, ahead : 78.8},
					SL : {even : 9.2, behind : 6.5, ahead : 7.6},
					CB : {even : 4.8, behind : 2.9, ahead : 5.8},
					CU : {even : 9.9, behind : 7.7, ahead : 7.6}
				},
				pitchTypeSwingPerc : {
					FB : {even : 33, behind : 38, ahead : 32},
					SL : {even : 7, behind : 29, ahead : 9},
					CB : {even : 13, behind : 8, ahead : 0},
					CU : {even : 35, behind : 53, ahead : 54}
				}
			},
			{location : 'HI', chance : 1.5, index : 98.3, swing : 10, contact : 73, cStrike : 1,
				pitchTypePerc : {
					FB : {even : 68.1, behind : 72.8, ahead : 77.1},
					SL : {even : 14.1, behind : 12.8, ahead : 8.7},
					CB : {even : 13.7, behind : 8.8, ahead : 12.7},
					CU : {even : 3.8, behind : 5.6, ahead : 1.3}
				},
				pitchTypeSwingPerc : {
					FB : {even : 9, behind : 13, ahead : 9},
					SL : {even : 5, behind : 0, ahead : 0},
					CB : {even : 0, behind : 0, ahead : 0},
					CU : {even : 18, behind : 50, ahead : 29}
				}
			},
			{location : 'LI', chance : 1, index : 99.3, swing : 18, contact : 55, cStrike : 0,
				pitchTypePerc : {
					FB : {even : 68.3, behind : 78.9, ahead : 59.8},
					SL : {even : 7.1, behind : 7.8, ahead : 6.5},
					CB : {even : 6.4, behind : 2.6, ahead : 4.9},
					CU : {even : 17.9, behind : 10.5, ahead : 28.6}
				},
				pitchTypeSwingPerc : {
					FB : {even : 15, behind : 22, ahead : 23},
					SL : {even : 0, behind : 0, ahead : 33},
					CB : {even : 0, behind : 0, ahead : 0},
					CU : {even : 16, behind : 17, ahead : 25}
				}
			},
			{location : 'HA', chance : 0.9, index : 100.2, swing : 7, contact : 59, cStrike : 1,
				pitchTypePerc : {
					FB : {even : 85.2, behind : 79.3, ahead : 93.2},
					SL : {even : 7.9, behind : 13.7, ahead : 2.8},
					CB : {even : 3.4, behind : 6.8, ahead : 1.9},
					CU : {even : 3.4, behind : 0.0, ahead : 1.9}
				},
				pitchTypeSwingPerc : {
					FB : {even : 5, behind : 6, ahead : 4},
					SL : {even : 0, behind : 0, ahead : 50},
					CB : {even : 0, behind : 0, ahead : 0},
					CU : {even : 0, behind : 0, ahead : 0}
				}
			}
		],

		RL_PITCH : [
			{location : 'SCO', chance : 7.8, index : 7.8, swing : 64, contact : 87, cStrike : 93,
				pitchTypePerc : {
					FB : {even : 67.1, behind : 75.7, ahead : 58.9},
					SL : {even : 8.3, behind : 6.7, ahead : 11.8},
					CB : {even : 12.1, behind : 5.0, ahead : 14.4},
					CU : {even : 12.3, behind : 12.5, ahead : 14.7}
				},
				pitchTypeSwingPerc : {
					FB : {even : 56, behind : 82, ahead : 71},
					SL : {even : 41, behind : 68, ahead : 48},
					CB : {even : 32, behind : 63, ahead : 38},
					CU : {even : 72, behind : 91, ahead : 79}
				}
			},
			{location : 'MLM', chance : 7, index : 14.8, swing : 42, contact : 57, cStrike : 10,
				pitchTypePerc : {
					FB : {even : 38.6, behind : 52.3, ahead : 21.7},
					SL : {even : 13.7, behind : 11.4, ahead : 20.2},
					CB : {even : 23.0, behind : 9.8, ahead : 30.3},
					CU : {even : 24.5, behind : 26.4, ahead : 27.6}
				},
				pitchTypeSwingPerc : {
					FB : {even : 25, behind : 75, ahead : 32},
					SL : {even : 48, behind : 89, ahead : 54},
					CB : {even : 43, behind : 85, ahead : 45},
					CU : {even : 44, behind : 88, ahead : 48}
				}
			},
			{location : 'SDO', chance : 6.7, index : 21.5, swing : 58, contact : 86, cStrike : 85,
				pitchTypePerc : {
					FB : {even : 58.4, behind : 67.0, ahead : 42.3},
					SL : {even : 9.0, behind : 6.8, ahead : 11.3},
					CB : {even : 13.3, behind : 5.3, ahead : 19.2},
					CU : {even : 19.2, behind : 20.6, ahead : 27.0}
				},
				pitchTypeSwingPerc : {
					FB : {even : 45, behind : 65, ahead : 59},
					SL : {even : 42, behind : 64, ahead : 44},
					CB : {even : 38, behind : 65, ahead : 50},
					CU : {even : 76, behind : 88, ahead : 79}
				}
			},
			{location : 'SC', chance : 6.6, index : 28.1, swing : 75, contact : 91, cStrike : 100,
				pitchTypePerc : {
					FB : {even : 69.3, behind : 75.4, ahead : 65.4},
					SL : {even : 10.2, behind : 9.3, ahead : 15.2},
					CB : {even : 13.0, behind : 6.5, ahead : 12.8},
					CU : {even : 7.3, behind : 8.5, ahead : 6.3}
				},
				pitchTypeSwingPerc : {
					FB : {even : 70, behind : 93, ahead : 81},
					SL : {even : 67, behind : 90, ahead : 76},
					CB : {even : 41, behind : 77, ahead : 54},
					CU : {even : 72, behind : 92, ahead : 77}
				}
			},
			{location : 'SDM', chance : 6.6, index : 34.7, swing : 66, contact : 87, cStrike : 86,
				pitchTypePerc : {
					FB : {even : 56.3, behind : 67.1, ahead : 40.2},
					SL : {even : 12.7, behind : 9.5, ahead : 21.5},
					CB : {even : 17.9, behind : 7.2, ahead : 22.8},
					CU : {even : 12.8, behind : 16.0, ahead : 15.2}
				},
				pitchTypeSwingPerc : {
					FB : {even : 52, behind : 75, ahead : 68},
					SL : {even : 70, behind : 89, ahead : 73},
					CB : {even : 54, behind : 85, ahead : 67},
					CU : {even : 73, behind : 88, ahead : 79}
				}
			},
			{location : 'MOM', chance : 6.1, index : 40.8, swing : 24, contact : 82, cStrike : 13,
				pitchTypePerc : {
					FB : {even : 66.1, behind : 72.1, ahead : 56.0},
					SL : {even : 6.6, behind : 5.6, ahead : 7.7},
					CB : {even : 10.1, behind : 3.9, ahead : 11.2},
					CU : {even : 17.0, behind : 18.2, ahead : 24.8}
				},
				pitchTypeSwingPerc : {
					FB : {even : 20, behind : 31, ahead : 26},
					SL : {even : 8, behind : 18, ahead : 13},
					CB : {even : 7, behind : 19, ahead : 12},
					CU : {even : 34, behind : 41, ahead : 30}
				}
			},
			{location : 'MLI', chance : 5.2, index : 46, swing : 34, contact : 43, cStrike : 4,
				pitchTypePerc : {
					FB : {even : 33.4, behind : 47.4, ahead : 16.6},
					SL : {even : 21.7, behind : 18.9, ahead : 34.7},
					CB : {even : 29.7, behind : 14.6, ahead : 35.8},
					CU : {even : 14.9, behind : 18.9, ahead : 12.7}
				},
				pitchTypeSwingPerc : {
					FB : {even : 14, behind : 26, ahead : 22},
					SL : {even : 48, behind : 48, ahead : 53},
					CB : {even : 36, behind : 42, ahead : 49},
					CU : {even : 18, behind : 19, ahead : 21}
				}
			},
			{location : 'MLO', chance : 5.2, index : 51.2, swing : 38, contact : 63, cStrike : 13,
				pitchTypePerc : {
					FB : {even : 47.3, behind : 56.4, ahead : 29.0},
					SL : {even : 9.4, behind : 7.2, ahead : 11.2},
					CB : {even : 14.6, behind : 6.3, ahead : 20.9},
					CU : {even : 28.5, behind : 29.9, ahead : 47.4}
				},
				pitchTypeSwingPerc : {
					FB : {even : 21, behind : 36, ahead : 28},
					SL : {even : 33, behind : 40, ahead : 28},
					CB : {even : 30, behind : 51, ahead : 28},
					CU : {even : 48, behind : 47, ahead : 53}
				}
			},
			{location : 'MOU', chance : 4.7, index : 55.9, swing : 15, contact : 74, cStrike : 4,
				pitchTypePerc : {
					FB : {even : 68.4, behind : 73.7, ahead : 66.4},
					SL : {even : 6.6, behind : 5.3, ahead : 7.4},
					CB : {even : 11.7, behind : 5.5, ahead : 10.4},
					CU : {even : 13.1, behind : 15.3, ahead : 15.5}
				},
				pitchTypeSwingPerc : {
					FB : {even : 14, behind : 22, ahead : 16},
					SL : {even : 6, behind : 12, ahead : 6},
					CB : {even : 3, behind : 19, ahead : 6},
					CU : {even : 15, behind : 19, ahead : 17}
				}
			},
			{location : 'SUO', chance : 4.4, index : 60.3, swing : 56, contact : 77, cStrike : 66,
				pitchTypePerc : {
					FB : {even : 74.0, behind : 79.3, ahead : 77.7},
					SL : {even : 7.1, behind : 6.1, ahead : 8.0},
					CB : {even : 11.0, behind : 5.1, ahead : 8.0},
					CU : {even : 7.7, behind : 9.2, ahead : 6.2}
				},
				pitchTypeSwingPerc : {
					FB : {even : 52, behind : 82, ahead : 62},
					SL : {even : 35, behind : 58, ahead : 38},
					CB : {even : 14, behind : 37, ahead : 20},
					CU : {even : 47, behind : 70, ahead : 51}
				}
			},
			{location : 'MOD', chance : 4.4, index : 64.7, swing : 26, contact : 76, cStrike : 14,
				pitchTypePerc : {
					FB : {even : 59.7, behind : 66.8, ahead : 46.4},
					SL : {even : 7.1, behind : 5.3, ahead : 8.1},
					CB : {even : 9.6, behind : 3.5, ahead : 11.6},
					CU : {even : 23.4, behind : 24.2, ahead : 33.7}
				},
				pitchTypeSwingPerc : {
					FB : {even : 16, behind : 25, ahead : 24},
					SL : {even : 13, behind : 14, ahead : 13},
					CB : {even : 12, behind : 27, ahead : 13},
					CU : {even : 39, behind : 45, ahead : 40}
				}
			},
			{location : 'SUM', chance : 3.9, index : 68.6, swing : 73, contact : 82, cStrike : 82,
				pitchTypePerc : {
					FB : {even : 80.3, behind : 83.9, ahead : 85.6},
					SL : {even : 7.3, behind : 7.5, ahead : 7.3},
					CB : {even : 8.6, behind : 3.9, ahead : 4.8},
					CU : {even : 3.6, behind : 4.6, ahead : 2.1}
				},
				pitchTypeSwingPerc : {
					FB : {even : 69, behind : 90, ahead : 78},
					SL : {even : 54, behind : 80, ahead : 61},
					CB : {even : 21, behind : 63, ahead : 29},
					CU : {even : 50, behind : 68, ahead : 52}
				}
			},
			{location : 'SCI', chance : 3.5, index : 72.1, swing : 62, contact : 92, cStrike : 66,
				pitchTypePerc : {
					FB : {even : 76.2, behind : 80.8, ahead : 77.3},
					SL : {even : 12.8, behind : 11.5, ahead : 15.3},
					CB : {even : 8.1, behind : 3.6, ahead : 5.5},
					CU : {even : 2.7, behind : 4.0, ahead : 1.7}
				},
				pitchTypeSwingPerc : {
					FB : {even : 56, behind : 66, ahead : 65},
					SL : {even : 72, behind : 82, ahead : 74},
					CB : {even : 41, behind : 71, ahead : 41},
					CU : {even : 40, behind : 60, ahead : 39}
				}
			},
			{location : 'SDI', chance : 3.5, index : 75.6, swing : 54, contact : 82, cStrike : 46,
				pitchTypePerc : {
					FB : {even : 57.6, behind : 72.2, ahead : 46.9},
					SL : {even : 19.1, behind : 14.1, ahead : 30.0},
					CB : {even : 16.7, behind : 8.4, ahead : 17.8},
					CU : {even : 6.5, behind : 8.2, ahead : 5.2}
				},
				pitchTypeSwingPerc : {
					FB : {even : 41, behind : 50, ahead : 53},
					SL : {even : 70, behind : 81, ahead : 77},
					CB : {even : 47, behind : 77, ahead : 53},
					CU : {even : 45, behind : 58, ahead : 45}
				}
			},
			{location : 'LI', chance : 3.3, index : 78.9, swing : 16, contact : 21, cStrike : 0,
				pitchTypePerc : {
					FB : {even : 33.1, behind : 47.7, ahead : 17.4},
					SL : {even : 29.5, behind : 24.8, ahead : 46.1},
					CB : {even : 30.7, behind : 17.0, ahead : 32.2},
					CU : {even : 6.5, behind : 10.3, ahead : 4.1}
				},
				pitchTypeSwingPerc : {
					FB : {even : 5, behind : 7, ahead : 7},
					SL : {even : 24, behind : 21, ahead : 21},
					CB : {even : 16, behind : 17, ahead : 19},
	    			CU : {even : 2, behind : 4, ahead : 3}
				}
			},
			{location : 'MHO', chance : 3.1, index : 82, swing : 25, contact : 61, cStrike : 3,
				pitchTypePerc : {
					FB : {even : 77.6, behind : 82.2, ahead : 92.1},
					SL : {even : 5.7, behind : 4.8, ahead : 2.7},
					CB : {even : 11.7, behind : 5.0, ahead : 3.3},
					CU : {even : 4.8, behind : 7.7, ahead : 1.6}
				},
				pitchTypeSwingPerc : {
					FB : {even : 22, behind : 33, ahead : 23},
					SL : {even : 10, behind : 24, ahead : 11},
					CB : {even : 3, behind : 7, ahead : 5},
					CU : {even : 15, behind : 21, ahead : 11}
				}
			},
			{location : 'HA', chance : 3.1, index : 85.1, swing : 4, contact : 58, cStrike : 0,
				pitchTypePerc : {
					FB : {even : 64.6, behind : 72.3, ahead : 81.9},
					SL : {even : 6.4, behind : 4.9, ahead : 3.2},
					CB : {even : 18.1, behind : 8.2, ahead : 7.5},
					CU : {even : 10.7, behind : 14.4, ahead : 7.2}
				},
				pitchTypeSwingPerc : {
					FB : {even : 3, behind : 6, ahead : 4},
					SL : {even : 1, behind : 4, ahead : 2},
					CB : {even : 0, behind : 1, ahead : 0},
					CU : {even : 2, behind : 3, ahead : 0}
				}
			},
			{location : 'MHM', chance : 2.9, index : 88, swing : 38, contact : 63, cStrike : 5,
				pitchTypePerc : {
					FB : {even : 87.8, behind : 88.4, ahead : 96.2},
					SL : {even : 5.6, behind : 6.0, ahead : 2.4},
					CB : {even : 4.7, behind : 2.6, ahead : 0.8},
					CU : {even : 1.6, behind : 2.8, ahead : 0.4}
				},
				pitchTypeSwingPerc : {
					FB : {even : 36, behind : 42, ahead : 41},
					SL : {even : 18, behind : 35, ahead : 21},
					CB : {even : 6, behind : 9, ahead : 13},
					CU : {even : 18, behind : 8, ahead : 18}
				}
			},
			{location : 'MID', chance : 2.2, index : 90.2, swing : 23, contact : 57, cStrike : 2,
				pitchTypePerc : {
					FB : {even : 67.3, behind : 73.5, ahead : 60.1},
					SL : {even : 19.6, behind : 15.6, ahead : 31.3},
					CB : {even : 10.7, behind : 6.6, ahead : 7.2},
					CU : {even : 2.2, behind : 4.0, ahead : 1.2}
				},
				pitchTypeSwingPerc : {
					FB : {even : 13, behind : 16, ahead : 16},
					SL : {even : 37, behind : 41, ahead : 36},
					CB : {even : 27, behind : 41, ahead : 29},
					CU : {even : 7, behind : 17, ahead : 5}
				}
			},
			{location : 'LA', chance : 2.2, index : 92.4, swing : 18, contact : 53, cStrike : 2,
				pitchTypePerc : {
					FB : {even : 50.7, behind : 56.0, ahead : 30.2},
					SL : {even : 6.8, behind : 5.0, ahead : 6.3},
					CB : {even : 9.4, behind : 4.7, ahead : 11.5},
					CU : {even : 33.0, behind : 34.1, ahead : 51.8}
				},
				pitchTypeSwingPerc : {
					FB : {even : 9, behind : 16, ahead : 10},
					SL : {even : 8, behind : 8, ahead : 2},
					CB : {even : 12, behind : 14, ahead : 5},
					CU : {even : 29, behind : 24, ahead : 23}
				}
			},
			{location : 'SUI', chance : 2.1, index : 94.5, swing : 58, contact : 88, cStrike : 44,
				pitchTypePerc : {
					FB : {even : 87.6, behind : 89.4, ahead : 90.1},
					SL : {even : 7.1, behind : 7.1, ahead : 6.9},
					CB : {even : 4.1, behind : 1.3, ahead : 2.2},
					CU : {even : 1.0, behind : 2.0, ahead : 0.5}
				},
				pitchTypeSwingPerc : {
					FB : {even : 54, behind : 64, ahead : 60},
					SL : {even : 57, behind : 72, ahead : 53},
					CB : {even : 15, behind : 46, ahead : 30},
					CU : {even : 33, behind : 23, ahead : 17}
				}
			},
			{location : 'MIM', chance : 2.1, index : 96.6, swing : 22, contact : 82, cStrike : 2,
				pitchTypePerc : {
					FB : {even : 84.7, behind : 84.1, ahead : 82.3},
					SL : {even : 11.3, behind : 11.2, ahead : 14.9},
					CB : {even : 2.9, behind : 3.2, ahead : 2.5},
					CU : {even : 0.9, behind : 1.3, ahead : 0.2}
				},
				pitchTypeSwingPerc : {
					FB : {even : 17, behind : 20, ahead : 21},
					SL : {even : 32, behind : 45, ahead : 36},
					CB : {even : 21, behind : 38, ahead : 24},
					CU : {even : 12, behind : 33, ahead : 25}
				}
			},
			{location : 'MHI', chance : 1.7, index : 98.3, swing : 26, contact : 68, cStrike : 2,
				pitchTypePerc : {
					FB : {even : 92.0, behind : 89.0, ahead : 96.4},
					SL : {even : 5.1, behind : 6.5, ahead : 2.5},
					CB : {even : 2.0, behind : 2.2, ahead : 0.8},
					CU : {even : 0.5, behind : 2.0, ahead : 0.1}
				},
				pitchTypeSwingPerc : {
					FB : {even : 23, behind : 27, ahead : 30},
					SL : {even : 21, behind : 24, ahead : 13},
					CB : {even : 13, behind : 8, ahead : 9},
					CU : {even : 0, behind : 0, ahead : 0}
				}
			},
			{location : 'MIU', chance : 1.3, index : 99.6, swing : 16, contact : 90, cStrike : 1,
				pitchTypePerc : {
					FB : {even : 91.8, behind : 88.0, ahead : 92.4},
					SL : {even : 5.8, behind : 8.9, ahead : 6.9},
					CB : {even : 1.5, behind : 2.2, ahead : 0.4},
					CU : {even : 0.7, behind : 0.7, ahead : 0.1}
				},
				pitchTypeSwingPerc : {
					FB : {even : 12, behind : 17, ahead : 17},
					SL : {even : 15, behind : 28, ahead : 11},
					CB : {even : 0, behind : 0, ahead : 22},
					CU : {even : 0, behind : 0, ahead : 33}
				}
			},
			{location : 'HI', chance : 0.7, index : 100.3, swing : 6, contact : 80, cStrike : 0,
				pitchTypePerc : {
					FB : {even : 95.2, behind : 93.7, ahead : 96.1},
					SL : {even : 3.1, behind : 6.2, ahead : 3.3},
					CB : {even : 1.1, behind : 0.0, ahead : 0.2},
					CU : {even : 0.3, behind : 0.0, ahead : 0.2}
				},
				pitchTypeSwingPerc : {
					FB : {even : 2, behind : 6, ahead : 8},
					SL : {even : 38, behind : 14, ahead : 0},
					CB : {even : 0, behind : 0, ahead : 0},
					CU : {even : 0, behind : 0, ahead : 0}
				}
			}
		],

		LR_PITCH : [
			{location : 'SC', chance : 6.9, index : 6.9, swing : 73, contact : 90, cStrike : 100,
				pitchTypePerc : {
					FB : {even : 66.5, behind : 73.1, ahead : 63.8},
					SL : {even : 9.6, behind : 6.9, ahead : 14.0},
					CB : {even : 12.1, behind : 5.8, ahead : 13.6},
					CU : {even : 11.6, behind : 14.0, ahead : 8.4}
				},
				pitchTypeSwingPerc : {
					FB : {even : 65, behind : 91, ahead : 81},
					SL : {even : 58, behind : 89, ahead : 64},
					CB : {even : 46, behind : 76, ahead : 55},
					CU : {even : 70, behind : 86, ahead : 79}
				}
			},
			{location : 'SDM', chance : 6.9, index : 13.8, swing : 65, contact : 84, cStrike : 86,
				pitchTypePerc : {
					FB : {even : 54.1, behind : 62.7, ahead : 41.3},
					SL : {even : 13.2, behind : 7.9, ahead : 19.3},
					CB : {even : 13.9, behind : 7.4, ahead : 20.2},
					CU : {even : 18.5, behind : 21.8, ahead : 19.1}
				},
				pitchTypeSwingPerc : {
					FB : {even : 51, behind : 72, ahead : 67},
					SL : {even : 61, behind : 83, ahead : 70},
					CB : {even : 51, behind : 86, ahead : 69},
					CU : {even : 72, behind : 86, ahead : 76}
				}
			},
			{location : 'MLM', chance : 6.6, index : 20.4, swing : 41, contact : 60, cStrike : 11,
				pitchTypePerc : {
					FB : {even : 37.3, behind : 48.2, ahead : 21.3},
					SL : {even : 14.0, behind : 10.3, ahead : 20.3},
					CB : {even : 19.1, behind : 8.4, ahead : 27.9},
					CU : {even : 29.4, behind : 32.9, ahead : 30.3}
				},
				pitchTypeSwingPerc : {
					FB : {even : 22, behind : 38, ahead : 31},
					SL : {even : 43, behind : 53, ahead : 50},
					CB : {even : 44, behind : 59, ahead : 53},
					CU : {even : 42, behind : 40, ahead : 45}
				}
			},
			{location : 'SCO', chance : 6.5, index : 26.9, swing : 60, contact : 86, cStrike : 83,
				pitchTypePerc : {
					FB : {even : 64.2, behind : 68.7, ahead : 58.2},
					SL : {even : 7.9, behind : 5.9, ahead : 9.7},
					CB : {even : 10.0, behind : 4.2, ahead : 11.3},
					CU : {even : 17.8, behind : 21.1, ahead : 20.6}
				},
				pitchTypeSwingPerc : {
					FB : {even : 52, behind : 76, ahead : 66},
					SL : {even : 32, behind : 50, ahead : 43},
					CB : {even : 29, behind : 53, ahead : 38},
					CU : {even : 71, behind : 87, ahead : 75}
				}
			},
			{location : 'MLI', chance : 6.2, index : 33.1, swing : 36, contact : 47, cStrike : 8,
				pitchTypePerc : {
					FB : {even : 34.8, behind : 47.7, ahead : 18.7},
					SL : {even : 21.0, behind : 15.6, ahead : 34.3},
					CB : {even : 24.6, behind : 13.2, ahead : 32.0},
					CU : {even : 19.4, behind : 23.3, ahead : 14.8}
				},
				pitchTypeSwingPerc : {
					FB : {even : 17, behind : 33, ahead : 27},
					SL : {even : 52, behind : 48, ahead : 48},
					CB : {even : 37, behind : 50, ahead : 40},
					CU : {even : 20, behind : 23, ahead : 26}
				}
			},
			{location : 'SDO', chance : 5.9, index : 39, swing : 55, contact : 83, cStrike : 73,
				pitchTypePerc : {
					FB : {even : 56.7, behind : 62.8, ahead : 42.5},
					SL : {even : 7.8, behind : 5.4, ahead : 11.9},
					CB : {even : 9.8, behind : 4.3, ahead : 12.7},
					CU : {even : 25.5, behind : 27.2, ahead : 32.8}
				},
				pitchTypeSwingPerc : {
					FB : {even : 41, behind : 60, ahead : 56},
					SL : {even : 35, behind : 56, ahead : 37},
					CB : {even : 36, behind : 72, ahead : 47},
					CU : {even : 70, behind : 83, ahead : 76}
				}
			},
			{location : 'SCI', chance : 4.8, index : 43.8, swing : 67, contact : 92, cStrike : 87,
				pitchTypePerc : {
					FB : {even : 77.0, behind : 81.0, ahead : 76.4},
					SL : {even : 10.7, behind : 8.6, ahead : 12.8},
					CB : {even : 7.7, behind : 4.4, ahead : 8.1},
					CU : {even : 4.4, behind : 5.8, ahead : 2.5}
				},
				pitchTypeSwingPerc : {
					FB : {even : 59, behind : 77, ahead : 70},
					SL : {even : 72, behind : 90, ahead : 81},
					CB : {even : 45, behind : 80, ahead : 58},
					CU : {even : 48, behind : 70, ahead : 55}
				}
			},
			{location : 'LI', chance : 4.8, index : 48.6, swing : 20, contact : 29, cStrike : 2,
				pitchTypePerc : {
					FB : {even : 35.0, behind : 50.2, ahead : 19.0},
					SL : {even : 32.1, behind : 21.9, ahead : 47.2},
					CB : {even : 25.2, behind : 16.2, ahead : 29.6},
					CU : {even : 7.4, behind : 11.5, ahead : 4.0}
				},
				pitchTypeSwingPerc : {
					FB : {even : 7, behind : 8, ahead : 10},
					SL : {even : 29, behind : 26, ahead : 30},
					CB : {even : 17, behind : 19, ahead : 24},
					CU : {even : 5, behind : 4, ahead : 2}
				}
			},
			{location : 'MOM', chance : 4.6, index : 53.2, swing : 23, contact : 78, cStrike : 6,
				pitchTypePerc : {
					FB : {even : 61.8, behind : 68.6, ahead : 52.9},
					SL : {even : 6.7, behind : 4.7, ahead : 7.7},
					CB : {even : 7.4, behind : 4.1, ahead : 7.3},
					CU : {even : 23.9, behind : 22.4, ahead : 31.8}
				},
				pitchTypeSwingPerc : {
					FB : {even : 17, behind : 25, ahead : 25},
					SL : {even : 7, behind : 9, ahead : 8},
					CB : {even : 7, behind : 13, ahead : 5},
					CU : {even : 30, behind : 42, ahead : 32}
				}
			},
			{location : 'MLO', chance : 4.6, index : 57.8, swing : 34, contact : 61, cStrike : 10,
				pitchTypePerc : {
					FB : {even : 44.2, behind : 52.5, ahead : 25.9},
					SL : {even : 8.2, behind : 6.4, ahead : 10.7},
					CB : {even : 11.2, behind : 6.1, ahead : 16.2},
					CU : {even : 36.1, behind : 34.9, ahead : 47.0}
				},
				pitchTypeSwingPerc : {
					FB : {even : 19, behind : 30, ahead : 27},
					SL : {even : 26, behind : 35, ahead : 25},
					CB : {even : 27, behind : 42, ahead : 30},
					CU : {even : 44, behind : 43, ahead : 48}
				}
			},
			{location : 'SDI', chance : 4.5, index : 62.3, swing : 57, contact : 83, cStrike : 68,
				pitchTypePerc : {
					FB : {even : 59.0, behind : 67.5, ahead : 50.0},
					SL : {even : 16.5, behind : 11.9, ahead : 24.3},
					CB : {even : 14.7, behind : 8.0, ahead : 17.7},
					CU : {even : 9.6, behind : 12.5, ahead : 7.9}
				},
				pitchTypeSwingPerc : {
					FB : {even : 42, behind : 54, ahead : 55},
					SL : {even : 71, behind : 86, ahead : 78},
					CB : {even : 54, behind : 84, ahead : 67},
					CU : {even : 45, behind : 67, ahead : 53}
				}
			},
			{location : 'SUM', chance : 3.9, index : 66.2, swing : 71, contact : 80, cStrike : 83,
				pitchTypePerc : {
					FB : {even : 80.2, behind : 81.9, ahead : 83.8},
					SL : {even : 6.8, behind : 6.0, ahead : 6.0},
					CB : {even : 8.3, behind : 4.3, ahead : 6.8},
					CU : {even : 4.5, behind : 7.6, ahead : 3.2}
				},
				pitchTypeSwingPerc : {
					FB : {even : 67, behind : 91, ahead : 77},
					SL : {even : 40, behind : 73, ahead : 46},
					CB : {even : 27, behind : 57, ahead : 26},
					CU : {even : 51, behind : 69, ahead : 59}
				}
			},
			{location : 'SUO', chance : 3.6, index : 69.8, swing : 51, contact : 75, cStrike : 55,
				pitchTypePerc : {
					FB : {even : 71.5, behind : 74.2, ahead : 74.8},
					SL : {even : 5.8, behind : 5.5, ahead : 6.2},
					CB : {even : 10.0, behind : 5.3, ahead : 8.2},
					CU : {even : 12.6, behind : 14.8, ahead : 10.6}
				},
				pitchTypeSwingPerc : {
					FB : {even : 47, behind : 77, ahead : 59},
					SL : {even : 28, behind : 41, ahead : 24},
					CB : {even : 14, behind : 40, ahead : 18},
					CU : {even : 41, behind : 67, ahead : 51}
				}
			},
			{location : 'MOD', chance : 3.4, index : 73.2, swing : 25, contact : 68, cStrike : 4,
				pitchTypePerc : {
					FB : {even : 57.3, behind : 61.9, ahead : 39.5},
					SL : {even : 5.6, behind : 3.3, ahead : 8.5},
					CB : {even : 7.5, behind : 3.3, ahead : 8.7},
					CU : {even : 29.5, behind : 31.4, ahead : 43.1}
				},
				pitchTypeSwingPerc : {
					FB : {even : 14, behind : 21, ahead : 20},
					SL : {even : 7, behind : 14, ahead : 3},
					CB : {even : 14, behind : 23, ahead : 6},
					CU : {even : 38, behind : 48, ahead : 40}
				}
			},
			{location : 'MID', chance : 3.4, index : 76.6, swing : 28, contact : 64, cStrike : 7,
				pitchTypePerc : {
					FB : {even : 67.7, behind : 71.8, ahead : 60.9},
					SL : {even : 19.5, behind : 15.5, ahead : 27.7},
					CB : {even : 9.9, behind : 7.7, ahead : 10.0},
					CU : {even : 2.8, behind : 4.8, ahead : 1.2}
				},
				pitchTypeSwingPerc : {
					FB : {even : 16, behind : 18, ahead : 23},
					SL : {even : 46, behind : 52, ahead : 55},
					CB : {even : 29, behind : 54, ahead : 30},
					CU : {even : 13, behind : 7, ahead : 6}
				}
			},
			{location : 'MOU', chance : 3.3, index : 79.9, swing : 14, contact : 69, cStrike : 2,	
				pitchTypePerc : {
					FB : {even : 64.5, behind : 68.1, ahead : 64.7},
					SL : {even : 7.0, behind : 5.6, ahead : 7.0},
					CB : {even : 9.6, behind : 5.1, ahead : 7.4},
					CU : {even : 18.8, behind : 21.0, ahead : 20.7}
				},
				pitchTypeSwingPerc : {
					FB : {even : 12, behind : 24, ahead : 12},
					SL : {even : 6, behind : 7, ahead : 2},
					CB : {even : 2, behind : 3, ahead : 2},
					CU : {even : 19, behind : 21, ahead : 17}
				}
			},
			{location : 'MIM', chance : 3.1, index : 83, swing : 30, contact : 87, cStrike : 8,
				pitchTypePerc : {
					FB : {even : 85.9, behind : 88.1, ahead : 82.9},
					SL : {even : 8.9, behind : 8.4, ahead : 12.2},
					CB : {even : 3.7, behind : 2.1, ahead : 4.3},
					CU : {even : 1.3, behind : 1.3, ahead : 0.4}
				},
				pitchTypeSwingPerc : {
					FB : {even : 22, behind : 26, ahead : 32},
					SL : {even : 44, behind : 58, ahead : 46},
					CB : {even : 19, behind : 45, ahead : 42},
					CU : {even : 30, behind : 20, ahead : 17}
				}
			},
			{location : 'MHM', chance : 3, index : 86, swing : 38, contact : 58, cStrike : 6,
				pitchTypePerc : {
					FB : {even : 88.1, behind : 88.3, ahead : 95.5},
					SL : {even : 3.6, behind : 3.1, ahead : 1.7},
					CB : {even : 5.2, behind : 3.5, ahead : 1.9},
					CU : {even : 3.0, behind : 5.0, ahead : 0.7}
				},
				pitchTypeSwingPerc : {
					FB : {even : 35, behind : 44, ahead : 38},
					SL : {even : 20, behind : 33, ahead : 29},
					CB : {even : 6, behind : 20, ahead : 13},
					CU : {even : 16, behind : 36, ahead : 12}
				}
			},
			{location : 'SUI', chance : 2.7, index : 88.7, swing : 63, contact : 86, cStrike : 64,
				pitchTypePerc : {
					FB : {even : 88.3, behind : 89.3, ahead : 90.4},
					SL : {even : 5.7, behind : 5.6, ahead : 5.7},
					CB : {even : 3.9, behind : 2.9, ahead : 3.2},
					CU : {even : 1.8, behind : 2.0, ahead : 0.5}
				},
				pitchTypeSwingPerc : {
					FB : {even : 59, behind : 72, ahead : 65},
					SL : {even : 48, behind : 72, ahead : 50},
					CB : {even : 17, behind : 54, ahead : 44},
					CU : {even : 24, behind : 50, ahead : 50}
				}
			},
			{location : 'MHO', chance : 2.7, index : 91.4, swing : 22, contact : 57, cStrike : 2,
				pitchTypePerc : {
					FB : {even : 73.4, behind : 78.3, ahead : 91.1},
					SL : {even : 5.8, behind : 5.1, ahead : 2.2},
					CB : {even : 11.1, behind : 4.8, ahead : 3.9},
					CU : {even : 9.6, behind : 11.7, ahead : 2.6}
				},
				pitchTypeSwingPerc : {
					FB : {even : 18, behind : 30, ahead : 20},
					SL : {even : 6, behind : 15, ahead : 3},
					CB : {even : 1, behind : 0, ahead : 0},
					CU : {even : 5, behind : 16, ahead : 15}
				}
			},
			{location : 'HA', chance : 2.1, index : 93.5, swing : 5, contact : 53, cStrike : 0,
				pitchTypePerc : {
					FB : {even : 59.8, behind : 62.8, ahead : 78.4},
					SL : {even : 6.9, behind : 3.2, ahead : 3.7},
					CB : {even : 15.6, behind : 9.7, ahead : 8.5},
					CU : {even : 17.6, behind : 24.1, ahead : 9.3}
				},
				pitchTypeSwingPerc : {
					FB : {even : 5, behind : 7, ahead : 4},
					SL : {even : 0, behind : 0, ahead : 0},
					CB : {even : 1, behind : 2, ahead : 2},
					CU : {even : 5, behind : 6, ahead : 3}
				}
			},
			{location : 'MHI', chance : 2, index : 95.5, swing : 30, contact : 65, cStrike : 3,
				pitchTypePerc : {
					FB : {even : 93.8, behind : 93.4, ahead : 97.4},
					SL : {even : 3.4, behind : 3.2, ahead : 1.0},
					CB : {even : 2.1, behind : 0.2, ahead : 1.0},
					CU : {even : 0.5, behind : 2.9, ahead : 0.4}
				},
				pitchTypeSwingPerc : {
					FB : {even : 27, behind : 32, ahead : 30},
					SL : {even : 19, behind : 20, ahead : 27},
					CB : {even : 0, behind : 20, ahead : 0},
					CU : {even : 0, behind : 0, ahead : 10}
				}
			},
			{location : 'LA', chance : 1.9, index : 97.4, swing : 18, contact : 42, cStrike : 0,
				pitchTypePerc : {
					FB : {even : 44.3, behind : 55.9, ahead : 28.9},
					SL : {even : 4.2, behind : 2.5, ahead : 7.6},
					CB : {even : 8.0, behind : 3.8, ahead : 7.5},
					CU : {even : 43.3, behind : 37.5, ahead : 55.7}
				},
				pitchTypeSwingPerc : {
					FB : {even : 8, behind : 13, ahead : 6},
					SL : {even : 0, behind : 16, ahead : 0},
					CB : {even : 15, behind : 15, ahead : 13},
					CU : {even : 25, behind : 25, ahead : 26}
				}
			},
			{location : 'MIU', chance : 1.7, index : 99.1, swing : 23, contact : 89, cStrike : 3,
				pitchTypePerc : {
					FB : {even : 92.6, behind : 94.0, ahead : 91.9},
					SL : {even : 5.2, behind : 3.4, ahead : 6.7},
					CB : {even : 1.5, behind : 1.7, ahead : 1.1},
					CU : {even : 0.6, behind : 0.8, ahead : 0.1}
				},
				pitchTypeSwingPerc : {
					FB : {even : 19, behind : 20, ahead : 24},
					SL : {even : 37, behind : 37, ahead : 42},
					CB : {even : 18, behind : 57, ahead : 33},
					CU : {even : 0, behind : 0, ahead : 0}
				}
			},
			{location : 'HI', chance : 0.9, index : 100, swing : 9, contact : 68, cStrike : 0,
				pitchTypePerc : {
					FB : {even : 94.8, behind : 95.2, ahead : 97.2},
					SL : {even : 2.1, behind : 3.5, ahead : 1.0},
					CB : {even : 2.5, behind : 1.1, ahead : 1.0},
					CU : {even : 0.4, behind : 0.0, ahead : 0.6}
				},
				pitchTypeSwingPerc : {
					FB : {even : 6, behind : 8, ahead : 11},
					SL : {even : 0, behind : 0, ahead : 0},
					CB : {even : 17, behind : 0, ahead : 0},
					CU : {even : 0, behind : 0, ahead : 0}
				}
			}
		],

		RR_PITCH : [
			{location : 'SC', chance : 8, index : 8, swing : 73, contact : 88, cStrike : 100,
				pitchTypePerc : {
					FB : {even : 67.3, behind : 75.6, ahead : 60.2},
					SL : {even : 19.9, behind : 16.1, ahead : 22.8},
					CB : {even : 9.7, behind : 4.1, ahead : 12.3},
					CU : {even : 3.0, behind : 4.0, ahead : 4.5}
				},
				pitchTypeSwingPerc : {
					FB : {even : 65, behind : 89, ahead : 79},
					SL : {even : 63, behind : 85, ahead : 72},
					CB : {even : 51, behind : 77, ahead : 54},
					CU : {even : 80, behind : 94, ahead : 81}
				}
			},
			{location : 'LA', chance : 7.9, index : 15.9, swing : 16, contact : 22, cStrike : 1,
				pitchTypePerc : {
					FB : {even : 31.0, behind : 44.9, ahead : 18.4},
					SL : {even : 44.6, behind : 39.4, ahead : 52.9},
					CB : {even : 20.7, behind : 11.3, ahead : 25.0},
					CU : {even : 3.4, behind : 4.3, ahead : 3.5}
				},
				pitchTypeSwingPerc : {
					FB : {even : 5, behind : 6, ahead : 5},
					SL : {even : 17, behind : 21, ahead : 20},
					CB : {even : 16, behind : 17, ahead : 16},
					CU : {even : 6, behind : 7, ahead : 4}
				}
			},
			{location : 'MLO', chance : 7.6, index : 23.5, swing : 33, contact : 42, cStrike : 8,
				pitchTypePerc : {
					FB : {even : 37.2, behind : 49.0, ahead : 20.4},
					SL : {even : 37.4, behind : 32.1, ahead : 43.0},
					CB : {even : 18.3, behind : 9.9, ahead : 27.3},
					CU : {even : 6.6, behind : 8.7, ahead : 9.0}
				},
				pitchTypeSwingPerc : {
					FB : {even : 10, behind : 21, ahead : 15},
					SL : {even : 39, behind : 48, ahead : 43},
					CB : {even : 37, behind : 48, ahead : 42},
					CU : {even : 24, behind : 26, ahead : 24}
				}
			},
			{location : 'SDO', chance : 7.4, index : 30.9, swing : 48, contact : 73, cStrike : 65,
				pitchTypePerc : {
					FB : {even : 55.9, behind : 65.5, ahead : 41.1},
					SL : {even : 30.3, behind : 25.7, ahead : 38.7},
					CB : {even : 10.5, behind : 5.2, ahead : 15.4},
					CU : {even : 3.1, behind : 3.4, ahead : 4.6}
				},
				pitchTypeSwingPerc : {
					FB : {even : 28, behind : 42, ahead : 38},
					SL : {even : 59, behind : 78, ahead : 64},
					CB : {even : 51, behind : 73, ahead : 54},
					CU : {even : 54, behind : 67, ahead : 59}
				}
			},
			{location : 'SDM', chance : 6.9, index : 37.8, swing : 64, contact : 84, cStrike : 87,
				pitchTypePerc : {
					FB : {even : 56.9, behind : 67.9, ahead : 44.6},
					SL : {even : 24.3, behind : 19.7, ahead : 29.8},
					CB : {even : 12.3, behind : 5.7, ahead : 17.3},
					CU : {even : 6.4, behind : 6.5, ahead : 8.0}
				},
				pitchTypeSwingPerc : {
					FB : {even : 48, behind : 67, ahead : 64},
					SL : {even : 65, behind : 85, ahead : 75},
					CB : {even : 60, behind : 85, ahead : 62},
					CU : {even : 82, behind : 88, ahead : 84}
				}
			},
			{location : 'SCO', chance : 6.7, index : 44.5, swing : 56, contact : 82, cStrike : 82,
				pitchTypePerc : {
					FB : {even : 68.8, behind : 76.1, ahead : 64.3},
					SL : {even : 22.0, behind : 17.9, ahead : 25.3},
					CB : {even : 7.4, behind : 3.5, ahead : 7.8},
					CU : {even : 1.7, behind : 2.3, ahead : 2.3}
				},
				pitchTypeSwingPerc : {
					FB : {even : 44, behind : 63, ahead : 57},
					SL : {even : 59, behind : 81, ahead : 69},
					CB : {even : 43, behind : 68, ahead : 46},
					CU : {even : 56, behind : 77, ahead : 60}
				}
			},
			{location : 'MLM', chance : 5.4, index : 49.9, swing : 41, contact : 55, cStrike : 12,
				pitchTypePerc : {
					FB : {even : 43.9, behind : 55.1, ahead : 28.7},
					SL : {even : 25.7, behind : 23.4, ahead : 28.7},
					CB : {even : 17.6, behind : 7.8, ahead : 25.4},
					CU : {even : 12.7, behind : 13.5, ahead : 17.0}
				},
				pitchTypeSwingPerc : {
					FB : {even : 21, behind : 67, ahead : 27},
					SL : {even : 47, behind : 85, ahead : 49},
					CB : {even : 48, behind : 85, ahead : 56},
					CU : {even : 49, behind : 88, ahead : 46}
				}
			},
			{location : 'SCI', chance : 5, index : 54.9, swing : 72, contact : 92, cStrike : 90,
				pitchTypePerc : {
					FB : {even : 69.9, behind : 77.4, ahead : 68.5},
					SL : {even : 15.1, behind : 12.1, ahead : 12.8},
					CB : {even : 9.5, behind : 4.3, ahead : 10.7},
					CU : {even : 5.4, behind : 6.0, ahead : 7.8}
				},
				pitchTypeSwingPerc : {
					FB : {even : 69, behind : 90, ahead : 80},
					SL : {even : 44, behind : 68, ahead : 52},
					CB : {even : 34, behind : 62, ahead : 46},
					CU : {even : 85, behind : 93, ahead : 82}
				}
			},
			{location : 'MOD', chance : 5, index : 59.9, swing : 22, contact : 47, cStrike : 4,
				pitchTypePerc : {
					FB : {even : 56.2, behind : 65.0, ahead : 45.4},
					SL : {even : 33.2, behind : 27.7, ahead : 42.4},
					CB : {even : 8.8, behind : 5.0, ahead : 10.2},
					CU : {even : 1.6, behind : 2.1, ahead : 1.7}
				},
				pitchTypeSwingPerc : {
					FB : {even : 9, behind : 13, ahead : 11},
					SL : {even : 31, behind : 41, ahead : 36},
					CB : {even : 24, behind : 35, ahead : 21},
					CU : {even : 14, behind : 34, ahead : 19}
				}
			},
			{location : 'SUM', chance : 4.7, index : 64.6, swing : 70, contact : 80, cStrike : 83,
				pitchTypePerc : {
					FB : {even : 75.6, behind : 80.6, ahead : 77.5},
					SL : {even : 16.0, behind : 13.1, ahead : 13.5},
					CB : {even : 6.7, behind : 3.5, ahead : 6.8},
					CU : {even : 1.5, behind : 2.7, ahead : 2.1}
				},
				pitchTypeSwingPerc : {
					FB : {even : 64, behind : 91, ahead : 79},
					SL : {even : 44, behind : 72, ahead : 55},
					CB : {even : 27, behind : 58, ahead : 42},
					CU : {even : 68, behind : 78, ahead : 65}
				}
			},
			{location : 'SDI', chance : 3.4, index : 68, swing : 64, contact : 86, cStrike : 76,
				pitchTypePerc : {
					FB : {even : 66.3, behind : 72.6, ahead : 61.5},
					SL : {even : 14.5, behind : 12.2, ahead : 12.8},
					CB : {even : 10.4, behind : 4.6, ahead : 12.3},
					CU : {even : 8.6, behind : 10.4, ahead : 13.3}
				},
				pitchTypeSwingPerc : {
					FB : {even : 56, behind : 73, ahead : 68},
					SL : {even : 42, behind : 68, ahead : 49},
					CB : {even : 47, behind : 74, ahead : 58},
					CU : {even : 84, behind : 90, ahead : 84}
				}
			},
			{location : 'MOM', chance : 3.4, index : 71.4, swing : 23, contact : 66, cStrike : 6,
				pitchTypePerc : {
					FB : {even : 73.6, behind : 79.5, ahead : 65.9},
					SL : {even : 20.5, behind : 16.8, ahead : 27.3},
					CB : {even : 4.9, behind : 2.5, ahead : 5.5},
					CU : {even : 0.9, behind : 0.9, ahead : 1.6}
				},
				pitchTypeSwingPerc : {
					FB : {even : 15, behind : 22, ahead : 18},
					SL : {even : 30, behind : 45, ahead : 34},
					CB : {even : 19, behind : 37, ahead : 18},
					CU : {even : 13, behind : 25, ahead : 18}
				}
			},
			{location : 'SUI', chance : 3.2, index : 74.6, swing : 66, contact : 84, cStrike : 63,
				pitchTypePerc : {
					FB : {even : 73.3, behind : 79.0, ahead : 74.1},
					SL : {even : 13.4, behind : 11.2, ahead : 12.9},
					CB : {even : 9.6, behind : 5.1, ahead : 8.9},
					CU : {even : 3.5, behind : 4.6, ahead : 3.9}
				},
				pitchTypeSwingPerc : {
					FB : {even : 65, behind : 88, ahead : 75},
					SL : {even : 31, behind : 57, ahead : 46},
					CB : {even : 25, behind : 39, ahead : 24},
					CU : {even : 63, behind : 82, ahead : 61}
				}
			},
			{location : 'MIM', chance : 3.1, index : 77.7, swing : 41, contact : 88, cStrike : 7,
				pitchTypePerc : {
					FB : {even : 81.5, behind : 82.0, ahead : 81.4},
					SL : {even : 6.6, behind : 7.3, ahead : 4.4},
					CB : {even : 5.8, behind : 3.4, ahead : 5.0},
					CU : {even : 6.0, behind : 7.1, ahead : 9.0}
				},
				pitchTypeSwingPerc : {
					FB : {even : 40, behind : 48, ahead : 49},
					SL : {even : 17, behind : 28, ahead : 20},
					CB : {even : 8, behind : 23, ahead : 15},
					CU : {even : 44, behind : 43, ahead : 46}
				}
			},
			{location : 'SUO', chance : 2.9, index : 80.6, swing : 53, contact : 76, cStrike : 59,
				pitchTypePerc : {
					FB : {even : 78.7, behind : 83.5, ahead : 81.0},
					SL : {even : 15.7, behind : 12.6, ahead : 14.1},
					CB : {even : 4.3, behind : 2.3, ahead : 3.8},
					CU : {even : 1.2, behind : 1.4, ahead : 0.9}
				},
				pitchTypeSwingPerc : {
					FB : {even : 45, behind : 20, ahead : 55},
					SL : {even : 34, behind : 32, ahead : 52},
					CB : {even : 20, behind : 15, ahead : 28},
					CU : {even : 45, behind : 50, ahead : 56}
				}
			},
			{location : 'MHM', chance : 2.9, index : 83.5, swing : 38, contact : 63, cStrike : 5,
				pitchTypePerc : {
					FB : {even : 80.5, behind : 82.6, ahead : 90.9},
					SL : {even : 11.4, behind : 11.6, ahead : 5.8},
					CB : {even : 6.2, behind : 2.9, ahead : 2.6},
					CU : {even : 1.7, behind : 2.7, ahead : 0.5}
				},
				pitchTypeSwingPerc : {
					FB : {even : 35, behind : 47, ahead : 39},
					SL : {even : 17, behind : 31, ahead : 23},
					CB : {even : 6, behind : 14, ahead : 5},
					CU : {even : 13, behind : 38, ahead : 21}
				}
			},
			{location : 'MLI', chance : 2.6, index : 86.1, swing : 38, contact : 61, cStrike : 9,
				pitchTypePerc : {
					FB : {even : 61.3, behind : 67.2, ahead : 51.8},
					SL : {even : 12.3, behind : 11.6, ahead : 10.4},
					CB : {even : 11.0, behind : 5.1, ahead : 12.4},
					CU : {even : 15.2, behind : 15.8, ahead : 25.2}
				},
				pitchTypeSwingPerc : {
					FB : {even : 28, behind : 33, ahead : 34},
					SL : {even : 24, behind : 38, ahead : 32},
					CB : {even : 39, behind : 59, ahead : 47},
					CU : {even : 53, behind : 48, ahead : 63}
				}
			},
			{location : 'MHI', chance : 2.6, index : 88.7, swing : 31, contact : 58, cStrike : 3,
				pitchTypePerc : {
					FB : {even : 76.9, behind : 80.6, ahead : 87.1},
					SL : {even : 11.7, behind : 10.8, ahead : 6.1},
					CB : {even : 9.6, behind : 4.4, ahead : 5.5},
					CU : {even : 1.7, behind : 4.0, ahead : 1.0}
				},
				pitchTypeSwingPerc : {
					FB : {even : 32, behind : 40, ahead : 33},
					SL : {even : 6, behind : 18, ahead : 13},
					CB : {even : 4, behind : 7, ahead : 6},
					CU : {even : 15, behind : 35, ahead : 25}
				}
			},
			{location : 'MIU', chance : 2.5, index : 90.2, swing : 32, contact : 88, cStrike : 3,
				pitchTypePerc : {
					FB : {even : 79.1, behind : 80.8, ahead : 82.5},
					SL : {even : 8.6, behind : 8.8, ahead : 5.2},
					CB : {even : 7.6, behind : 4.6, ahead : 5.5},
					CU : {even : 4.5, behind : 6.6, ahead : 6.7}
				},
				pitchTypeSwingPerc : {
					FB : {even : 31, behind : 41, ahead : 35},
					SL : {even : 9, behind : 14, ahead : 11},
					CB : {even : 9, behind : 20, ahead : 5},
					CU : {even : 29, behind : 39, ahead : 35}
				}
			},
			{location : 'MID', chance : 2.1, index : 92.3, swing : 39, contact : 72, cStrike : 8,
				pitchTypePerc : {
					FB : {even : 81.5, behind : 80.5, ahead : 79.4},
					SL : {even : 6.1, behind : 6.1, ahead : 4.4},
					CB : {even : 3.9, behind : 2.4, ahead : 4.3},
					CU : {even : 8.3, behind : 10.8, ahead : 11.7}
				},
				pitchTypeSwingPerc : {
					FB : {even : 36, behind : 41, ahead : 42},
					SL : {even : 15, behind : 36, ahead : 18},
					CB : {even : 19, behind : 27, ahead : 20},
					CU : {even : 45, behind : 53, ahead : 47}
				}
			},
			{location : 'HI', chance : 1.8, index : 94.1, swing : 12, contact : 64, cStrike : 0,
				pitchTypePerc : {
					FB : {even : 73.9, behind : 77.6, ahead : 83.4},
					SL : {even : 9.9, behind : 10.3, ahead : 6.4},
					CB : {even : 12.6, behind : 6.0, ahead : 7.0},
					CU : {even : 3.5, behind : 5.9, ahead : 3.0}
				},
				pitchTypeSwingPerc : {
					FB : {even : 12, behind : 14, ahead : 15},
					SL : {even : 2, behind : 2, ahead : 2},
					CB : {even : 0, behind : 0, ahead : 2},
					CU : {even : 3, behind : 21, ahead : 9}
				}
			},
			{location : 'MHO', chance : 1.7, index : 95.8, swing : 26, contact : 67, cStrike : 2,
				pitchTypePerc : {
					FB : {even : 87.0, behind : 89.1, ahead : 93.2},
					SL : {even : 8.9, behind : 6.8, ahead : 4.7},
					CB : {even : 3.4, behind : 2.4, ahead : 1.5},
					CU : {even : 0.5, behind : 1.5, ahead : 0.4}
				},
				pitchTypeSwingPerc : {
					FB : {even : 22, behind : 31, ahead : 22},
					SL : {even : 12, behind : 22, ahead : 10},
					CB : {even : 2, behind : 11, ahead : 7},
					CU : {even : 29, behind : 13, ahead : 33}
				}
			},
			{location : 'MOU', chance : 1.5, index : 97.3, swing : 18, contact : 71, cStrike : 2,
				pitchTypePerc : {
					FB : {even : 80.8, behind : 85.8, ahead : 81.9},
					SL : {even : 13.7, behind : 11.0, ahead : 15.4},
					CB : {even : 4.2, behind : 2.0, ahead : 2.4},
					CU : {even : 1.1, behind : 1.1, ahead : 0.1}
				},
				pitchTypeSwingPerc : {
					FB : {even : 16, behind : 20, ahead : 13},
					SL : {even : 15, behind : 32, ahead : 21},
					CB : {even : 8, behind : 15, ahead : 0},
					CU : {even : 0, behind : 50, ahead : 14}
				}
			},
			{location : 'LI', chance : 1.1, index : 98.4, swing : 20, contact : 49, cStrike : 2,
				pitchTypePerc : {
					FB : {even : 77.5, behind : 79.7, ahead : 67.4},
					SL : {even : 3.5, behind : 3.0, ahead : 3.5},
					CB : {even : 4.2, behind : 1.0, ahead : 4.9},
					CU : {even : 14.6, behind : 16.1, ahead : 24.1}
				},
				pitchTypeSwingPerc : {
					FB : {even : 15, behind : 16, ahead : 22},
					SL : {even : 0, behind : 10, ahead : 10},
					CB : {even : 16, behind : 31, ahead : 0},
					CU : {even : 29, behind : 23, ahead : 29}
				}
			},
			{location : 'HA', chance : 0.8, index : 100, swing : 8, contact : 73, cStrike : 0,
				pitchTypePerc : {
					FB : {even : 92.3, behind : 94.8, ahead : 93.7},
					SL : {even : 5.1, behind : 4.3, ahead : 4.5},
					CB : {even : 1.4, behind : 0.0, ahead : 1.4},
					CU : {even : 1.0, behind : 0.8, ahead : 0.1}
				},
				pitchTypeSwingPerc : {
					FB : {even : 7, behind : 8, ahead : 9},
					SL : {even : 14, behind : 7, ahead : 0},
					CB : {even : 0, behind : 0, ahead : 0},
					CU : {even : 0, behind : 0, ahead : 0}
				}
			}
		]
	});	

}