//----------------------------------------------------------------------------------------------------------------------
/**
 * @author Edgars Bināns <edgars@eb.lv>
 * @copyright Copyright (c) 2021 Edgars Bināns
 * @license MIT
 */
//----------------------------------------------------------------------------------------------------------------------

import { PainterSvg } from './PainterSvg';
import { PainterPdf } from './PainterPdf';
import { Painter } from './Painter';
import { Utils } from './Utils';
import { Scale, INSTRUMENTS, SCALES } from './definitions';

//----------------------------------------------------------------------------------------------------------------------

function e<T>(id: string): T
{
	return document.getElementById(id) as unknown as T;
}

//----------------------------------------------------------------------------------------------------------------------

class Fretboard
{
	static CHROMATIC_NOTES: readonly (readonly string[])[] = [
		//0    1     2    3    4     5    6     7    8    9     10   11
		["A", "A♯", "B", "C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯"],
		["A", "B♭", "B", "C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭"],
	] as const;

	private static BASE_NOTES: readonly (readonly [string, number])[] = [
		["A", 0],
		["B", 2],
		["C", 3],
		["D", 5],
		["E", 7],
		["F", 8],
		["G", 10],
	] as const;

	private static PAGE_SIZES: readonly (readonly [number, number])[] = [
		[297, 210],
		[210, 297],
		[279.4, 215.9],
		[215.9, 279.4],
	] as const;

	private static readonly PAGE_TOP = 15;
	private static readonly PAGE_BOTTOM = 15;

	private static readonly LEFT = 25;
	private static readonly RIGHT = 20;

	private static readonly STRING_TOP = 30;
	private static readonly STRING_SPACING = 6;

	// https://personal.sron.nl/~pault/#fig:scheme_light
	private static COLORS: readonly string[] =
		["#77aadd", "#eedd88", "#ee8866", "#99ddff", "#bbcc33", "#ffaabb", "#44bb99", "#dddddd", "aaaa00"] as const;

	fileTitle = "";

	private title = "";
	private printStarted = false;

	private readonly freatboard: SVGGElement = e("fretboard");

	private readonly domPage: HTMLInputElement = e("page");
	private readonly domFrets: HTMLInputElement = e("frets");
	private readonly domInstrument: HTMLInputElement = e("instrument");
	private readonly domAccidental: HTMLInputElement = e("accidental");
	private readonly domInstrumentName: HTMLSpanElement = e("name");
	private readonly domFlat: HTMLOptionElement = e("flat");
	private readonly domSharp: HTMLOptionElement = e("sharp");
	private readonly domCapo: HTMLInputElement = e("capo");

