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

export enum ScaleId
{
	Chromatic,
	MajorIonian,
	Dorian,
	Phrygian,
	Lydian,
	Mixolydian,
	MinorAeolian,
	Locrian,
	HarmonicMinor,
	MelodicMinor,
	MajorPentatonic,
	MinorPentatonic,
	BluesMajor,
	BluesMinor,
}

export enum TuningId
{
	GuitarStandard,
	GuitarDropA,
	GuitarDropB,
	GuitarDropC,
	GuitarDropD,
	GuitarDoubleDropD,
	GuitarDModal,
	GuitarGModal,
	GuitarOpenA,
	GuitarOpenC,
	GuitarOpenC6,
	GuitarOpenD,
	GuitarOpenE,
	GuitarOpenG,
	GuitarNewStandard,
	BassGuitarStandard,
	BassGuitar5Standard,
	UkuleleSopranoC,
}

//----------------------------------------------------------------------------------------------------------------------

export interface Instrument
{
	readonly name: string;
	readonly strings: number;
	readonly dots: readonly number[];
	readonly frets: number;
	readonly tuning: readonly {
		readonly name: string;
		readonly tuningId: TuningId;
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
				tuningId: TuningId.GuitarStandard,
				pitches: [7, 12, 17, 22, 26, 31],
			},
			{
				name: "Drop A",
				tuningId: TuningId.GuitarDropA,
				pitches: [0, 7, 12, 17, 21, 26],
			},
			{
				name: "Drop B",
				tuningId: TuningId.GuitarDropB,
				pitches: [2, 9, 14, 19, 23, 28],
			},
			{
				name: "Drop C",
				tuningId: TuningId.GuitarDropC,
				pitches: [3, 10, 15, 20, 24, 29],
			},
			{
				name: "Drop D",
				tuningId: TuningId.GuitarDropD,
				pitches: [5, 12, 17, 22, 26, 31],
			},
			{
				name: "Double Drop D",
				tuningId: TuningId.GuitarDoubleDropD,
				pitches: [5, 12, 17, 22, 26, 29],
			},
			{
				name: "D Modal",
				tuningId: TuningId.GuitarDModal,
				pitches: [5, 12, 17, 22, 24, 29],
			},
			{
				name: "G Modal",
				tuningId: TuningId.GuitarGModal,
				pitches: [5, 10, 17, 22, 27, 29],
			},
			{
				name: "Open A",
				tuningId: TuningId.GuitarOpenA,
				pitches: [7, 12, 16, 19, 24, 31],
			},
			{
				name: "Open C",
				tuningId: TuningId.GuitarOpenC,
				pitches: [3, 10, 15, 22, 27, 31],
			},
			{
				name: "Open C6",
				tuningId: TuningId.GuitarOpenC6,
				pitches: [3, 12, 15, 22, 27, 31],
			},
			{
				name: "Open D",
				tuningId: TuningId.GuitarOpenD,
				pitches: [5, 12, 17, 21, 24, 29],
			},
			{
				name: "Open E",
				tuningId: TuningId.GuitarOpenE,
				pitches: [7, 14, 19, 23, 26, 31],
			},
			{
				name: "Open G",
				tuningId: TuningId.GuitarOpenG,
				pitches: [5, 10, 17, 22, 26, 29],
			},
			{
				name: "New Standard",
				tuningId: TuningId.GuitarNewStandard,
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
				tuningId: TuningId.BassGuitarStandard,
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
				tuningId: TuningId.BassGuitar5Standard,
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
				tuningId: TuningId.UkuleleSopranoC,
				pitches: [10, 3, 7, 12].map(x => x + 24),
			},
		],
	},
] as const;

//----------------------------------------------------------------------------------------------------------------------

