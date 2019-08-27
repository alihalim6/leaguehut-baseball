module.exports = function(module){
	module.constant('battingConstants', {
		BATTER_MULTIPLIER: 0.01,
		BATTER_ID_MORE_LIKELY_SWING_MIN: 45,
		BATTER_ID_MORE_LIKELY_SWING_DIFF_MAX: 30,
		BATTER_ID_DIFF_DIVIDER: 2.3,
		BATTER_SWING_CHASE_MAX: 45,
		BATTER_SWING_CHASE_MIN: 5,
		BATTER_CLOSE_NEG_ID_MAX: 10,

		IN_ZONE_LIKELY_SWING_MISS_THRESHHOLD: 50,
		OUT_OF_ZONE_LIKELY_SWING_MISS_THRESHHOLD: 55,
		LIKELY_SWING_MISS_CONTACT_CHANCE_MAX: 30,

		SWING_INCREASE_MIN_SUBTRACTER: 5,
		SWING_CONTACT_ID_MULTIPLIER: 0.15,
		SWING_CONTACT_ID_DIFF_MAX: 25,
		SWING_CONTACT_ALPHA_NUM_MAX: 75,
		SWING_CONTACT_DELTA_MULTIPLIER: 0.1,

		PERC_CONTACTED_FOULED_AWAY : 50.1,
		PERC_CONTACTED_PUT_INTO_PLAY : 49.9,
		PERC_FOULED_CAUGHT_FOR_OUT : 2.4,

		BATTED_BALL_TYPES : {
			GROUND_BALL : 'GB',
			FLY_BALL : 'FlyB',
			POPUP : 'PU',
			LINE_DRIVE: 'LD'
		},

		BATTED_BALL_TYPES_FOR_DISPLAY : {
			GB : 'Ground ball',
			FlyB : 'Fly ball',
			PU : 'Popup',
			LD: 'Line drive'
		},

		BATTED_BALL_DESC_FOR_DISPLAY : {
			GB : 'grounds a',
			FlyB : 'launches a',
			PU : 'pops up a',
			LD: 'drives a'
		},

		BATTED_BALL_DESC_FOR_DISPLAY_NO_PITCH_TYPE : {
			GB : 'hits a ground ball',
			FlyB : 'hits a fly ball',
			PU : 'hits a popup',
			LD: 'hits a line drive'
		},

		FIELD_SECTIONS : {
			PULL : 'PULL',
			CENTER : 'CENTER',
			OPPOSITE : 'OPPO'
		},

		FIELD_SECTIONS_FOR_DISPLAY : {
			PULL : 'pulled',
			CENTER : (chance.bool() ? 'hit center' : 'hit up the middle'),
			OPPO : (chance.bool() ? 'hit to opposite field' : 'hit against the shift')
		},

		HTP_TIER_1_MIN : 65,
		HTP_TIER_2_MIN : 40,
		HTP_TIER_3_MIN : 15,
		POWER_HIT_ID_DIFF_MIN : 20,

		//average swing% for each count in zone and out
		//balls : [0 strikes, 1 strikes, ...]
		COUNT_SWING_PERCS : {
			zone : {
				LL : {
					"0" : [36.7, 66.7, 80.3],
					"1" : [56.1, 73, 85],
					"2" : [55.3, 71.3, 85.6],
					"3" : [9.7, 69, 88]
				},
				RL : {
					"0" : [38.1, 68.1, 81.6],
					"1" : [56.7, 72.5, 84.1],
					"2" : [56.7, 75.7, 85.3],
					"3" : [12.7, 70.1, 86.6]
				},
				LR : {
					"0" : [38.2, 68.7, 83.2],
					"1" : [56.5, 72.7, 84],
					"2" : [56.3, 76.4, 86.6],
					"3" : [14.5, 69.4, 88.1]
				},
				RR : {
					"0" : [38.4, 68.1, 82.3],
					"1" : [56, 72.3, 85.3],
					"2" : [57.6, 74.1, 85.7],
					"3" : [14.8, 71.3, 88.4]
				}
			},
			o_zone : {
				LL : {
					"0" : [12.5, 24.1, 32.9],
					"1" : [20.4, 26.5, 37.8],
					"2" : [18.3, 26.8, 38.5],
					"3" : [2.9, 19.8, 41.8]
				},
				RL : {
					"0" : [11.3, 20.8, 29.7],
					"1" : [17.1, 24.1, 33.8],
					"2" : [17, 27.2, 36.6],
					"3" : [2.3, 23.8, 38]
				},
				LR : {
					"0" : [12.3, 22.2, 31.5],
					"1" : [18.1, 25.3, 34.6],
					"2" : [18.5, 27.2, 38.1],
					"3" : [3.8, 23, 41.4]
				},
				RR : {
					"0" : [17.1, 26.1, 34.1],
					"1" : [20.8, 28.7, 37],
					"2" : [20.1, 29.5, 41.4],
					"3" : [5.1, 29.3, 43.4]
				}
			}
		},

		LL_PUT_INTO_PLAY : [
			{
				GB_PERC : 49.1,
				FLYB_PERC : 31,
				IFFB_PERC : 9.8,
				LD_PERC : 19.9
			},
			{
				PULL_PERC : 36.7,
				CENTER_PERC : 36,
				OPPO_PERC : 27.3,
				//MADE UP
				FOUL_PULL_PERC : 63.4,
				FOUL_BEHIND_PERC : 5.8,
				FOUL_OPPO_PERC : 30.8
			},
			{
				GB : {
					FB : {min : 2, max : 75},
					BB : {min : 2, max : 81},
					CU : {min : 5, max : 85}
				},

				//0-index->tier 1, 1-index->tier 2, etc...

				FlyB : {
					FB : [
						{min : 349, max : 463}, {min : 313, max : 348}, {min : 293, max : 312}, {min : 206, max : 292}
					],
					BB : [
						{min : 347, max : 417}, {min : 307, max : 347}, {min : 266, max : 306}, {min : 187, max : 265}
					],
					CU : [
						{min : 365, max : 455}, {min : 305, max : 364}, {min : 270, max : 304}, {min : 213, max : 269}
					]
				},

				PU : {
					FB : {min : 29, max : 229},
					BB : {min : 43, max : 240},
					CU : {min : 21, max : 232}
				},

				LD : {
					FB : [
						{min : 277, max : 450}, {min : 238, max : 276}, {min : 217, max : 237}, {min : 100, max : 216}
					],
					BB : [
						{min : 272, max : 421}, {min : 247, max : 271}, {min : 207, max : 246}, {min : 111, max : 206}
					],
					CU : [
						{min : 288, max : 396}, {min : 238, max : 287}, {min : 190, max : 237}, {min : 109, max : 189}
					]
				},
			}
		],

		RL_PUT_INTO_PLAY : [
			{
				GB_PERC : 42.2,
				FLYB_PERC : 36.6,
				IFFB_PERC : 8.2,
				LD_PERC : 21.2
			},
			{
				PULL_PERC : 39.9,
				CENTER_PERC : 34.6,
				OPPO_PERC : 25.6,
				//MADE UP
				FOUL_PULL_PERC : 54,
				FOUL_BEHIND_PERC : 2.1,
				FOUL_OPPO_PERC : 43.9
			},
			{
				GB : {
					FB : {min : 4, max : 63},
					BB : {min : 2, max : 82},
					CU : {min : 4, max : 85}
				},

				FlyB : {
					FB : [
						{min : 341, max : 448}, {min : 319, max : 340}, {min : 302, max : 318}, {min : 199, max : 301}
					],
					BB : [
						{min : 348, max : 451}, {min : 311, max : 347}, {min : 290, max : 310}, {min : 205, max : 289}
					],
					CU : [
						{min : 375, max : 431}, {min : 313, max : 374}, {min : 271, max : 312}, {min : 195, max : 270}
					]
				},

				PU : {
					FB : {min : 35, max : 234},
					BB : {min : 32, max : 227},
					CU : {min : 34, max : 242}
				},

				LD : {
					FB : [
						{min : 284, max : 430}, {min : 254, max : 283}, {min : 246, max : 253}, {min : 125, max : 245}
					],
					BB : [
						{min : 284, max : 414}, {min : 245, max : 283}, {min : 227, max : 244}, {min : 135, max : 226}
					],
					CU : [
						{min : 284, max : 430}, {min : 238, max : 283}, {min : 198, max : 237}, {min : 93, max : 197}
					]
				},
			}
		],

		LR_PUT_INTO_PLAY : [
			{
				GB_PERC : 44.2,
				FLYB_PERC : 35.6,
				IFFB_PERC : 9.4,
				LD_PERC : 20.1
			},
			{
				PULL_PERC : 41,
				CENTER_PERC : 34.1,
				OPPO_PERC : 24.8,
				//MADE UP
				FOUL_PULL_PERC : 64.3,
				FOUL_BEHIND_PERC : 9.6,
				FOUL_OPPO_PERC : 26.1
			},
			{
				GB : {
					FB : {min : 2, max : 75},
					BB : {min : 4, max : 89},
					CU : {min : 2, max : 86}
				},

				FlyB : {
					FB : [
						{min : 346, max : 465}, {min : 314, max : 345}, {min : 292, max : 313}, {min : 205, max : 291}
					],
					BB : [
						{min : 353, max : 454}, {min : 317, max : 352}, {min : 294, max : 316}, {min : 177, max : 293}
					],
					CU : [
						{min : 373, max : 456}, {min : 323, max : 372}, {min : 286, max : 322}, {min : 185, max : 285}
					]
				},

				PU : {
					FB : {min : 29, max : 237},
					BB : {min : 15, max : 253},
					CU : {min : 46, max : 232}
				},

				LD : {
					FB : [
						{min : 283, max : 460}, {min : 250, max : 282}, {min : 229, max : 249}, {min : 131, max : 228}
					],
					BB : [
						{min : 294, max : 468}, {min : 243, max : 293}, {min : 211, max : 242}, {min : 98, max : 210}
					],
					CU : [
						{min : 309, max : 455}, {min : 248, max : 308}, {min : 217, max : 247}, {min : 103, max : 216}
					]
				},
			}
		],

		RR_PUT_INTO_PLAY : [
			{
				GB_PERC : 44.9,
				FLYB_PERC : 35.4,
				IFFB_PERC : 10.9,
				LD_PERC : 19.8
			},
			{
				PULL_PERC : 39.7,
				CENTER_PERC : 35.4,
				OPPO_PERC : 24.9,
				//MADE UP
				FOUL_PULL_PERC : 59,
				FOUL_BEHIND_PERC : 10.5,
				FOUL_OPPO_PERC : 30.5
			},
			{
				GB : {
					FB : {min : 3, max : 86},
					BB : {min : 2, max : 81},
					CU : {min : 4, max : 88}
				},

				FlyB : {
					FB : [
						{min : 350, max : 467}, {min : 307, max : 349}, {min : 282, max : 306}, {min : 193, max : 281}
					],
					BB : [
						{min : 336, max : 439}, {min : 303, max : 335}, {min : 285, max : 302}, {min : 193, max : 284}
					],
					CU : [
						{min : 371, max : 458}, {min : 315, max : 370}, {min : 273, max : 314}, {min : 202, max : 272}
					]
				},

				PU : {
					FB : {min : 26, max : 236},
					BB : {min : 48, max : 212},
					CU : {min : 24, max : 230}
				},

				LD : {
					FB : [
						{min : 280, max : 444}, {min : 253, max : 279}, {min : 235, max : 252}, {min : 91, max : 234}
					],
					BB : [
						{min : 290, max : 424}, {min : 255, max : 289}, {min : 216, max : 254}, {min : 113, max : 215}
					],
					CU : [
						{min : 289, max : 434}, {min : 233, max : 288}, {min : 195, max : 232}, {min : 120, max : 194}
					]
				},
			}
		]

	});	

}