	darwFretboard(painter: Painter)
	{
		const paramInstrument = JSON.parse(this.domInstrument.value) as [number, number];
		const paramKey = parseInt(e<HTMLInputElement>("key").value);
		const paramScale = JSON.parse(e<HTMLInputElement>("scale").value) as [number, number];
		const paramPage = parseInt(this.domPage.value);
		const paramCapo = parseInt(this.domCapo.value);
		const paramFrets = Math.max(parseInt(this.domFrets.value) - paramCapo, 1);
		const paramAccidental = parseInt(this.domAccidental.value);

		const instrument = INSTRUMENTS[paramInstrument[0]];
		const tuning = INSTRUMENTS[paramInstrument[0]].tuning[paramInstrument[1]];

		this.domInstrumentName.innerText = instrument.name;

		const scale = SCALES[paramScale[0]].scales[paramScale[1]];

		if (scale.degrees.length == 7)
		{
			let bn = Fretboard.getBaseNotes(paramKey, -1, scale);

			if (bn[0] && this.domFlat.selected)
			{
				this.domAccidental.value = "0";
			}

			this.domFlat.disabled = bn[0];

			bn = Fretboard.getBaseNotes(paramKey, 1, scale);

			if (bn[0] && this.domSharp.selected)
			{
				this.domAccidental.value = "0";
			}

			this.domSharp.disabled = bn[0];
		}
		else
		{
			this.domFlat.disabled = false;
			this.domSharp.disabled = false;
		}

		const pageW = Fretboard.PAGE_SIZES[paramPage][0];
		const pageH = Fretboard.PAGE_SIZES[paramPage][1];

		const degrees =
			scale.degrees.map((x) => (x < 0 ? -1 : Utils.uMod(x + paramKey + paramAccidental, 12)));

		let degreesAdd = scale.add;

		if (degreesAdd)
		{
			degreesAdd =
				degreesAdd.map((x) => (x < 0 ? -1 : Utils.uMod(x + paramKey + paramAccidental, 12)));
		}

		const fretSpacing = (pageW - Fretboard.LEFT - Fretboard.RIGHT) / paramFrets;

		painter.page(pageW, pageH);

		let notes: readonly string[];

		if (scale.degrees.length == 7)
		{
			notes = Fretboard.getBaseNotes(paramKey, paramAccidental, scale)[1];
		}
		else
		{
			notes = Fretboard.CHROMATIC_NOTES[paramAccidental >= 0 ? 0 : 1];
		}

		const acc = paramAccidental == -1 ? "♭ " : paramAccidental == 1 ? "♯ " : " ";

		this.title =
			`${instrument.name}: ${tuning.name} tuning; ${Fretboard.CHROMATIC_NOTES[0][paramKey]}${acc}${scale.name} scale`;

		if (paramCapo)
		{
			this.title += `; Capo ${Utils.toRoman(paramCapo)} fret`;
		}

		this.fileTitle = this.title.replace(/♯/g, " sharp").replace(/♭/g, " flat").replace(/[^A-Za-z0-9]+/g, "_");

		painter.textMiddle(this.title, pageW / 2, Fretboard.PAGE_TOP, 4);
		painter.textMiddle(
			"fretwork.eb.lv",
			pageW / 2,
			pageH - Fretboard.PAGE_BOTTOM,
			undefined,
			"https://fretwork.eb.lv");

		for (let x = 0; x < paramFrets + 1; ++x)
		{
			painter.line(
				Fretboard.LEFT + fretSpacing * x,
				Fretboard.STRING_TOP,
				Fretboard.LEFT + fretSpacing * x,
				Fretboard.STRING_TOP + (instrument.strings - 1) * Fretboard.STRING_SPACING,
				(x == 0) ? "#555555" : "#CCCCCC",
				(x == 0) ? 1.5 : 1,
				(x == 0) ? "square" : "round");
		}

		if (paramCapo)
		{
			painter.textMiddle(
				"Capo " + Utils.toRoman(paramCapo),
				Fretboard.LEFT,
				Fretboard.STRING_TOP - 5,
				undefined,
				undefined,
				Utils.adjustBrightness("#ee8866", 0.8));
		}

		for (let y = 0; y < instrument.strings; ++y)
		{
			painter.line(
				Fretboard.LEFT,
				Fretboard.STRING_TOP + y * Fretboard.STRING_SPACING,
				pageW - Fretboard.RIGHT,
				Fretboard.STRING_TOP + y * Fretboard.STRING_SPACING,
				"black",
				0.2);
		}

		if (instrument.dots)
		{
			const dots = instrument.dots.slice(paramCapo);

			for (let x = 0; x < Math.min(dots.length, paramFrets); ++x)
			{
				for (let i = 0; i < dots[x]; ++i)
				{
					painter.circle(
						Fretboard.STRING_SPACING / 6,
						Fretboard.LEFT + (x + 1) * fretSpacing - fretSpacing / 2,
						Fretboard.STRING_TOP + instrument.strings * Fretboard.STRING_SPACING + i * (Fretboard.STRING_SPACING / 3 + 0.5),
						"grey");
				}
			}
		}

		for (let y = instrument.strings - 1; y > -1; --y)
		{
			for (let x = 0; x < paramFrets + 1; ++x)
			{
				const pitch = tuning.pitches[instrument.strings - y - 1] + paramCapo + x;

				const noteIndex = Utils.uMod(pitch, notes.length);

				if (degrees.includes(noteIndex) || degreesAdd?.includes(noteIndex))
				{
					const colorIndex = Math.floor((12 + pitch - degrees[0]) / notes.length) + 1;

					const circleColor = Utils.adjustBrightness(Fretboard.COLORS[colorIndex], 0.8);
					let circleFillColor = Fretboard.COLORS[colorIndex];

					if (noteIndex == degrees[0])
					{
						circleFillColor = "white";
					}

					let cx = Fretboard.LEFT + x * fretSpacing - fretSpacing / 2;

					if (x == 0)
					{
						cx = Fretboard.LEFT - (Fretboard.STRING_SPACING * 2) / 2.5;
					}

					painter.circle(
						Fretboard.STRING_SPACING / 2.5,
						cx,
						Fretboard.STRING_TOP + y * Fretboard.STRING_SPACING,
						circleFillColor,
						circleColor,
						0.5);

					painter.textMiddle(
						notes[noteIndex],
						cx,
						Fretboard.STRING_TOP + y * Fretboard.STRING_SPACING);
				}
			}
		}
	}

