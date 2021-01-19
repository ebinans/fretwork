//----------------------------------------------------------------------------------------------------------------------
// MIT License
//
// Copyright (c) 2021 Edgars Bināns
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//----------------------------------------------------------------------------------------------------------------------

import PDFDocument = require('pdfkit');
import blobStream = require('blob-stream');

// //----------------------------------------------------------------------------------------------------------------------

// //0    1     2    3    4     5    6     7    8    9     10   11
// ["A", "A♯", "B", "C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯"];

const INSTRUMENTS: {
  name: string;
  strings: number;
  dots: number[];
  frets: number;
  tuning: {
    name: string;
    tuning: number[];
  }[];
}[] =
  [
    {
      name: "Guitar",
      strings: 6,
      dots: [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2],
      frets: 22,
      tuning:
        [
          {
            name: "Standard",
            tuning: [7, 12, 17, 22, 26, 31],
          },
          {
            name: "Drop A",
            tuning: [0, 7, 12, 17, 21, 26],
          },
          {
            name: "Drop B",
            tuning: [2, 9, 14, 19, 23, 28],
          },
          {
            name: "Drop C",
            tuning: [3, 10, 15, 20, 24, 29],
          },
          {
            name: "Drop D",
            tuning: [5, 12, 17, 22, 26, 31],
          },
          {
            name: "Open C",
            tuning: [3, 10, 15, 22, 27, 31],
          },
          {
            name: "Open D",
            tuning: [5, 12, 17, 21, 24, 29],
          },
          {
            name: "Open E",
            tuning: [7, 14, 19, 23, 26, 31],
          },
          {
            name: "Open G",
            tuning: [5, 10, 17, 22, 26, 29],
          },
          {
            name: "New Standard", // Hello Robert!
            tuning: [3, 10, 17, 24, 31, 34],
          },
        ]
    },
    {
      name: "Bass guitar",
      strings: 4,
      dots: [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2],
      frets: 20,
      tuning:
        [
          {
            name: "Standard",
            tuning: [-5, 0, 5, 10],
          },
        ]
    },
    {
      name: "Ukulele",
      strings: 4,
      dots: [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 2, 0, 0, 1],
      frets: 16,
      tuning:
        [
          {
            name: "Soprano in C",
            tuning: [10, 3, 7, 12].map((x) => x + 24),
          },
        ]
    }
  ]

//----------------------------------------------------------------------------------------------------------------------

type Scale = {
  name: string;
  degrees: number[];
  add?: number[];
  selected?: boolean;
}

const SCALES: {
  label: string;
  scales: Scale[];
}[] =
  [
    {
      label: "Chromatic",
      scales:
        [
          {
            name: "Chromatic",
            degrees: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          },
        ]
    },
    {
      label: "Diatonic",
      scales:
        [
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
        ]
    },
    {
      label: "Heptatonic",
      scales:
        [
          {
            name: "Harmonic minor",
            degrees: [0, 2, 3, 5, 7, 8, 11],
          },
          {
            name: "Melodic minor",
            degrees: [0, 2, 3, 5, 7, 9, 11],
          },
        ]
    },
    {
      label: "Pentatonic",
      scales:
        [
          {
            name: "Major pentatonic",
            degrees: [0, 2, 4, -1, 7, 9, -1],
          },
          {
            name: "Minor pentatonic",
            degrees: [0, -1, 3, 5, 7, -1, 10],
          },
        ]
    },
    {
      label: "Hexatonic",
      scales:
        [
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
        ]
    }
  ]

//----------------------------------------------------------------------------------------------------------------------

const CHROMATIC_NOTES = [
  //0    1     2    3    4     5    6     7    8    9     10   11
  ["A", "A♯", "B", "C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯"],
  ["A", "B♭", "B", "C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭"],
];

//----------------------------------------------------------------------------------------------------------------------

function uMod(num: number, div: number): number
{
  return ((num % div) + div) % div;
}

function mmToPtInt(mm: number): number
{
  return Math.round(mm * 2.8346456692913);
}

function mmToPt(mm: number): number
{
  return mm * 2.8346456692913;
}

//----------------------------------------------------------------------------------------------------------------------

