/**
 * General constants used throughout the application.
 */
module.exports = function(module){
	module.constant('appConstants', {
		BULLPEN_INITIAL_TOGGLE: 'View',
		BULLPEN_SECONDARY_TOGGLE: 'Hide',
		HIT_BY_PITCH: 'HBP',
		WALK: 'WALK',
		FIELDED_OUT: 'FIELDED OUT',
		HOMERUN: 'HOMERUN',
		STRIKE: 'STRIKE',
		BALL: 'BALL',
		ADVANCE: 'ADVANCE',
		REMOVE: 'REMOVE',
		ADVANCE_BATTER_ONLY: 'ADVANCE BATTER ONLY',
		NO_PLAY: 'NO PLAY',
		LEFT: 'L',
		CENTER: 'C',
		RIGHT: 'R',
		LEFT_CENTER: 'LC',
		RIGHT_CENTER: 'RC',
		FLY_OUT_INDICATOR: 'F',
		GROUND_OUT_INDICATOR: 'G',
		HOME: 'HOME',

		PLAYER_SKILLS_DISPLAY: {
			GENERAL: [
				'Hit Power',
				'Propensity to Swing',
				'Consistency'
			],
			OUTFIELD: [
				'Run Speed',
				'Throw Power'
			],
			INFIELD: [
				'Throw Power',
				'Run Speed'
			],
			PITCHERS: [
				'Fastball',
				'Slider',
				'Curveball',
				'Changeup'
			]
		},

		BALLS_FOR_DISPLAY : {
		   '0' : 'No BALLs',
		   '1' : '1 BALL',
		   '2' : '2 BALLs',
		   '3' : '3 BALLs'
		},

		STRIKES_FOR_DISPLAY : {
		   '0' : 'No STRIKEs',
		   '1' : '1 STRIKE',
		   '2' : '2 STRIKEs'
		},

		OUTS_FOR_DISPLAY : {
		   '0' : 'no outs',
		   '1' : '1 out',
		   '2' : '2 outs'
		},

		NUMBERS_WORDS_FOR_DISPLAY : {
		   '1' : 'one',
		   '2' : 'two',
		   '3' : 'three',
		   '4' : 'four',
		   '5' : 'five'
		},

		NUMBERS_FOR_DISPLAY : {
			'1': '1st',
			'2': '2nd',
			'3': '3rd',
			'4': '4th',
			'5': '5th',
			'6': '6th',
			'7': '7th',
			'8': '8th',
			'9': '9th',
			'10': '10th',
			'11': '11th',
			'12': '12th',
			'13': '13th',
			'14': '14th',
			'15': '15th',
			'16': '16th',
			'17': '17th',
			'18': '18th',
			'19': '19th',
			'20': '20th'
		},

		BASES_FOR_DISPLAY : {
			'1': '1st base',
			'2': '2nd base',
			'3': '3rd base',
			'4': 'home plate'
		},

		BASES_FOR_DISPLAY_SHORTHAND : {
			'1': '1st',
			'2': '2nd',
			'3': '3rd',
			'4': 'home plate'
		},

		STATS_DISPLAY: {
			HOMERUNS: 'HR',
			STOLEN_BASES: 'SB',
			CAUGHT_STEALING: 'CS',
			TWO_OUT_RBIS: 'twoOutRbis',
			SAC_BUNTS: 'sacBunts',
			SAC_FLYS: 'sacFlys',
			DOUBLES: 'doubles',
			TRIPLES: 'triples',
			LEFT_RISP_WITH_TWO_OUTS: 'leftRISPwithTwoOut',
			GIDP: 'GIDP',
			HITTING_WITH_RISP: 'hittingWithRISP',

			INNINGS_PITCHED: 'inningsPitched',
			HITS_ALLOWED: 'hitsAllowed',
			RUNS_ALLOWED: 'runsAllowed',
			BATTERS_WALKED: 'battersWalked',
			BATTERS_STRUCK_OUT: 'battersStruckOut',
			PITCHES: 'pitches',
			TOTAL_STRIKES: 'totalStrikes',
			CALLED_STRIKES: 'calledStrikes',
			SWINGING_STRIKES: 'swingingStrikes',
			FOUL_STRIKES: 'foulBalls',
			BALLS_PUT_INTO_PLAY: 'ballsPutIntoPlay',
			GROUNDOUTS: 'groundOuts',
			FLYOUTS: 'flyOuts',
			BATTERS_FACED: 'battersFaced',
			FIRST_PITCH_STRIKES: 'firstPitchStrikes'
		},

		GAME_PLAY: {
			POSITION_PROFILE : {
				C : {x : 200, y : 0, infield : true},
				P : {x : 200, y : 61, infield : true},
				'1B' : {x : 285, y : 70, infield : true, fieldSide : 'R'},
				'2B' : {x : 255, y : 140, infield : true, fieldSide : 'R'},
				SS : {x : 145, y : 140, infield : true, fieldSide : 'L'},
				'3B' : {x : 125, y : 70, infield : true, fieldSide : 'L'},
				LF : {x : 50, y : 255, fieldSide : 'L'},
				CF : {x : 200, y : 330},
				RF : {x : 350, y : 255, fieldSide : 'R'}
			},
			POSITIONS: {
				MR: 'Middle Reliever',
				PITCHER: 'P',
				CATCHER: 'C',
				FIRST_BASEMAN: '1B',
				SECOND_BASEMAN: '2B',
				THIRD_BASEMAN: '3B',
				SHORT_STOP: 'SS',
				CENTER_FIELDER: 'CF'
			},
			DEFAULT_CONSISTENCY_IF_100 : 95,
			DEFAULT_CONSISTENCY_IF_0 : 5,
			AVG_FPS_MOVED_FOR_HARDEST_PLAYS_MADE : 19.13,

			BASES : {
				'1' : {
					x : 263.6,
					y : 63.6,
					distance : 90,
					baseNumber : 1,
					baseId: '1B',
					baseName: '1st',
					outPriority: 1
				},
				'2' : {
					x : 200,
					y : 127.2,
					distance : 180,
					baseNumber : 2,
					baseId: '2B',
					baseName: '2nd',
					outPriority: 10
				},
				'3' : {
					x : 136.4,
					y : 63.6,
					distance : 270,
					baseNumber : 3,
					baseId: '3B',
					baseName: '3rd',
					outPriority: 200
				},
				'4' : {
					x : 200,
					y : 0,
					distance : 360,
					baseNumber : 4,
					baseId: 'HOME',
					//throw to home is lowest priority if there are other plays to be made
					outPriority: 500
				}
			},

			PAUSE_BETWEEN_PLAYS: 3000,
			PAUSE_ON_INNING_PA_END: 2000,
			PAUSE_FOR_PLAY_BY_PLAY: 530,
			INNING_END_TRANSITION_TIME: 3000,
			SHORT_TRANSITION_TIME: 2000,
			PITCH_RESULTING_COUNT_ANIMATION_TIME: 2000,
			PITCH_ANIMATION_PA_PITCH_NUMBER_TIME: 500,

			STRIKE_ZONE_BALL_SIZE: 13,
			STRIKE_ZONE_BALL_POSITION_DIVIDER: 2,
			STRIKE_ZONE_BALL_COLORS: {
				calledBall: '#ff0000',
				calledStrike: '#00ff00',
				swingingStrike: '#000000',
				putIntoPlay: '#fec43b',
				foul: '#aaaaaa',
				hitByPitch: '#0000ff'
			}
		}
		
	});	

}