	darwFretboardSvg(event: Event)
	{
		if (this.freatboard)
		{
			while (this.freatboard.firstChild)
			{
				this.freatboard.firstChild.remove();
			}

			const paramInstrument = JSON.parse(this.domInstrument.value) as [number, number];
			const instrument = INSTRUMENTS[paramInstrument[0]];

			this.domInstrumentName.innerText = instrument.name;

			if (instrument.frets && event.target == this.domInstrument)
			{
				this.domFrets.value = instrument.frets.toString();
				this.domCapo.value = "0";
			}

			const painter = new PainterSvg();

			this.darwFretboard(painter);

			this.freatboard.appendChild(painter.getSvg());

			this.resizeFretboard(event);
		}
	}

	resizeFretboard(event: Event)
	{
		const svg = this.freatboard.firstChild as SVGSVGElement;

		if (this.freatboard && svg)
		{
			if (event.type == "beforeprint")
			{
				this.printStarted = true;
			}
			else if (event.type == "afterprint")
			{
				this.printStarted = false;
			}

			let scale = 1;

			if (this.freatboard.parentElement && !this.printStarted)
			{
				const scaleW = this.freatboard.parentElement.clientWidth / svg.width.baseVal.value;
				const scaleH = this.freatboard.parentElement.clientHeight / svg.height.baseVal.value;
				scale = Math.min(scaleW, scaleH);
			}
			else
			{
				const style = document.querySelector("style");
				if (style)
				{
					style.textContent += "@media print { @page { size: ";

					switch (this.domPage.value)
					{
						default:
						case "0":
							style.textContent += "A4 landscape";
							break;
						case "1":
							style.textContent += "A4 portrait";
							break;
						case "2":
							style.textContent += "Letter landscape";
							break;
						case "3":
							style.textContent += "Letter portrait";
							break;
					}

					style.textContent += "; } }";
				}
			}

			const trans = svg.createSVGTransform();
			trans.setScale(scale, scale);
			this.freatboard.transform.baseVal.clear();
			this.freatboard.transform.baseVal.appendItem(trans);
		}
	}

	private static getBaseNotes(
		paramKey: number,
		paramAccidental: number,
		scale: Scale
	): [boolean, string[], number, number]
	{
		const degrees = scale.degrees.map((x) => (x < 0 ? -1 : Utils.uMod(x + paramKey + paramAccidental, 12)));
		const baseIndex = Fretboard.BASE_NOTES.findIndex((x) => x[1] == paramKey);

		function distance(first: number, second: number, max: number): number
		{
			const dist = Math.abs(second - first);

			if (dist < max - dist)
			{
				const direction = first < second ? 1 : -1;
				return dist * direction;
			}
			else
			{
				const direction = first < second ? -1 : 1;
				return (max - dist) * direction;
			}
		}

		let retval: string[] = [];
		let hasDouble = false;
		let flats = 0;
		let sharps = 0;

		for (let i = baseIndex; i < Fretboard.BASE_NOTES.length + baseIndex; ++i)
		{
			if (degrees[i - baseIndex] < 0)
			{
				continue;
			}

			const ix = Utils.uMod(i, Fretboard.BASE_NOTES.length);
			const acc = distance(Fretboard.BASE_NOTES[ix][1], degrees[i - baseIndex], 12);

			let note = Fretboard.BASE_NOTES[ix][0];

			switch (acc)
			{
				case 1:
					note += "♯";
					++sharps;
					break;
				case 2:
					note += "𝄪";
					hasDouble = true;
					sharps += 2;
					break;
				case -1:
					note += "♭";
					++flats;
					break;
				case -2:
					note += "𝄫";
					hasDouble = true;
					flats += 2;
					break;
			}

			retval[degrees[i - baseIndex]] = note;
		}

		for (let i = 0; i < Fretboard.CHROMATIC_NOTES[flats ? 1 : 0].length; ++i)
		{
			if (retval[i] == undefined)
			{
				retval[i] = Fretboard.CHROMATIC_NOTES[flats ? 1 : 0][i];
			}
		}

		return [hasDouble, retval, flats, sharps];
	}
}

