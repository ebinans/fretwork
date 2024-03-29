﻿//----------------------------------------------------------------------------------------------------------------------
/**
 * @author Edgars Bināns <edgars@eb.lv>
 * @copyright Copyright (c) 2021 Edgars Bināns
 * @license MIT
 */
//----------------------------------------------------------------------------------------------------------------------

import { PainterSvg } from "./PainterSvg";
import { PainterPdf } from "./PainterPdf";
import { Painter } from "./Painter";
import { Utils } from "./Utils";
import { Scale, INSTRUMENTS, SCALES, PATTERNS } from "./definitions";
import tinycolor = require("tinycolor2");

//----------------------------------------------------------------------------------------------------------------------

function $<T = HTMLElement>(id: string): T
{
	const element = document.getElementById(id);

	if (!element)
	{
		throw new Error(`Element '${id}' not found`);
	}

	return (element as unknown) as T;
}

//----------------------------------------------------------------------------------------------------------------------

type Params = {
	page: number;
	frets: number;
	instrument: [number, number];
	key: number;
	scale: [number, number];
	capo: number;
	accidental: number;
};

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
	private static COLORS: readonly string[] = [
		"#99ddff",
		"#eedd88",
		"#ffaabb",
		"#77aadd",
		"#bbcc33",
		"#ee8866",
		"#44bb99",
		"#dddddd",
		"#aaaa00",
	] as const;

	fileTitle = "";

	private title = "";
	private printStarted = false;

	private readonly freatboard: SVGGElement = $("fretboard");

	private readonly dom = {
		page: $<HTMLInputElement>("page"),
		frets: $<HTMLInputElement>("frets"),
		instrument: $<HTMLInputElement>("instrument"),
		key: $<HTMLInputElement>("key"),
		scale: $<HTMLInputElement>("scale"),
		accidental: $<HTMLInputElement>("accidental"),
		instrumentName: $<HTMLSpanElement>("name"),
		flat: $<HTMLOptionElement>("flat"),
		sharp: $<HTMLOptionElement>("sharp"),
		capo: $<HTMLInputElement>("capo"),
		intervals: $<HTMLInputElement>("intervals")
	};

	private getUiParams(): Params
	{
		return {
			page: parseInt(this.dom.page.value),
			frets: parseInt(this.dom.frets.value) - parseInt(this.dom.capo.value),
			instrument: JSON.parse(this.dom.instrument.value) as [number, number],
			key: parseInt(this.dom.key.value),
			scale: JSON.parse(this.dom.scale.value) as [number, number],
			accidental: parseInt(this.dom.accidental.value),
			capo: parseInt(this.dom.capo.value),
		};
	}

	darwFretboard(painter: Painter): void
	{
		const param = this.getUiParams();

		const instrument = INSTRUMENTS[param.instrument[0]];
		const tuning = INSTRUMENTS[param.instrument[0]].tuning[param.instrument[1]];

		const scale = SCALES[param.scale[0]].scales[param.scale[1]];

		const pageW = Fretboard.PAGE_SIZES[param.page][0];
		const pageH = Fretboard.PAGE_SIZES[param.page][1];

		const degrees = scale.degrees.map(x => (x < 0 ? -1 : Utils.uMod(x + param.key + param.accidental, 12)));

		let degreesAdd = scale.add;

		if (degreesAdd)
		{
			degreesAdd = degreesAdd.map(x => (x < 0 ? -1 : Utils.uMod(x + param.key + param.accidental, 12)));
		}

		const fretSpacing = (pageW - Fretboard.LEFT - Fretboard.RIGHT) / param.frets;

		painter.page(pageW, pageH);

		let notes: readonly string[];


		if (this.dom.intervals.checked)
		{
			const notesx = ["R", "m2", "M2", "m3", "M3", "P4", "d5", "P5", "m6", "M6", "m7", "M7"];

			notes = notesx.slice(notesx.length - param.key - param.accidental)
				.concat(notesx.slice(0, notesx.length - param.key - param.accidental));
		}
		else if (scale.degrees.length == 7)
		{
			notes = Fretboard.getBaseNotes(param.key, param.accidental, scale)[1];
		}
		else
		{
			notes = Fretboard.CHROMATIC_NOTES[param.accidental >= 0 ? 0 : 1];
		}

		const acc = param.accidental == -1 ? "♭ " : param.accidental == 1 ? "♯ " : " ";

		this.title =
			`${instrument.name}: ${tuning.name} tuning; ${Fretboard.CHROMATIC_NOTES[0][param.key]
			}${acc}${scale.name} scale`;

		if (param.capo)
		{
			this.title += `; Capo ${Utils.toRoman(param.capo)} fret`;
		}

		this.fileTitle = this.title
			.replace(/♯/g, " sharp")
			.replace(/♭/g, " flat")
			.replace(/[^A-Za-z0-9]+/g, "_");

		painter.textMiddle(this.title, pageW / 2, Fretboard.PAGE_TOP, undefined, 4);

		painter.textMiddle(
			"fretwork.eb.lv",
			pageW / 2,
			pageH - Fretboard.PAGE_BOTTOM,
			undefined,
			undefined,
			"https://fretwork.eb.lv"
		);

		for (let x = 0; x < param.frets + 1; ++x)
		{
			painter.line(
				Fretboard.LEFT + fretSpacing * x,
				Fretboard.STRING_TOP,
				Fretboard.LEFT + fretSpacing * x,
				Fretboard.STRING_TOP + (instrument.strings - 1) * Fretboard.STRING_SPACING,
				x == 0 ? "#555555" : "#CCCCCC",
				x == 0 ? 1.5 : 1,
				x == 0 ? "square" : "round"
			);
		}

		if (param.capo)
		{
			painter.textMiddle(
				`Capo ${Utils.toRoman(param.capo)}`,
				Fretboard.LEFT,
				Fretboard.STRING_TOP - 5,
				tinycolor("#ee8866").darken(12).toHexString()
			);
		}

		for (let y = 0; y < instrument.strings; ++y)
		{
			painter.line(
				Fretboard.LEFT,
				Fretboard.STRING_TOP + y * Fretboard.STRING_SPACING,
				pageW - Fretboard.RIGHT,
				Fretboard.STRING_TOP + y * Fretboard.STRING_SPACING,
				"#333333",
				0.2
			);
		}

		if (instrument.dots)
		{
			const dots = instrument.dots.slice(param.capo);

			for (let x = 0; x < Math.min(dots.length, param.frets); ++x)
			{
				for (let i = 0; i < dots[x]; ++i)
				{
					painter.circle(
						Fretboard.STRING_SPACING / 6,
						Fretboard.LEFT + (x + 1) * fretSpacing - fretSpacing / 2,
						Fretboard.STRING_TOP + instrument.strings * Fretboard.STRING_SPACING + i
						* (Fretboard.STRING_SPACING / 3 + 0.5),
						"grey"
					);
				}
			}
		}

		this.pitchMatrix = Array(instrument.strings).fill(0).map(_ => Array(param.frets + 1).fill(0));

		for (let y = instrument.strings - 1; y > -1; --y)
		{
			for (let x = 0; x < param.frets + 1; ++x)
			{
				const pitch = tuning.pitches[instrument.strings - y - 1] + param.capo + x;
				const noteIndex = Utils.uMod(pitch, notes.length);

				if (degrees.includes(noteIndex) || degreesAdd?.includes(noteIndex))
				{
					this.pitchMatrix[y][x] = 1;

					const colorIndex = Math.floor((12 + pitch - degrees[0]) / notes.length) + 1;

					let circleFillColor = tinycolor(Fretboard.COLORS[colorIndex]);
					const circleColor = circleFillColor.clone().darken(12);

					const shadow = this.highlights.length && this.getHighlight([x, y]) == -1;

					if (noteIndex == degrees[0] || shadow)
					{
						circleFillColor = tinycolor("white");
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
						circleFillColor.toHexString(),
						circleColor.toHexString(),
						0.5,
						shadow ? (noteIndex == degrees[0]) ? [2, 0.5] : [1.1, 0.4] : undefined,
						[x, y]
					);

					painter.textMiddle(
						notes[noteIndex],
						cx,
						Fretboard.STRING_TOP + y * Fretboard.STRING_SPACING,
						shadow ? tinycolor.mix("#333333", "white", 40).toHexString() : undefined,
						this.dom.intervals.checked ? 2.4 : 2.6
					);
				}
			}
		}
	}

	highlights: [number, number][] = [];
	pitchMatrix: number[][] = [[]];

	clearHighlights(): void
	{
		this.highlights = [];
	}

	getHighlight(highlight: [number, number]): number
	{
		for (let i = 0; i < this.highlights.length; ++i)
		{
			if (this.highlights[i][0] == highlight[0] && this.highlights[i][1] == highlight[1])
			{
				return i;
			}
		}

		return -1;
	}

	setHighlight(highlight: [number, number]): void
	{
		const ix = this.getHighlight(highlight);

		if (ix > -1)
		{
			this.highlights.splice(ix, 1);
		}
		else
		{
			this.highlights.push(highlight);
		}
	}

	private static equal(a: readonly (readonly number[])[], b: readonly (readonly number[])[]): boolean
	{
		if (a.length != b.length)
		{
			return false;
		}

		for (let i = 0; i < a.length; ++i)
		{
			if (a[i].length != b[i].length)
			{
				return false;
			}

			for (let j = 0; j < a[i].length; ++j)
			{
				if (Math.abs(a[i][j]) != b[i][j])
				{
					return false;
				}
			}
		}

		return true;
	}

	setPosition(name: string): void
	{
		this.clearHighlights();

		const param = this.getUiParams();
		const instrument = INSTRUMENTS[param.instrument[0]];
		const scale = SCALES[param.scale[0]].scales[param.scale[1]];

		for (const pattern of PATTERNS)
		{
			if (pattern.scales.includes(scale.scaleId) &&
				pattern.tunings.includes(instrument.tuning[param.instrument[1]].tuningId))
			{
				const ptrn = pattern.pattern.find(po => po.name == name);

				if (ptrn)
				{
					for (let s = 0; s < this.pitchMatrix[0].length + 1 - ptrn.pattern[0].length; ++s)
					{
						const fragment = this.pitchMatrix.map(x => x.slice(s, s + ptrn.pattern[0].length));

						if (Fretboard.equal(ptrn.pattern, fragment))
						{
							for (let y = 0; y < ptrn.pattern.length; ++y)
							{
								for (let x = 0; x < ptrn.pattern[y].length; ++x)
								{
									if (ptrn.pattern[y][x] == 1)
									{
										this.setHighlight([x + s, y]);
									}
								}
							}
						}
					}
				}

				break;
			}
		}

		this.darwFretboardSvg();
	}

	darwFretboardSvg(): void
	{
		while (this.freatboard.firstChild)
		{
			this.freatboard.firstChild.remove();
		}

		const painter = new PainterSvg();

		this.darwFretboard(painter);

		this.freatboard.appendChild(painter.getSvg());
	}

	resizeFretboard(event: Event): void
	{
		const svg = this.freatboard.firstChild as SVGSVGElement;

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

				switch (this.dom.page.value)
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

	uiUpdate(event: Event): void
	{
		const param = this.getUiParams();

		const instrument = INSTRUMENTS[param.instrument[0]];

		this.dom.instrumentName.innerText = instrument.name;

		if (instrument.frets && event.target == this.dom.instrument)
		{
			this.dom.frets.value = instrument.frets.toString();
			this.dom.capo.value = "0";
		}

		const scale = SCALES[param.scale[0]].scales[param.scale[1]];

		if (scale.degrees.length == 7)
		{
			let bn = Fretboard.getBaseNotes(param.key, -1, scale);

			if (bn[0] && this.dom.flat.selected)
			{
				this.dom.accidental.value = "0";
			}

			this.dom.flat.disabled = bn[0];

			bn = Fretboard.getBaseNotes(param.key, 1, scale);

			if (bn[0] && this.dom.sharp.selected)
			{
				this.dom.accidental.value = "0";
			}

			this.dom.sharp.disabled = bn[0];
		}
		else
		{
			this.dom.flat.disabled = false;
			this.dom.sharp.disabled = false;
		}

		let showPattern = false;

		for (const pattern of PATTERNS)
		{
			showPattern = pattern.scales.includes(scale.scaleId) &&
				pattern.tunings.includes(instrument.tuning[param.instrument[1]].tuningId);

			if (showPattern)
			{
				const poSel = $("positions") as HTMLSelectElement;

				while (poSel.firstChild)
				{
					poSel.firstChild.remove();
				}

				const op = document.createElement("option");
				op.value = "-";
				op.text = "-";
				poSel.appendChild(op);

				pattern.pattern.forEach((p) =>
				{
					if (p.scales)
					{
						if (!p.scales.includes(scale.scaleId))
						{
							return;
						}
					}

					const op = document.createElement("option");
					op.value = p.name;
					op.text = p.name;
					poSel.appendChild(op);
				});

				break;
			}
		}

		$("lb_positions").style.visibility = showPattern ? "visible" : "collapse";
	}

	private static getBaseNotes(
		paramKey: number,
		paramAccidental: number,
		scale: Scale
	): [boolean, string[], number, number]
	{
		const degrees = scale.degrees.map(x => (x < 0 ? -1 : Utils.uMod(x + paramKey + paramAccidental, 12)));
		const baseIndex = Fretboard.BASE_NOTES.findIndex(x => x[1] == paramKey);

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

		const retval: string[] = [];
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

	window.addEventListener("load", (event) =>
	{
		const freatboard: SVGGElement = $("fretboard");

		if (freatboard.parentElement)
		{
			if (freatboard.parentElement.clientWidth < freatboard.parentElement.clientHeight)
			{
				$<HTMLInputElement>("page").value = "1";
			}
		}

		fb.uiUpdate(event);
		fb.darwFretboardSvg();
		fb.resizeFretboard(event);
	});

	window.addEventListener("resize", fb.resizeFretboard.bind(fb));
	window.addEventListener("beforeprint", fb.resizeFretboard.bind(fb));
	window.addEventListener("afterprint", fb.resizeFretboard.bind(fb));

	const domInstrument: HTMLSelectElement = $("instrument");

	for (let i = 0; i < INSTRUMENTS.length; ++i)
	{
		const opG = document.createElement("optgroup");

		opG.label = INSTRUMENTS[i].name;

		for (let j = 0; j < INSTRUMENTS[i].tuning.length; ++j)
		{
			const op = document.createElement("option");

			op.value = `[${i}, ${j}]`;
			op.text = `${INSTRUMENTS[i].tuning[j].name} (`;

			INSTRUMENTS[i].tuning[j].pitches.forEach((x: number) =>
			{
				op.text += `${Fretboard.CHROMATIC_NOTES[0][Utils.uMod(x, 12)]}\uFE0E${String.fromCharCode(
					0x2080 + Math.floor(2 + (x - 3) / 12)
				)}`;
			});

			op.text += ")";

			opG.appendChild(op);
		}

		domInstrument.appendChild(opG);
	}

	const domScale: HTMLSelectElement = $("scale");

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

	const toUpdate = ["instrument", "frets", "capo", "key", "accidental", "scale"];

	toUpdate.forEach((element) =>
	{
		$(element).addEventListener("change", (event) =>
		{
			fb.uiUpdate(event);
			fb.clearHighlights();
			fb.darwFretboardSvg();
		});
	});

	$("intervals").addEventListener("change", (_event) =>
	{
		fb.darwFretboardSvg();
	});

	$("page").addEventListener("change", (event) =>
	{
		fb.darwFretboardSvg();
		fb.resizeFretboard(event);
	});

	$("save_svg").addEventListener("click", () =>
	{
		Utils.saveAs(
			`data:image/svg+xml,${encodeURIComponent(
				`<?xml version="1.0" encoding="UTF-8"?>${$("fretboard").innerHTML}`
			)}`,
			fb.fileTitle
		);
	});

	$("save_pdf").addEventListener("click", () =>
	{
		const pdf = new PainterPdf();

		pdf.loadFonts().then(() =>
		{
			fb.darwFretboard(pdf);
			pdf.savePdf(fb.fileTitle);
		});
	});

	$("fretboard").addEventListener("click", (event: MouseEvent) =>
	{
		let target = event.target as SVGElement;

		if (target.tagName == "text")
		{
			target = target.previousElementSibling as SVGElement;
		}

		if (target && target.tagName == "circle")
		{
			const data = target.getAttribute("data");
			if (data)
			{
				fb.setHighlight(JSON.parse(data));
				fb.darwFretboardSvg();
			}
		}
	});

	$("positions").addEventListener("change", (_event) =>
	{
		fb.setPosition(($("positions") as HTMLSelectElement).value);
	});
});

//----------------------------------------------------------------------------------------------------------------------
// EOF
//----------------------------------------------------------------------------------------------------------------------