export interface Scale
{
	readonly name: string;
	readonly scaleId: ScaleId;
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
				scaleId: ScaleId.Chromatic,
				degrees: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			},
		],
	},
	{
		label: "Diatonic",
		scales: [
			{
				name: "Major (Ionian)",
				scaleId: ScaleId.MajorIonian,
				degrees: [0, 2, 4, 5, 7, 9, 11],
			},
			{
				name: "Dorian",
				scaleId: ScaleId.Dorian,
				degrees: [0, 2, 3, 5, 7, 9, 10],
			},
			{
				name: "Phrygian",
				scaleId: ScaleId.Phrygian,
				degrees: [0, 1, 3, 5, 7, 8, 10],
			},
			{
				name: "Lydian",
				scaleId: ScaleId.Lydian,
				degrees: [0, 2, 4, 6, 7, 9, 11],
			},
			{
				name: "Mixolydian",
				scaleId: ScaleId.Mixolydian,
				degrees: [0, 2, 4, 5, 7, 9, 10],
			},
			{
				name: "Minor (Aeolian)",
				scaleId: ScaleId.MinorAeolian,
				degrees: [0, 2, 3, 5, 7, 8, 10],
			},
			{
				name: "Locrian",
				scaleId: ScaleId.Locrian,
				degrees: [0, 1, 3, 5, 6, 8, 10],
			},
		],
	},
	{
		label: "Heptatonic",
		scales: [
			{
				name: "Harmonic minor",
				scaleId: ScaleId.HarmonicMinor,
				degrees: [0, 2, 3, 5, 7, 8, 11],
			},
			{
				name: "Melodic minor",
				scaleId: ScaleId.MelodicMinor,
				degrees: [0, 2, 3, 5, 7, 9, 11],
			},
		],
	},
	{
		label: "Pentatonic",
		scales: [
			{
				name: "Major pentatonic",
				scaleId: ScaleId.MajorPentatonic,
				degrees: [0, 2, 4, -1, 7, 9, -1],
			},
			{
				name: "Minor pentatonic",
				scaleId: ScaleId.MinorPentatonic,
				degrees: [0, -1, 3, 5, 7, -1, 10],
				selected: true,
			},
		],
	},
	{
		label: "Hexatonic",
		scales: [
			{
				name: "Blues major",
				scaleId: ScaleId.BluesMajor,
				degrees: [0, 2, 4, -1, 7, 9, -1],
				add: [3],
			},
			{
				name: "Blues minor",
				scaleId: ScaleId.BluesMinor,
				degrees: [0, -1, 3, 5, 7, -1, 10],
				add: [6],
			},
		],
	},
] as const;

//----------------------------------------------------------------------------------------------------------------------

export interface Pattern
{
	readonly tunings: readonly TuningId[];
	readonly scales: readonly ScaleId[];
	readonly pattern: readonly {
		readonly name: string;
		readonly pattern: ReadonlyArray<ReadonlyArray<number>>;
	}[];
}

