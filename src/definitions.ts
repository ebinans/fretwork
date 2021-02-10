//----------------------------------------------------------------------------------------------------------------------
/**
 * @author Edgars Bināns <edgars@eb.lv>
 * @copyright Copyright (c) 2021 Edgars Bināns
 * @license MIT
 */
//----------------------------------------------------------------------------------------------------------------------

// //0    1     2    3    4     5    6     7    8    9     10   11
// ["A", "A♯", "B", "C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯"];

//----------------------------------------------------------------------------------------------------------------------

export interface Instrument
{
	readonly name: string;
	readonly strings: number;
	readonly dots: readonly number[];
	readonly frets: number;
	readonly tuning: readonly {
		readonly name: string;
		readonly pitches: readonly number[];
	}[];
}

export const INSTRUMENTS: readonly Instrument[] = [
	{
		name: "Guitar",
		strings: 6,
		dots: [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2],
		frets: 22,
		tuning: [
			{
				name: "Standard",
				pitches: [7, 12, 17, 22, 26, 31],
			},
			{
				name: "Drop A",
				pitches: [0, 7, 12, 17, 21, 26],
			},
			{
				name: "Drop B",
				pitches: [2, 9, 14, 19, 23, 28],
			},
			{
				name: "Drop C",
				pitches: [3, 10, 15, 20, 24, 29],
			},
			{
				name: "Drop D",
				pitches: [5, 12, 17, 22, 26, 31],
			},
			{
				name: "Double Drop D",
				pitches: [5, 12, 17, 22, 26, 29],
			},
			{
				name: "D Modal",
				pitches: [5, 12, 17, 22, 24, 29],
			},
			{
				name: "G Modal",
				pitches: [5, 10, 17, 22, 27, 29],
			},
			{
				name: "Open A",
				pitches: [7, 12, 16, 19, 24, 31],
			},
			{
				name: "Open C",
				pitches: [3, 10, 15, 22, 27, 31],
			},
			{
				name: "Open C6",
				pitches: [3, 12, 15, 22, 27, 31],
			},
			{
				name: "Open D",
				pitches: [5, 12, 17, 21, 24, 29],
			},
			{
				name: "Open E",
				pitches: [7, 14, 19, 23, 26, 31],
			},
			{
				name: "Open G",
				pitches: [5, 10, 17, 22, 26, 29],
			},
			{
				name: "New Standard",
				pitches: [3, 10, 17, 24, 31, 34],
			},
		],
	},
	{
		name: "Bass guitar",
		strings: 4,
		dots: [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2],
		frets: 20,
		tuning: [
			{
				name: "Standard",
				pitches: [-5, 0, 5, 10],
			},
		],
	},
	{
		name: "Bass guitar, 5 string",
		strings: 5,
		dots: [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2],
		frets: 20,
		tuning: [
			{
				name: "Standard",
				pitches: [-10, -5, 0, 5, 10],
			},
		],
	},
	{
		name: "Ukulele",
		strings: 4,
		dots: [0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 2, 0, 0, 1],
		frets: 16,
		tuning: [
			{
				name: "Soprano in C",
				pitches: [10, 3, 7, 12].map(x => x + 24),
			},
		],
	},
] as const;

//----------------------------------------------------------------------------------------------------------------------

export interface Scale
{
	readonly name: string;
	readonly degrees: readonly number[];
	readonly add?: readonly number[];
	readonly selected?: boolean;
}

export interface ScaleGroup
{
	readonly label: string;
	readonly scales: readonly Scale[];
}

export const SCALES: readonly ScaleGroup[] = [
	{
		label: "Chromatic",
		scales: [
			{
				name: "Chromatic",
				degrees: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			},
		],
	},
	{
		label: "Diatonic",
		scales: [
			{
				name: "Major (Ionian)",
				degrees: [0, 2, 4, 5, 7, 9, 11],
			},
			{
				name: "Dorian",
				degrees: [0, 2, 3, 5, 7, 9, 10],
			},
			{
				name: "Phrygian",
				degrees: [0, 1, 3, 5, 7, 8, 10],
			},
			{
				name: "Lydian",
				degrees: [0, 2, 4, 6, 7, 9, 11],
			},
			{
				name: "Mixolydian",
				degrees: [0, 2, 4, 5, 7, 9, 10],
			},
			{
				name: "Minor (Aeolian)",
				degrees: [0, 2, 3, 5, 7, 8, 10],
				selected: true,
			},
			{
				name: "Locrian",
				degrees: [0, 1, 3, 5, 6, 8, 10],
			},
		],
	},
	{
		label: "Heptatonic",
		scales: [
			{
				name: "Harmonic minor",
				degrees: [0, 2, 3, 5, 7, 8, 11],
			},
			{
				name: "Melodic minor",
				degrees: [0, 2, 3, 5, 7, 9, 11],
			},
		],
	},
	{
		label: "Pentatonic",
		scales: [
			{
				name: "Major pentatonic",
				degrees: [0, 2, 4, -1, 7, 9, -1],
			},
			{
				name: "Minor pentatonic",
				degrees: [0, -1, 3, 5, 7, -1, 10],
			},
		],
	},
	{
		label: "Hexatonic",
		scales: [
			{
				name: "Blues major",
				degrees: [0, 2, 4, -1, 7, 9, -1],
				add: [3],
			},
			{
				name: "Blues minor",
				degrees: [0, -1, 3, 5, 7, -1, 10],
				add: [6],
			},
		],
	},
] as const;

//----------------------------------------------------------------------------------------------------------------------
// EOF
//----------------------------------------------------------------------------------------------------------------------