//----------------------------------------------------------------------------------------------------------------------

window.addEventListener("DOMContentLoaded", () =>
{
	const fb = new Fretboard();

	window.addEventListener("load", fb.darwFretboardSvg.bind(fb));

	window.addEventListener("resize", fb.resizeFretboard.bind(fb));
	window.addEventListener("beforeprint", fb.resizeFretboard.bind(fb));
	window.addEventListener("afterprint", fb.resizeFretboard.bind(fb));

	const domInstrument: HTMLSelectElement = e("instrument");

	if (domInstrument)
	{
		for (let i = 0; i < INSTRUMENTS.length; ++i)
		{
			const opG = document.createElement("optgroup");

			opG.label = INSTRUMENTS[i].name;

			for (let j = 0; j < INSTRUMENTS[i].tuning.length; ++j)
			{
				const op = document.createElement("option");

				op.value = `[${i}, ${j}]`;
				op.text = INSTRUMENTS[i].tuning[j].name + " (";

				INSTRUMENTS[i].tuning[j].pitches.forEach((x: number) =>
				{
					op.text += Fretboard.CHROMATIC_NOTES[0][Utils.uMod(x, 12)] + "\uFE0E" +
						String.fromCharCode(0x2080 + Math.floor(2 + (x - 3) / 12));
				});

				op.text += ")";

				opG.appendChild(op);
			}

			domInstrument.appendChild(opG);
		}
	}

	const domScale: HTMLSelectElement = e("scale");

	if (domScale)
	{
		for (let i = 0; i < SCALES.length; ++i)
		{
			const opG = document.createElement("optgroup");

			opG.label = SCALES[i].label;

			for (let j = 0; j < SCALES[i].scales.length; ++j)
			{
				const op = document.createElement("option");

				op.value = `[${i}, ${j}]`;
				op.text = SCALES[i].scales[j].name;

				if (SCALES[i].scales[j].selected)
				{
					op.selected = true;
				}

				opG.appendChild(op);
			}

			domScale.appendChild(opG);
		}
	}

	const toUpdate = ["instrument", "frets", "capo", "key", "accidental", "scale", "page"];

	toUpdate.forEach((element) =>
	{
		e<HTMLElement>(element)?.addEventListener("change", fb.darwFretboardSvg.bind(fb));
	});

	const domSaveSvg: HTMLButtonElement = e("save_svg");
	domSaveSvg?.addEventListener("click", () =>
	{
		const svg: SVGGElement = e("fretboard");

		if (svg)
		{
			const fileContent =
				'data:image/svg+xml,' + encodeURIComponent('<?xml version="1.0" encoding="UTF-8"?>' + svg.innerHTML);

			Utils.saveAs(fileContent, fb.fileTitle);
		}
	});

	const domSavePdf: HTMLButtonElement = e("save_pdf");
	domSavePdf?.addEventListener("click", () =>
	{
		const pdf = new PainterPdf();

		pdf.loadFonts().then(() =>
		{
			fb.darwFretboard(pdf);
			pdf.savePdf(fb.fileTitle);
		});
	});
});

//----------------------------------------------------------------------------------------------------------------------
// EOF
//----------------------------------------------------------------------------------------------------------------------