function getBaseNotes(
  baseNotes: [string, number][],
  paramKey: number,
  paramAccidental: number,
  scale: Scale
): [boolean, number, number, string[]]
{
  const degrees = scale.degrees.map((x) => (x < 0 ? -1 : uMod(x + paramKey + paramAccidental, 12)));
  const baseIndex = baseNotes.findIndex((x) => x[1] == paramKey);

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

  for (let i = baseIndex; i < baseNotes.length + baseIndex; ++i)
  {
    if (degrees[i - baseIndex] < 0)
    {
      continue;
    }

    const ix = uMod(i, baseNotes.length);
    const acc = distance(baseNotes[ix][1], degrees[i - baseIndex], 12);

    let note = baseNotes[ix][0];

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

  retval.length += 12 - retval.length;

  return [hasDouble, flats, sharps, retval];
}

//----------------------------------------------------------------------------------------------------------------------

function adjustBrightness(color: string, scale: number): string
{
  let rgb = parseInt(color.substr(1), 16);

  const r = Math.min(Math.round(((rgb >> 16) & 0xff) * scale), 255);
  const g = Math.min(Math.round(((rgb >> 8) & 0xff) * scale), 255);
  const b = Math.min(Math.round(((rgb >> 0) & 0xff) * scale), 255);

  rgb = (r << 16) | (g << 8) | b;

  return "#" + rgb.toString(16).padStart(6, "0");
}

//----------------------------------------------------------------------------------------------------------------------

interface Painter
{
  page(pageW: number, pageH: number): void;
  textMiddle(text: string, x: number, y: number, size?: number): void;
  line(x1: number, y1: number, x2: number, y2: number, stroke: string, width: number, linecap?: string): void;
  circle(radius: number, cx: number, cy: number, fill: string, stroke?: string, width?: number): void;
}

class PainterSvg implements Painter
{
  private svg: SVGSVGElement;

  getSvg(): SVGSVGElement
  {
    return this.svg;
  }

  constructor()
  {
    const NS = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(NS, "svg");
  }

  page(pageW: number, pageH: number)
  {
    this.svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    this.svg.setAttribute("width", pageW + "mm");
    this.svg.setAttribute("height", pageH + "mm");
    this.svg.setAttribute("font-family", "'DejaVu Sans', Verdana, Geneva, Tahoma, sans-serif");
    this.svg.setAttribute("font-size", "2.6mm");
    this.svg.setAttribute("font-weight", "bold");
    this.svg.setAttribute("fill", "#333333");

    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    background.setAttribute("width", "100%");
    background.setAttribute("height", "100%");
    background.setAttribute("fill", "white");

    this.svg.appendChild(background);
  }

  textMiddle(text: string, x: number, y: number, size?: number): void
  {
    const textNode = document.createElementNS("http://www.w3.org/2000/svg", "text");

    textNode.textContent = text;

    textNode.setAttribute("x", x + "mm");
    textNode.setAttribute("y", y + "mm");

    textNode.setAttribute("text-anchor", "middle");
    textNode.setAttribute("dominant-baseline", "middle");

    if (size)
    {
      textNode.setAttribute("font-size", size + "mm");
    }

    this.svg.appendChild(textNode);
  }

  line(x1: number, y1: number, x2: number, y2: number, stroke: string, width: number, linecap?: string): void
  {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute("x1", x1 + "mm");
    line.setAttribute("y1", y1 + "mm");
    line.setAttribute("x2", x2 + "mm");
    line.setAttribute("y2", y2 + "mm");
    line.setAttribute("stroke", stroke);
    line.setAttribute("stroke-width", width + "mm");

    if (linecap)
    {
      line.setAttribute("stroke-linecap", linecap);
    }

    this.svg.appendChild(line);
  }

  circle(radius: number, cx: number, cy: number, fill: string, stroke?: string, width?: number): void
  {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    circle.setAttribute("r", radius + "mm");
    circle.setAttribute("cx", cx + "mm");
    circle.setAttribute("cy", cy + "mm");
    circle.setAttribute("fill", fill);

    if (stroke)
    {
      circle.setAttribute("stroke", stroke);
    }

    if (width)
    {
      circle.setAttribute("stroke-width", width + "mm");
    }

    this.svg.appendChild(circle);
  }
}

class PainterPdf implements Painter
{
  private pdf: PDFKit.PDFDocument;
  private stream: blobStream.IBlobStream;

  savePdf(filename: string)
  {
    this.stream.on('finish', () =>
    {
      const link = document.createElement("a");

      link.href = this.stream.toBlobURL('application/pdf');;
      link.download = filename;
      link.click();
    });

    this.pdf.end();
  }

  constructor()
  {
    this.pdf = new PDFDocument({ autoFirstPage: false });
    this.stream = this.pdf.pipe(blobStream());
  }

  async loadFonts()
  {
    await fetch("font/DejaVuSans-Bold.ttf")
      .then(response => response.arrayBuffer())
      .then(font => this.pdf.registerFont("DejaVu Sans Bold", font));
  }

  page(pageW: number, pageH: number)
  {
    this.pdf.addPage({ size: [mmToPtInt(pageW), mmToPtInt(pageH)], margin: 0 });
    this.pdf.font("DejaVu Sans Bold");
  }

  textMiddle(text: string, x: number, y: number, size?: number): void
  {
    this.pdf.fillColor("#333333").fontSize(mmToPt(size ? size : 2.6));
    const textWidth = this.pdf.widthOfString(text);
    const textHeight = this.pdf.heightOfString(text);

    this.pdf.text(text, mmToPt(x) - textWidth / 2, mmToPt(y) - textHeight / 2);
  }

  line(x1: number, y1: number, x2: number, y2: number, stroke: string, width: number, linecap?: string): void
  {
    if (linecap)
    {
      this.pdf
        .lineCap(linecap)
        .moveTo(mmToPt(x1), mmToPt(y1))
        .lineTo(mmToPt(x2), mmToPt(y2))
        .lineWidth(mmToPt(width))
        .stroke(stroke);
    }
    else
    {
      this.pdf
        .moveTo(mmToPt(x1), mmToPt(y1))
        .lineTo(mmToPt(x2), mmToPt(y2))
        .lineWidth(mmToPt(width))
        .stroke(stroke);
    }
  }

  circle(radius: number, cx: number, cy: number, fill: string, stroke?: string, width?: number): void
  {
    if (stroke && width)
    {
      this.pdf
        .circle(mmToPt(cx), mmToPt(cy), mmToPt(radius))
        .lineWidth(mmToPt(width))
        .fillAndStroke(fill, stroke);
    }
    else
    {
      this.pdf
        .circle(mmToPt(cx), mmToPt(cy), mmToPt(radius))
        .fill(fill);
    }
  }
}

//----------------------------------------------------------------------------------------------------------------------

function darwFretboard(painter: Painter)
{
  const domPage = document.getElementById("page") as HTMLInputElement;
  const domFrets = document.getElementById("frets") as HTMLInputElement;
  const domInstrument = document.getElementById("instrument") as HTMLInputElement;
  const domKey = document.getElementById("key") as HTMLInputElement;
  const domScale = document.getElementById("scale") as HTMLInputElement;
  const domAccidental = document.getElementById("accidental") as HTMLInputElement;
  const domInstrumentName = document.getElementById("name") as HTMLSpanElement;
  const domFlat = document.getElementById("flat") as HTMLOptionElement;
  const domSharp = document.getElementById("sharp") as HTMLOptionElement;

  const paramInstrument = JSON.parse(domInstrument.value) as [number, number];
  const instrument = INSTRUMENTS[paramInstrument[0]];
  const tuning = INSTRUMENTS[paramInstrument[0]].tuning[paramInstrument[1]];

  domInstrumentName.innerText = instrument.name;

  const BASE_NOTES: [string, number][] = [
    ["A", 0],
    ["B", 2],
    ["C", 3],
    ["D", 5],
    ["E", 7],
    ["F", 8],
    ["G", 10],
  ];

  const paramKey = parseInt(domKey.value);
  const paramScale = JSON.parse(domScale.value) as [number, number];

  const scale = SCALES[paramScale[0]].scales[paramScale[1]];

  if (scale.degrees.length == 7)
  {
    let bn = getBaseNotes(BASE_NOTES, paramKey, -1, scale);

    if (bn[0] && domFlat.selected)
    {
      domAccidental.value = "0";
    }

    domFlat.disabled = bn[0];

    bn = getBaseNotes(BASE_NOTES, paramKey, 1, scale);

    if (bn[0] && domSharp.selected)
    {
      domAccidental.value = "0";
    }

    domSharp.disabled = bn[0];
  }
  else
  {
    domFlat.disabled = false;
    domSharp.disabled = false;
  }

  const paramPageIndex = parseInt(domPage.value);
  const paramFrets = parseInt(domFrets.value);
  const paramAccidental = parseInt(domAccidental.value);

  const PAGE_SIZES = [
    [297, 210],
    [210, 297],
    [279.4, 215.9],
    [215.9, 279.4],
  ];

  const pageW = PAGE_SIZES[paramPageIndex][0];
  const pageH = PAGE_SIZES[paramPageIndex][1];

  const degrees = scale.degrees.map((x) => (x < 0 ? -1 : uMod(x + paramKey + paramAccidental, 12)));
  let degreesAdd = scale.add;

  if (degreesAdd)
  {
    degreesAdd = degreesAdd.map((x) => (x < 0 ? -1 : uMod(x + paramKey + paramAccidental, 12)));
  }

  //---

  const PAGE_TOP = 15;
  const PAGE_BOTTOM = 15;

  const LEFT = 20;
  const RIGHT = 20;

  const STRING_TOP = 25;
  const STRING_SPACING = 6;
  const fretSpacing = (pageW - LEFT - RIGHT) / paramFrets;

  //---

  painter.page(pageW, pageH);

  let notes: string[];
  let hasDouble = false;

  if (scale.degrees.length == 7)
  {
    let flats = 0;

    [hasDouble, flats, , notes] = getBaseNotes(BASE_NOTES, paramKey, paramAccidental, scale);

    for (let i = 0; i < CHROMATIC_NOTES[flats ? 1 : 0].length; ++i)
    {
      if (notes[i] == undefined)
      {
        notes[i] = CHROMATIC_NOTES[flats ? 1 : 0][i];
      }
    }
  }
  else
  {
    notes = CHROMATIC_NOTES[paramAccidental >= 0 ? 0 : 1];
  }

  const acc = paramAccidental == -1 ? "♭ " : paramAccidental == 1 ? "♯ " : " ";

  painter.textMiddle(
    `${instrument.name}: ${tuning.name} tuning, ${CHROMATIC_NOTES[0][paramKey]}${acc}${scale.name} scale`,
    pageW / 2,
    PAGE_TOP,
    4);

  painter.textMiddle("fretwork.eb.lv", pageW / 2, pageH - PAGE_BOTTOM, 2.6);

  for (let x = 0; x < paramFrets + 1; ++x)
  {
    painter.line(
      LEFT + fretSpacing * x,
      STRING_TOP,
      LEFT + fretSpacing * x,
      STRING_TOP + (instrument.strings - 1) * STRING_SPACING,
      x == 0 ? "#333333" : "#CCCCCC",
      1,
      "round");
  }

  for (let y = 0; y < instrument.strings; ++y)
  {
    painter.line(
      LEFT,
      STRING_TOP + y * STRING_SPACING,
      pageW - RIGHT,
      STRING_TOP + y * STRING_SPACING,
      "black",
      0.2);
  }

  if (instrument.dots)
  {
    for (let x = 0; x < Math.min(instrument.dots.length, paramFrets + 1); ++x)
    {
      for (let i = 0; i < instrument.dots[x]; ++i)
      {
        painter.circle(
          STRING_SPACING / 6,
          LEFT + x * fretSpacing - fretSpacing / 2,
          STRING_TOP + instrument.strings * STRING_SPACING + i * (STRING_SPACING / 3 + 0.5),
          "grey");
      }
    }
  }

  // https://personal.sron.nl/~pault/#fig:scheme_light
  const COLORS = ["#eedd88", "#ee8866", "#99ddff", "#bbcc33", "#ffaabb", "#44bb99", "#dddddd"];

  for (let y = instrument.strings - 1; y > -1; --y)
  {
    for (let x = 0; x < paramFrets + 1; ++x)
    {
      const noteIndex = uMod((tuning.tuning[instrument.strings - y - 1] + x), notes.length);

      const colorIndex =
        Math.trunc((12 + tuning.tuning[instrument.strings - y - 1] + x - degrees[0]) / notes.length);

      if (degrees.includes(noteIndex) || degreesAdd?.includes(noteIndex))
      {
        const circleColor = adjustBrightness(COLORS[colorIndex], 0.8);
        let circleFillColor = COLORS[colorIndex];

        if (noteIndex == degrees[0])
        {
          circleFillColor = "white";
        }

        let cx = LEFT + x * fretSpacing - fretSpacing / 2;

        if (x == 0)
        {
          cx = LEFT - (STRING_SPACING * 2) / 2.5;
        }

        painter.circle(
          STRING_SPACING / 2.5,
          cx,
          STRING_TOP + y * STRING_SPACING,
          circleFillColor,
          circleColor,
          0.5);

        painter.textMiddle(
          notes[noteIndex],
          cx,
          STRING_TOP + y * STRING_SPACING);
      }
    }
  }
}

//----------------------------------------------------------------------------------------------------------------------

function darwFretboardPdf(event: Event)
{
  const pdf = new PainterPdf();

  pdf.loadFonts().then(() =>
  {
    darwFretboard(pdf);
    pdf.savePdf("scale.pdf");
  });
}

//----------------------------------------------------------------------------------------------------------------------

function darwFretboardSvg(event: Event)
{
  const fb = document.getElementById("fretboard") as unknown as SVGGElement;

  if (fb)
  {
    while (fb.firstChild)
    {
      fb.firstChild.remove();
    }

    const domFrets = document.getElementById("frets") as HTMLInputElement;
    const domInstrument = document.getElementById("instrument") as HTMLInputElement;
    const domInstrumentName = document.getElementById("name") as HTMLSpanElement;

    const paramInstrument = JSON.parse(domInstrument.value) as [number, number];
    const instrument = INSTRUMENTS[paramInstrument[0]];

    domInstrumentName.innerText = instrument.name;

    if (instrument.frets && event.target == domInstrument)
    {
      domFrets.value = instrument.frets.toString();
    }

    const painter = new PainterSvg();

    darwFretboard(painter);

    fb.appendChild(painter.getSvg());

    resizeFretboard(event);
  }
}

//----------------------------------------------------------------------------------------------------------------------

let printStarted = false;

function resizeFretboard(event: Event)
{
  const fb = document.getElementById("fretboard") as unknown as SVGGElement;
  const svg = fb.firstChild as SVGSVGElement;

  if (fb && svg)
  {
    if (event.type == "beforeprint")
    {
      printStarted = true;
    }
    else if (event.type == "afterprint")
    {
      printStarted = false;
    }

    let scale = 1;

    if (fb.parentElement && !printStarted)
    {
      const scaleW = fb.parentElement.clientWidth / svg.width.baseVal.value;
      const scaleH = fb.parentElement.clientHeight / svg.height.baseVal.value;
      scale = Math.min(scaleW, scaleH);
    }
    else
    {
      const style = document.querySelector("style");
      if (style)
      {
        style.textContent += "@media print { @page { size: ";

        const domPage = document.getElementById("page") as HTMLInputElement;

        switch (domPage.value)
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
    fb.transform.baseVal.clear();
    fb.transform.baseVal.appendItem(trans);
  }
}

//----------------------------------------------------------------------------------------------------------------------

function saveAs(uri: string, filename: string)
{
  const link = document.createElement("a");

  link.href = uri;
  link.download = filename;
  link.click();
}

//----------------------------------------------------------------------------------------------------------------------

window.addEventListener("DOMContentLoaded", () =>
{
  window.addEventListener("load", darwFretboardSvg);

  window.addEventListener("resize", resizeFretboard);
  window.addEventListener("beforeprint", resizeFretboard);
  window.addEventListener("afterprint", resizeFretboard);

  const domInstrument = document.getElementById("instrument") as HTMLSelectElement;

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

        INSTRUMENTS[i].tuning[j].tuning.forEach((x: number) =>
        {
          op.text += CHROMATIC_NOTES[0][uMod(x, 12)] + "\uFE0E" +
            String.fromCharCode(0x2080 + Math.floor(2 + (x - 3) / 12));
        });

        op.text += ")";

        opG.appendChild(op);
      }

      domInstrument.appendChild(opG);
    }
  }

  const domScale = document.getElementById("scale") as HTMLSelectElement;

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

  const toUpdate = ["page", "frets", "instrument", "key", "scale", "accidental"];

  toUpdate.forEach((element) =>
  {
    document.getElementById(element)?.addEventListener("change", darwFretboardSvg);
  });

  const domSaveSvg = document.getElementById("save_svg");
  domSaveSvg?.addEventListener("click", () =>
  {
    const svg = document.getElementById("fretboard") as unknown as SVGGElement;

    if (svg)
    {
      const fileContent =
        'data:image/svg+xml,' + encodeURIComponent('<?xml version="1.0" encoding="UTF-8"?>' + svg.innerHTML);

      saveAs(fileContent, "scale.svg");
    }
  });

  const domSavePdf = document.getElementById("save_pdf");
  domSavePdf?.addEventListener("click", darwFretboardPdf);
});

//----------------------------------------------------------------------------------------------------------------------
// EOF
//----------------------------------------------------------------------------------------------------------------------