export const PATTERNS: readonly Pattern[] =
	[
		{
			tunings: [TuningId.GuitarStandard],
			scales: [
				ScaleId.MajorIonian,
				ScaleId.Dorian,
				ScaleId.Phrygian,
				ScaleId.Lydian,
				ScaleId.Mixolydian,
				ScaleId.MinorAeolian,
				ScaleId.Locrian,
			],
			pattern: [
				{
					name: "1",
					pattern: [
						[1, 1, 0, 1],
						[0, 1, 0, 1],
						[1, 0, 1, 1],
						[1, 0, 1, 1],
						[1, 1, 0, 1],
						[1, 1, 0, 1],
					]
				},
				{
					name: "2",
					pattern: [
						[0, 1, 0, 1, 1],
						[0, 1, 0, 1, 1],
						[1, 1, 0, 1, 0],
						[1, 1, 0, 1, 0],
						[0, 1, 0, 1, 0],
						[0, 1, 0, 1, 1],
					]
				},
				{
					name: "3",
					pattern: [
						[1, 1, 0, 1],
						[1, 1, 0, 1],
						[1, 0, 1, 0],
						[1, 0, 1, 1],
						[1, 0, 1, 1],
						[1, 1, 0, 1],
					]
				},
				{
					name: "4",
					pattern: [
						[0, 1, 0, 1, 0],
						[0, 1, 0, 1, 1],
						[1, 0, 1, 1, 0],
						[1, 1, 0, 1, 0],
						[1, 1, 0, 1, 0],
						[0, 1, 0, 1, 0],
					]
				},
				{
					name: "5",
					pattern: [
						[0, 1, 0, 1, 1],
						[0, 1, 1, 0, 1],
						[1, 1, 0, 1, 0],
						[0, 1, 0, 1, 0],
						[0, 1, 0, 1, 1],
						[0, 1, 0, 1, 1],
					]
				},
			],
		},
		{
			tunings: [TuningId.GuitarStandard],
			scales: [
				ScaleId.MajorPentatonic,
				ScaleId.MinorPentatonic,
			],
			pattern: [
				{
					name: "1",
					pattern: [
						[0, 1, 0, 1],
						[0, 1, 0, 1],
						[1, 0, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[0, 1, 0, 1],
					]
				},
				{
					name: "2",
					pattern: [
						[0, 1, 0, 1, 0],
						[0, 1, 0, 0, 1],
						[1, 0, 0, 1, 0],
						[0, 1, 0, 1, 0],
						[0, 1, 0, 1, 0],
						[0, 1, 0, 1, 0],
					]
				},
				{
					name: "3",
					pattern: [
						[1, 0, 0, 1],
						[0, 1, 0, 1],
						[1, 0, 1, 0],
						[1, 0, 1, 0],
						[1, 0, 0, 1],
						[1, 0, 0, 1],
					]
				},
				{
					name: "4",
					pattern: [
						[0, 1, 0, 1, 0],
						[0, 1, 0, 1, 0],
						[1, 0, 0, 1, 0],
						[1, 0, 0, 1, 0],
						[0, 1, 0, 1, 0],
						[0, 1, 0, 1, 0],
					]
				},
				{
					name: "5",
					pattern: [
						[0, 1, 0, 0, 1],
						[0, 1, 0, 0, 1],
						[0, 1, 0, 1, 0],
						[0, 1, 0, 1, 0],
						[0, 1, 0, 1, 0],
						[0, 1, 0, 0, 1],
					]
				},
				{
					name: "3 octaves",
					pattern: [
						[-1, +0, +0, -1, +0, -1, +0, -1, +0, +0, +1, +0, +1],
						[-1, +0, +0, -1, +0, -1, +0, +0, +1, +0, +1, +0, +1],
						[-1, +0, -1, +0, -1, +0, +0, +1, +0, +1, +0, +0, -1],
						[-1, +0, -1, +0, +0, +1, +0, +1, +0, +1, +0, +0, -1],
						[-1, +0, -1, +0, +0, +1, +0, +1, +0, +0, -1, +0, -1],
						[+1, +0, +0, +1, +0, +1, +0, +1, +0, +0, -1, +0, -1],
					]
				},
			],
		},
		{
			tunings: [TuningId.GuitarStandard],
			scales: [
				ScaleId.BluesMajor,
				ScaleId.BluesMinor,
			],
			pattern: [
				{
					name: "1",
					pattern: [
						[0, 1, 0, 1, 1],
						[0, 1, 0, 1, 0],
						[1, 1, 1, 0, 0],
						[1, 0, 0, 1, 0],
						[1, 0, 0, 1, 0],
						[0, 1, 0, 1, 1],
					]
				},
				{
					name: "2",
					pattern: [
						[0, 1, 1, 1, 0],
						[0, 1, 0, 0, 1],
						[1, 0, 0, 1, 0],
						[0, 1, 0, 1, 1],
						[0, 1, 0, 1, 0],
						[0, 1, 1, 1, 0],
					]
				},
				{
					name: "3",
					pattern: [
						[1, 0, 0, 1, 0],
						[0, 1, 0, 1, 1],
						[1, 0, 1, 0, 0],
						[1, 1, 1, 0, 0],
						[1, 0, 0, 1, 0],
						[1, 0, 0, 1, 0],
					]
				},
				{
					name: "4",
					pattern: [
						[0, 1, 0, 1, 0],
						[0, 1, 1, 1, 0],
						[1, 0, 0, 1, 0],
						[1, 0, 0, 1, 0],
						[0, 1, 0, 1, 1],
						[0, 1, 0, 1, 0],
					]
				},
				{
					name: "5",
					pattern: [
						[1, 0, 0, 1],
						[1, 0, 0, 1],
						[1, 0, 1, 1],
						[1, 0, 1, 0],
						[1, 1, 1, 0],
						[1, 0, 0, 1],
					]
				},
				{
					name: "3 octaves",
					pattern: [
						[-1, +0, -1, -1, -1, +0, +0, +1, +0, +1],
						[-1, +0, -1, +0, +0, +1, +0, +1, +1, +1],
						[-1, -1, +0, +0, +1, +0, +1, +0, +0, -1],
						[+0, +0, +1, +0, +1, +1, +1, +0, +0, -1],
						[+0, +0, +1, +0, +1, +0, +0, -1, +0, -1],
						[+1, +0, +1, +1, +1, +0, +0, -1, +0, -1],
					]
				},
			],
		},
	] as const;

//----------------------------------------------------------------------------------------------------------------------
// EOF
//----------------------------------------------------------------------------------------------------------------------
