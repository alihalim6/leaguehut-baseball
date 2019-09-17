/**
 * Constants related to baserunning.
 */
module.exports = function(module){
	module.constant('baseRunningConstants', {
		BASE_RUNNING_SPEED_MULTIPLIER: 0.1,

		BASES_LEAD_OFF_DISTANCE_MIN: 12,
		BASES_LEAD_OFF_DISTANCE_MAX: 18,
		EXTRA_LEAD_OFF_DISTANCE_MIN: 4,
		EXTRA_LEAD_OFF_DISTANCE_MAX: 8,

		PROJ_RUN_RATE_DIVIDER_MIN: 2,
		PROJ_RUN_RATE_DIVIDER_MAX: 4,

		PITCHER_WINDUP : {
			max : 1.3,
			min : 0.6
		},

		CATCHER_WINDUP : {
			max : 1.2,
			min : 0.9
		},

		BASE_STEALING : {
			MIN_STEAL_SPD : 80,
			THROW_MULTIPLIER: 0.05,
			MIN_REACH_TIME_DIFF: 1,
			GOOD_JUMP_ON_PITCH_AWR_MIN: 90,

			GOOD_JUMP_ON_PITCH_DIST_MIN: 3,
			GOOD_JUMP_ON_PITCH_DIST_MAX: 6,

			FIELDER_CATCH_TAG_TIME: {
				min: 0.3,
				max: 0.7
			},

			//base chances

			LL : {
				'2' : 5.87,
				'3' : 4.62
			},
			
			LR : {
				'2' : 6.28,
				'3' : 4.3
			},

			RL : {
				'2' : 5.81,
				'3' : 4.27
			},

			RR : {
				'2' : 5.88,
				'3' : 4.3
			},

			//DOUBLE/TRIPLE STEAL CHANCES

			//fangraphs.com/tht/steals-of-home-the-millennium-so-far/
			//'Of the 190 steals'... paragraph
			DOUBLE_2ND_HOME : 67.8,

			//factors

			BREAK_EVEN_RATES : {
				weight : {
					max : 3,
					min : 1
				},

				'2' : [0.72, 0.73, 0.69],
				'3' : [0.78, 0.69, 0.88]
			},

			INNING : {
				weight : {
					max : 2,
					min : 0
				},

				//ranges (innings 1-3), (3-6), (7+)

				'1' : {
					LL : 25,
					LR : 47.8,
					RL : 40,
					RR : 34.8
				},
				'2' : {
					LL : 41.7,
					LR : 26.1,
					RL : 33.3,
					RR : 40.2
				},
				'3' : {
					'LL' : 33.3,
					'LR' : 26.1,
					'RL' : 26.7,
					'RR' : 25
				}
			},

			PITCHER_CATCHER : {
				weight : {
					max : 3,
					min : 1
				}
			},

			SCORE : {
				weight : {
					max : 0.7,
					min : 0.3
				},

				//inning range multipliers for tied score

				'1' : 3,
				'2' : 2,
				'3' : 1
			}
		}
	});	

}