module.exports = function(module){
	module.constant('baseRunningConstants', {
		BASE_RUNNING_SPEED_MULTIPLIER: 0.1,
		BASES_LEAD_OFF_DISTANCE_MIN: 9,
		BASES_LEAD_OFF_DISTANCE_MAX: 15,
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
			MIN_STEAL_SPD : 70,
			THROW_MULTIPLIER: 0.05,
			MIN_REACH_TIME_DIFF: 1,

			//base chances

			LL : {
				"2" : 5.87,
				"3" : 4.62,
				"4" : 0.03 //excel override
			},
			
			LR : {
				"2" : 6.28,
				"3" : 4.3,
				"4" : 0.02 //excel override
			},

			RL : {
				"2" : 5.81,
				"3" : 4.27,
				"4" : 0.04 //excel override
			},

			RR : {
				"2" : 5.88,
				"3" : 4.3,
				"4" : 0.02 // excel override
			},

			//DOUBLE/TRIPLE STEAL CHANCES

			//fangraphs.com/tht/steals-of-home-the-millennium-so-far/
			//'Of the 190 steals'... paragraph
			DOUBLE_2ND_HOME : 67.8,

			//factors

			BREAK_EVEN_RATES : {
				weight : {
					max : 5,
					min : 3
				},

				"2" : [0.72, 0.73, 0.69],
				"3" : [0.78, 0.69, 0.88],
				"4" : [0.87, 0.70, 0.34]
			},

			INNING : {
				weight : {
					max : 4,
					min : 2
				},

				//ranges (innings 1-3), (3-6), (7+)

				"1" : {
					LL : 25,
					LR : 47.8,
					RL : 40,
					RR : 34.8
				},
				"2" : {
					LL : 41.7,
					LR : 26.1,
					RL : 33.3,
					RR : 40.2
				},
				"3" : {
					"LL" : 33.3,
					"LR" : 26.1,
					"RL" : 26.7,
					"RR" : 25
				}
			},

			PITCHER_CATCHER : {
				weight : {
					max : 4,
					min : 3
				}
			},

			SCORE : {
				weight : {
					max : 0.9,
					min : 0.5
				},

				//inning range multipliers for tied score

				"1" : 3,
				"2" : 2,
				"3" : 1
			}
		}
	});	

}