/**
 * Constants related to fielding.
 */
module.exports = function(module){
	module.constant('fieldingConstants', {
		HOME_PLATE_X : 200,
		HOME_PLATE_Y : 0,

		LF_RF_FOUL_LINE_DIST : 330,
		RC_LC_BASE_DIST : 370,
		CENTER_DIST : 405,

		THROW_TO_CUTOFF_MIN: 280,
		CUTOFF_POINT_DISTANCE: -50,
		FINAL_DISTANCE_TOWARD_CUTOFF_POINT: 20,

		LEFT_FOUL_TOP_SECTION_START_ANGLE : 153,
		RIGHT_FOUL_TOP_SECTION_START_ANGLE : 27,
		FOUL_ZERO_DEGREE_DIST : 100,
		FOUL_BOTTOM_SECTION_MAX_DIST : 150,
		FOUL_TOP_SECTION_MAX_DIST : 300,
		FOUL_BEHIND_DIST : 50,
		FOUL_BOTTOM_SECTION_ANGLE_DELTA : 0.54,
		FOUL_TOP_SECTION_ANGLE_DELTA : 0.1,
		
		WALL_HEIGHT : 14,
		BASE_CLEAR_WALL_HANG_TIME : 4.0,

		MIN_TIME_TO_EVENT: 0.5,

		DEFENSE_POSITIONING_X_MOVE_MIN : 12,
		DEFENSE_POSITIONING_X_MOVE_MAX : 20,
		DEFENSE_POSITIONING_Y_MOVE_MIN : 4,
		DEFENSE_POSITIONING_Y_MOVE_MAX : 12,

		PITCHER_FIELDING_DIVIDER: 2,
		BALL_RETRIEVAL_DISTANCE_DELTA_DIVIDER: 2,

		POINT_TIME_DELTA: 0.4,
		DISTANCE_DECELERATION_MIN: 1.1,
		DISTANCE_DECELERATION_MAX: 1.19,
		BALL_RETRIEVAL_RUN_SPEED_MULTIPLIER: 0.05,
		MAX_FEET_TO_GRAB_BALL: 3,
		FIELDER_THROW_MULTIPLIER: 0.05,
		AIRBORN_BALL_MULTIPLIER: 0.01,

		THROW_VELOCITY_CORNER_OUTFIELDER : 87,
		THROW_VELOCITY_INFIELDER : 90,
		THROW_VELOCITY_CF : 91,

		TIME_DIFF_FOR_PROJECTED_BASE_REACH : 0.75,
		DIST_DIFF_FOR_PROJECTED_BASE_REACH : 2,
		DIST_DIFF_FOR_PROJECTED_BASE_REACH_NON_FORCEOUT : -4,

		MAX_FIELDING_CHANCE_FOR_ERROR: 90,

		FIELD_OUTS_FOR_DISPLAY : {
			GB: 'grounds out',
			FlyB: 'flys out',
			PU: 'pops out',
			LD: 'lines out'
		},

		HIT_SECTIONS_FOR_DISPLAY : {
			L: 'left field',
			LC: 'left center field',
			R: 'right field',
			RC: 'right center field',
			C: 'center field'
		},

		HIT_SECTIONS_FOR_DISPLAY_SHORTHAND : {
			L: 'to the left',
			LC: 'center left',
			R: 'to the right',
			RC: 'center right',
			C: (chance.bool() ? 'straight ahead' : 'center')
		},

		DIFFICULT_FIELD_OUT_MAX_CHANCE : 33,

		IN_PLAY_ANGLES : {
			RIGHT_MIN : 30,
			RIGHT_MAX : 70,
			CENTER_MIN : 70,
			CENTER_MAX : 110,
			LEFT_MAX : 135,
			LEFT_MIN : 110,
			LEFT_MAX : 140,
			CENTER_BASE_ANGLE : 90,
			LF_RF_BASE_ANGLE_DIST_DELTA : 1.0,//amount angle increases per foot (e.g. 45 deg at 330 ft., 45.75 at 331 ft.)
			MID_BASE_ANGLE_DIST_DELTA : 0.571428571428571,
			LEFT_BASE_DIST : 370,
			LEFT_BASE_ANGLE : 110,
			RIGHT_BASE_DIST : 330,
			RIGHT_BASE_ANGLE : 30,
			CENTER_ADD_TO_BASE_DIST : 370,
			CENTER_ADD_TO_BASE_ANGLE : 70,
			CENTER_SUBTRACT_FROM_BASE_DIST : 405,
			CENTER_SUBTRACT_FROM_BASE_ANGLE : 90
		},

		FOUL_TERRITORY_ANGLES : {
			RIGHT_MIN : 0,
			RIGHT_MAX : 30,
			CENTER_MIN : 180,
			CENTER_MAX : 359,
			LEFT_MIN : 140,
			LEFT_MAX : 180,
			CENTER_BASE_ANGLE : 270,
			MID_BASE_ANGLE_DIST_DELTA : 1.8,
			CENTER_ADD_TO_BASE_DIST : 50,
			CENTER_ADD_TO_BASE_ANGLE : 270,
			CENTER_SUBTRACT_FROM_BASE_DIST : 100,
			CENTER_SUBTRACT_FROM_BASE_ANGLE : 180
		},

		BOUNCE_ROLL_FINAL_DIST : {
			LD : {
				max : 200,
				min : 150
			},
			//random range of perc of distance;
			//add result to the distance for final
			FlyB_PU : {
				max : 0.14,
				min : 0.1
			},
			BALL_OFF_WALL_FROM_AIR : {
				max: 20,
				min: 10
			},
			BALL_OFF_WALL_FROM_GROUND: {
				max: 15,
				min: 5
			}
		},

		GB_FINAL_DIST_TIERS : [
			{
				distPlusHtpMax : 10,
				deltaMax : 70,
				deltaMin : 60,
				//time it took to hit the ground
				timeToEventMax : 0.6,
				timeToEventMin : 0.5,
				slowTier : true
			},
			{
				distPlusHtpMax : 40,
				deltaMax : 90,
				deltaMin : 70,
				timeToEventMax : 0.8, 
				timeToEventMin : 0.5
			},
			{
				distPlusHtpMax : 60,
				deltaMax : 120,
				deltaMin : 90,
				timeToEventMax : 0.9, 
				timeToEventMin : 0.5
			},
			{
				distPlusHtpMax : 80,
				deltaMax : 160,
				deltaMin : 120,
				timeToEventMax : 2.0, 
				timeToEventMin : 0.9
			},
			{
				distPlusHtpMax : 100,
				deltaMax : 200,
				deltaMin : 160,
				timeToEventMax : 1.8, 
				timeToEventMin : 1.1
			},
			{
				distPlusHtpMax : 140,
				deltaMax : 250,
				deltaMin : 200,
				timeToEventMax : 1.7, 
				timeToEventMin : 1.1
			},
			{
				distPlusHtpMax : 160,
				deltaMax : 310,
				deltaMin : 250,
				timeToEventMax : 1.5, 
				timeToEventMin : 1.0
			},
			{
				distPlusHtpMax : 190,
				deltaMax : 380,
				deltaMin : 310,
				timeToEventMax : 1.3, 
				timeToEventMin : 0.8
			}
		],

		//index is distance
		LD_TIME_PERCENTAGES : [
			{index : 200, minTime : 2.0, maxTime : 2.5},
			{index : 250, minTime : 2.5, maxTime : 3.0},
			{index : 300, minTime : 3.0, maxTime : 3.5},
			{index : 350, minTime : 3.5, maxTime : 4.0},
			{index : 500, minTime : 4.0, maxTime : 4.5},
		],

		//total num events 3.0-6.0
		FLYB_TIME_TOTAL : 28554,
		//total num events 3.0-7.6
		PU_TIME_TOTAL : 35464,

		//index--num of events 3.0-6.0 for FlyB
		//3.0-7.6 for PU
		FLYB_PU_TIME_EVENTS : [
			{index : 560, time : 3.0},
			{index : 656, time : 3.1},
			{index : 711, time : 3.2},
			{index : 739, time : 3.3},
			{index : 810, time : 3.4},
			{index : 879, time : 3.5},
			{index : 904, time : 3.6},
			{index : 876, time : 3.7},
			{index : 860, time : 3.8},
			{index : 906, time : 3.9},
			{index : 906, time : 4.0},
			{index : 900, time : 4.1},
			{index : 946, time : 4.2},
			{index : 908, time : 4.3},
			{index : 924, time : 4.4},
			{index : 927, time : 4.5},
			{index : 1004, time : 4.6},
			{index : 958, time : 4.7},
			{index : 985, time : 4.8},
			{index : 942, time : 4.9},
			{index : 998, time : 5.0},
			{index : 978, time : 5.1},
			{index : 982, time : 5.2},
			{index : 1001, time : 5.3},
			{index : 1025, time : 5.4},
			{index : 1061, time : 5.5},
			{index : 1073, time : 5.6},
			{index : 1006, time : 5.7},
			{index : 1117, time : 5.8},
			{index : 1033, time : 5.9},
			{index : 979, time : 6.0},

			{index : 943, time : 6.1},
			{index : 987, time : 6.2},
			{index : 941, time : 6.3},
			{index : 796, time : 6.4},
			{index : 728, time : 6.5},
			{index : 629, time : 6.6},
			{index : 551, time : 6.7},
			{index : 430, time : 6.8},
			{index : 323, time : 6.9},
			{index : 214, time : 7.0},
			{index : 141, time : 7.1},
			{index : 112, time : 7.2},
			{index : 49, time : 7.3},
			{index : 32, time : 7.4},
			{index : 23, time : 7.5},
			{index : 11, time : 7.6}
		],

		//time to reach ball {
			//distance from where ball will be: chance
		//}
		//onHundredMax: distance for which all distances up to and including it have 100% success rate
		CHANCES : {
			'0.5' : {
				'0' : 46
			},
			'0.6' : {
				'0' : 56.9
			},
			'0.7' : {
				'0' : 82.4,
				'5' : 4.8
			},
			'0.8' : {
				'0' : 94.1,
				'5' : 21.9
			},
			'0.9' : {
				'0' : 98.7,
				'5' : 44.3
			},
			'1' : {
				'0' : 99.1,
				'5' : 86.1
			},
			'1.1' : {
				'0' : 99.6,
				'5' : 98
			},
			'1.2' : {
				oneHundredMax : 0,
				'5' : 99.2,
				'10' : 0.6
			},
			'1.3' : {
				oneHundredMax : 5,
				'10' : 3.3
			},
			'1.4' : {
				oneHundredMax : 5,
				'10' : 7.8
			},
			'1.5' : {
				oneHundredMax : 5,
				'10' : 15.5
			},
			'1.6' : {
				oneHundredMax : 5,
				'10' : 29.1,
				'15' : 1.4
			},
			'1.7' : {
				oneHundredMax : 5,
				'10' : 45.3,
				'15' : 9.4
			},
			'1.8' : {
				oneHundredMax : 5,
				'10' : 57,
				'15' : 28.7
			},
			'1.9' : {
				oneHundredMax : 5,
				'10' : 66.8,
				'15' : 45.6,
				'20' : 1.1
			},
			'2' : {
				oneHundredMax : 5,
				'10' : 79.7,
				'15' : 65.8,
				'20' : 7.4
			},
			'2.1' : {
				oneHundredMax : 5,
				'10' : 84.2,
				'15' : 75.7,
				'20' : 16.6
			},
			'2.2' : {
				oneHundredMax : 5,
				'10' : 87.4,
				'15' : 83,
				'20' : 27.4,
				'25' : 1.9
			},
			'2.3' : {
				oneHundredMax : 5,
				'10' : 95.6,
				'15' : 90.2,
				'20' : 39.2,
				'25' : 5.6
			},
			'2.4' : {
				oneHundredMax : 5,
				'10' : 97.2,
				'15' : 87.4,
				'20' : 46,
				'25' : 12.1
			},
			'2.5' : {
				oneHundredMax : 5,
				'10' : 99.3,
				'15' : 88.7,
				'20' : 53,
				'25' : 21.4,
				'30' : 3.5
			},
			'2.5' : {
				oneHundredMax : 5,
				'10' : 99.3,
				'15' : 88.7,
				'20' : 53,
				'25' : 21.4,
				'30' : 3.5
			},
			'2.6' : {
				oneHundredMax : 10,
				'15' : 95,
				'20' : 66.3,
				'25' : 37.7,
				'30' : 20.1
			},
			'2.7' : {
				oneHundredMax : 10,
				'15' : 97.1,
				'20' : 78.3,
				'25' : 48.9,
				'30' : 32.2,
				'35' : 1.1
			},
			'2.8' : {
				oneHundredMax : 15,
				'20' : 79.4,
				'25' : 60,
				'30' : 45.5,
				'35' : 15.8
			},
			'2.9' : {
				oneHundredMax : 15,
				'20' : 77.2,
				'25' : 70.3,
				'30' : 57,
				'35' : 29.6,
				'40' : 2.2
			},
			'3' : {
				oneHundredMax : 5,
				'10' : 91.7,
				'15' : 100,
				'20' : 83.3,
				'25' : 76.7,
				'30' : 69.8,
				'35' : 35.9,
				'40' : 10.6
			},
			'3.1' : {
				oneHundredMax : 20,
				'25' : 95.1,
				'30' : 81.8,
				'35' : 65.5,
				'40' : 46,
				'45' : 7.5
			},
			'3.2' : {
				oneHundredMax : 20,
				'25' : 95.3,
				'30' : 92,
				'35' : 69.8,
				'40' : 53.6,
				'45' : 26.8,
				'50' : 6.2
			},
			'3.3' : {
				oneHundredMax : 25,
				'30' : 97.1,
				'35' : 79,
				'40' : 68.5,
				'45' : 27.1,
				'50' : 17.3,
				'55' : 1.8
			},
			'3.4' : {
				oneHundredMax : 15,
				'20' : 97.7,
				'25' : 96.8,
				'30' : 97.9,
				'35' : 90,
				'40' : 84.4,
				'45' : 52.5,
				'50' : 25,
				'55' : 8.1
			},
			'3.5' : {
				oneHundredMax : 15,
				'20' : 96.2,
				'25' : 97.9,
				'30' : 98.4,
				'35' : 95.9,
				'40' : 83.8,
				'45' : 76.2,
				'50' : 53,
				'55' : 10.6,
				'60' : 4.2
			},
			'3.6' : {
				oneHundredMax : 30,
				'35' : 98.4,
				'40' : 92.5,
				'45' : 88.3,
				'50' : 66.1,
				'55' : 31.6,
				'60' : 8.5,
				'65' : 1.7
			},
			'3.7' : {
				oneHundredMax : 25,
				'30' : 98.5,
				'35' : 95.6,
				'40' : 94.4,
				'45' : 88.4,
				'50' : 74,
				'55' : 48.4,
				'60' : 20.8,
				'65' : 1.5,
				'70' : 1.9
			},
			'3.8' : {
				oneHundredMax : 35,
				'40' : 96.7,
				'45' : 90.9,
				'50' : 83.1,
				'55' : 56.3,
				'60' : 42.7,
				'65' : 18.6
			},
			'3.9' : {
				oneHundredMax : 25,
				'30' : 95.3,
				'35' : 98.2,
				'40' : 97.3,
				'45' : 89.5,
				'50' : 75.6,
				'55' : 51.4,
				'60' : 21.9,
				'65' : 3.5,
				'70' : 1.7
			},
			'4' : {
				oneHundredMax : 30,
				'35' : 94.3,
				'40' : 98.2,
				'45' : 98.5,
				'50' : 98.9,
				'55' : 89.4,
				'60' : 60.3,
				'65' : 48,
				'70' : 24,
				'75' : 5.3
			},
			'4.1' : {
				oneHundredMax : 35,
				'40' : 97.4,
				'45' : 98.3,
				'50' : 96.8,
				'55' : 89.6,
				'60' : 75.9,
				'65' : 74.7,
				'70' : 22.4,
				'75' : 9.7
			},
			'4.2' : {
				oneHundredMax : 40,
				'45' : 98.6,
				'50' : 98.6,
				'55' : 89.9,
				'60' : 87.2,
				'65' : 60.3,
				'70' : 44.3,
				'75' : 20.3,
				'80' : 2.8
			},
			'4.3' : {
				oneHundredMax : 30,
				'35' : 97.9,
				'40' : 100,
				'45' : 100,
				'50' : 98.5,
				'55' : 92.2,
				'60' : 88.1,
				'65' : 76.8,
				'70' : 55.9,
				'75' : 23,
				'80' : 3.9
			},
			'4.4' : {
				oneHundredMax : 45,
				'50' : 98.5,
				'55' : 96,
				'60' : 88.4,
				'65' : 78.5,
				'70' : 66.7,
				'75' : 36.8,
				'80' : 14.5,
				'85' : 4.2,
				'90' : 2.9
			},
			'4.5' : {
				oneHundredMax : 45,
				'50' : 98.2,
				'55' : 94.1,
				'60' : 96.1,
				'65' : 86.1,
				'70' : 71.7,
				'75' : 53.2,
				'80' : 28,
				'85' : 11.1
			},
			'4.6' : {
				oneHundredMax : 40,
				'45' : 98.5,
				'50' : 100,
				'55' : 98.5,
				'60' : 91.1,
				'65' : 93.1,
				'70' : 86.8,
				'75' : 63.2,
				'80' : 57.6,
				'85' : 25.5,
				'90' : 7.7,
				'95' : 2.9,
				'100' : 4.8
			},
			'4.7' : {
				oneHundredMax : 50,
				'55' : 98.4,
				'60' : 91.7,
				'65' : 95.7,
				'70' : 78.5,
				'75' : 68.7,
				'80' : 57.8,
				'85' : 41.7,
				'90' : 11.1,
				'95' : 3.3
			},
			'4.8' : {
				oneHundredMax : 40,
				'45' : 96.4,
				'50' : 98.2,
				'55' : 96.9,
				'60' : 100,
				'65' : 93.5,
				'70' : 94.5,
				'75' : 74.1,
				'80' : 70,
				'85' : 46.7,
				'90' : 32.8,
				'95' : 7.1,
				'100' : 3.6,
				'105' : 6.7
			},
			'4.9' : {
				oneHundredMax : 60,
				'65' : 96.7,
				'70' : 93.7,
				'75' : 84.5,
				'80' : 80.5,
				'85' : 64.5,
				'90' : 29.3,
				'95' : 30,
				'100' : 7.9,
				'105' : 0,
				'110' : 11.1
			},
			'5' : {
				oneHundredMax : 55,
				'60' : 96.8,
				'65' : 97,
				'70' : 95.7,
				'75' : 86.4,
				'80' : 76.4,
				'85' : 72.5,
				'90' : 50,
				'95' : 27.8,
				'100' : 23.1
			},
			'5.1' : {
				oneHundredMax : 45,
				'50' : 98.3,
				'55' : 98.8,
				'60' : 98.6,
				'65' : 98.4,
				'70' : 95,
				'75' : 85.2,
				'80' : 73.3,
				'85' : 83.9,
				'90' : 58.6,
				'95' : 41,
				'100' : 21.4
			},
			'5.2' : {
				oneHundredMax : 25,
				'30' : 97.1,
				'35' : 100,
				'40' : 100,
				'45' : 98,
				'50' : 100,
				'55' : 98.5,
				'60' : 98.6,
				'65' : 97.3,
				'70' : 97.4,
				'75' : 92.6,
				'80' : 90.4,
				'85' : 80,
				'90' : 73.6,
				'95' : 54.5,
				'100' : 38.5,
				'105' : 12.5
			},
			'5.3' : {
				oneHundredMax : 55,
				'60' : 98.5,
				'65' : 98.8,
				'70' : 90,
				'75' : 90.8,
				'80' : 95,
				'85' : 82.9,
				'90' : 71.1,
				'95' : 64.1,
				'100' : 41.7,
				'105' : 27.8,
				'110' : 6.3,
				'115' : 0,
				'120' : 12.5,
				'125' : 25
			},
			'5.4' : {
				oneHundredMax : 50,
				'55' : 98.4,
				'60' : 100,
				'65' : 97.9,
				'70' : 98.5,
				'75' : 94.5,
				'80' : 94.4,
				'85' : 80,
				'90' : 89.5,
				'95' : 50,
				'100' : 66.7,
				'105' : 36,
				'110' : 25
			},
			'5.5' : {
				oneHundredMax : 50,
				'55' : 98.7,
				'60' : 98.4,
				'65' : 100,
				'70' : 97.1,
				'75' : 92.9,
				'80' : 93.4,
				'85' : 85.9,
				'90' : 90.8,
				'95' : 85.7,
				'100' : 69.2,
				'105' : 45.5,
				'110' : 50,
				'115' : 10
			},
			'5.6' : {
				oneHundredMax : 30,
				'35' : 97.6,
				'40' : 100,
				'45' : 100,
				'50' : 98.3,
				'55' : 98.6,
				'60' : 98.6,
				'65' : 100,
				'70' : 96.7,
				'75' : 98.6,
				'80' : 96.7,
				'85' : 90.9,
				'90' : 89.1,
				'95' : 78.4,
				'100' : 63.6,
				'105' : 50,
				'110' : 27.3,
				'115' : 50,
				'120' : 28.6
			},
			'5.7' : {
				oneHundredMax : 60,
				'65' : 98.8,
				'70' : 97.1,
				'75' : 95.8,
				'80' : 95.8,
				'85' : 87.7,
				'90' : 86.5,
				'95' : 89.7,
				'100' : 88.2,
				'105' : 45.5,
				'110' : 31.6,
				'115' : 30
			},
			'5.8' : {
				oneHundredMax : 60,
				'65' : 97.4,
				'70' : 97.8,
				'75' : 97.6,
				'80' : 95.7,
				'85' : 93.8,
				'90' : 91.8,
				'95' : 85.7,
				'100' : 57.1,
				'105' : 61.1,
				'110' : 60,
				'115' : 10
			},
			'5.9' : {
				oneHundredMax : 40,
				'45' : 98.3,
				'50' : 100,
				'55' : 100,
				'60' : 98.9,
				'65' : 100,
				'70' : 98.6,
				'75' : 93.9,
				'80' : 93.2,
				'85' : 88.6,
				'90' : 90.7,
				'95' : 87.9,
				'100' : 68.2,
				'105' : 58.8,
				'110' : 60,
				'115' : 50,
				'120' : 33.3
			},
			'6' : {
				oneHundredMax : 45,
				'50' : 98.4,
				'55' : 98.6,
				'60' : 100,
				'65' : 100,
				'70' : 98.9,
				'75' : 98.5,
				'80' : 96.6,
				'85' : 95,
				'90' : 93.6,
				'95' : 90.9,
				'100' : 81.8,
				'105' : 77.8,
				'110' : 54.5,
				'115' : 50,
				'120' : 50,
				'125' : 50
			},
			'6.1' : {
				oneHundredMax : 55,
				'60' : 98.7,
				'65' : 98.7,
				'70' : 97.1,
				'75' : 98.3,
				'80' : 95.4,
				'85' : 98.1,
				'90' : 97.4,
				'95' : 92.6,
				'100' : 82.4,
				'105' : 72.7,
				'110' : 72.2,
				'115' : 66.7,
				'120' : 66.7
			},
			'6.2' : {
				oneHundredMax : 45,
				'50' : 96.7,
				'55' : 100,
				'60' : 100,
				'65' : 98.7,
				'70' : 100,
				'75' : 100,
				'80' : 98,
				'85' : 96.4,
				'90' : 90,
				'95' : 100,
				'100' : 84.2,
				'105' : 100,
				'110' : 66.7,
				'115' : 37.5,
				'120' : 75,
				'125' : 50
			},
			'6.3' : {
				oneHundredMax : 65,
				'70' : 98.6,
				'75' : 97.5,
				'80' : 100,
				'85' : 98,
				'90' : 93.8,
				'95' : 92,
				'100' : 93.3,
				'105' : 77.8,
				'110' : 100,
				'115' : 50,
				'120' : 71.4,
				'125' : 50
			},
			'6.4' : {
				oneHundredMax : 20,
				'25' : 97.4,
				'30' : 100,
				'35' : 98,
				'40' : 100,
				'45' : 100,
				'50' : 97.9,
				'55' : 98.5,
				'60' : 98.2,
				'65' : 100,
				'70' : 98.5,
				'75' : 97,
				'80' : 96,
				'85' : 94.1,
				'90' : 100,
				'95' : 92,
				'100' : 100,
				'105' : 71.4,
				'110' : 50,
				'115' : 83.3,
				'120' : 100,
				'125' : 100
			},
			'6.5' : {
				oneHundredMax : 40,
				'45' : 98,
				'50' : 100,
				'55' : 100,
				'60' : 98.3,
				'65' : 98.4,
				'70' : 96.4,
				'75' : 97.4,
				'80' : 100,
				'85' : 100,
				'90' : 100,
				'95' : 100,
				'100' : 95,
				'105' : 84.6,
				'110' : 100,
				'115' : 57.1,
				'120' : 66.7
			},
			'6.6' : {
				oneHundredMax : 65,
				'70' : 98.1,
				'75' : 98.1,
				'80' : 100,
				'85' : 94.9,
				'90' : 96.2,
				'95' : 100,
				'100' : 71.4,
				'105' : 71.4,
				'110' : 100,
				'115' : 100,
				'120' : 100,
				'125' : 100,
				'130' : 100,
				'135' : 100,
				'140' : 100,
				'145' : 100
			},
			'6.7' : {
				oneHundredMax : 65,
				'70' : 97.8,
				'75' : 95.9,
				'80' : 96.3,
				'85' : 100,
				'90' : 90.9,
				'95' : 100,
				'100' : 100,
				'105' : 80,
				'110' : 50,
				'115' : 100,
				'120' : 100,
				'125' : 50,
				'135' : 100
			},
			'6.8' : {
				oneHundredMax : 60,
				'65' : 97.1,
				'70' : 93.3,
				'75' : 96.9,
				'80' : 95.8,
				'85' : 100,
				'90' : 100,
				'95' : 100,
				'100' : 100,
				'105' : 100,
				'110' : 66.7,
				'115' : 100,
				'120' : 100
			},
			'6.9' : {
				oneHundredMax : 130
			},
			'7' : {
				oneHundredMax : 130
			},
			'7.1' : {
				oneHundredMax : 130
			},
			'7.2' : {
				oneHundredMax : 130
			},
			'7.3' : {
				oneHundredMax : 130
			},
			'7.4' : {
				oneHundredMax : 130
			},
			'7.5' : {
				oneHundredMax : 130
			},
			'7.6' : {
				oneHundredMax : 130
			}
		}

	});	

}