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
            name: "Standard (E₂A₂D₃G₃B₃E₄)",
            tuning: [0, 5, 10, 15, 19, 24].map((x) => x + 7),
          },
          {
            name: "Drop A (A₁E₂A₂D₃F#₃B₃)",
            tuning: [0, 7, 12, 17, 21, 26],
          },
          {
            name: "Drop B (B₁F♯₂B₂E₃G♯₃C♯₄)",
            tuning: [2, 9, 14, 19, 23, 28],
          },
          {
            name: "Drop C (C₂G₂C₃F₃A₃D₄)",
            tuning: [-2, 5, 10, 15, 19, 24].map((x) => x + 5),
          },
          {
            name: "Drop D (D₂A₂D₃G₃B₃E₄)",
            tuning: [-2, 5, 10, 15, 19, 24].map((x) => x + 7),
          },
          {
            name: "Open C (C₂G₂C₃G₃C₄E₄)",
            tuning: [0, 7, 12, 19, 24, 28].map((x) => x + 3),
          },
          {
            name: "Open D (D₂A₂D₃F♯₃A₃D₄)",
            tuning: [0, 7, 12, 16, 19, 24].map((x) => x + 5),
          },
          {
            name: "Open E (E₂B₂E₃G#₃B₃E₄)",
            tuning: [0, 7, 12, 16, 19, 24].map((x) => x + 7),
          },
          {
            name: "Open G (D₂G₂D₃G₃B₃D₄)",
            tuning: [-2, 3, 10, 15, 19, 22].map((x) => x + 7),
          },
          {
            name: "New Standard (C₂G₂D₃A₃E₄G₄)",
            tuning: [0, 7, 14, 21, 28, 31].map((x) => x + 3),
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
            name: "Standard (E₁A₁D₂G₂)",
            tuning: [0, 5, 10, 15].map((x) => x + 7),
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
            name: "Soprano in C (G₄C₄E₄A₄)",
            tuning: [0, -7, -3, 2].map((x) => x + 10),
          },
        ]
    }
  ]

//----------------------------------------------------------------------------------------------------------------------

class Scale
{
  name: string = "";
  degrees: number[] = [];
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

interface SVGElement
{
  attr(qualifiedName: string, value: string): SVGElement;
}

SVGElement.prototype.attr = function (qualifiedName: string, value: string): SVGElement
{
  this.setAttribute(qualifiedName, value);
  return this;
};

function roundTwo(num: number): number
{
  return Math.round(num * 100) / 100;
}

//----------------------------------------------------------------------------------------------------------------------

function getBaseNotes(
  baseNotes: [string, number][],
  paramKey: number,
  paramAccidental: number,
  scale: Scale
): [boolean, number, number, string[]]
{
  const degrees = scale.degrees.map((x) => (x < 0 ? -1 : (12 + x + paramKey + paramAccidental) % 12));
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

    const ix = i % baseNotes.length;
    const acc = distance(baseNotes[ix][1], degrees[i - baseIndex], 12);

    let note = baseNotes[ix][0];

    switch (acc)
    {
      case 1:
        note += "♯";
        ++sharps;
        break;
      case 2:
        note += "♯♯";
        hasDouble = true;
        sharps += 2;
        break;
      case -1:
        note += "♭";
        ++flats;
        break;
      case -2:
        note += "♭♭";
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

function darwFretboard(event: Event)
{
  const fb = document.getElementById("fretboard") as unknown as SVGGElement;

  if (fb)
  {
    while (fb.firstChild)
    {
      fb.firstChild.remove();
    }

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

    if (instrument.frets && event.target == domInstrument)
    {
      domFrets.value = instrument.frets.toString();
    }

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

    const degrees = scale.degrees.map((x) => (x < 0 ? -1 : (12 + x + paramKey + paramAccidental) % 12));
    let degreesAdd = scale.add;

    if (degreesAdd)
    {
      degreesAdd = degreesAdd.map((x) => (x < 0 ? -1 : (12 + x + paramKey + paramAccidental) % 12));
    }

    //---

    const PAGE_TOP = 15;

    const LEFT = 20;
    const RIGHT = 20;

    const STRING_TOP = 25;
    const STRING_SPACING = 6;
    const fretSpacing = (pageW - LEFT - RIGHT) / paramFrets;

    const CHROMATIC_NOTES = [
      //0    1     2    3    4     5    6     7    8    9     10   11
      ["A", "A♯", "B", "C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯"],
      ["A", "B♭", "B", "C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭"],
    ];

    //---

    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");

    svg.attr("xmlns", NS)
      .attr("width", pageW + "mm")
      .attr("height", pageH + "mm")
      .attr("font-family", "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif")
      .attr("font-size", "2.6mm")
      .attr("font-weight", "bold")
      .attr("fill", "#333333");

    const background = document.createElementNS(NS, "rect");

    background.attr("width", "100%").attr("height", "100%").attr("fill", "white");

    svg.appendChild(background);

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
      notes = CHROMATIC_NOTES[0];
    }

    const title = document.createElementNS(NS, "text");

    const acc = paramAccidental == -1 ? "♭ " : paramAccidental == 1 ? "♯ " : " ";
    title.textContent = `${instrument.name}, ${tuning.name}, ${CHROMATIC_NOTES[0][paramKey]}${acc}${scale.name}`;

    title
      .attr("x", pageW / 2 + "mm")
      .attr("y", PAGE_TOP + "mm")
      .attr("text-anchor", "middle")
      .attr("font-size", "4mm");

    svg.appendChild(title);

    for (let x = 0; x < paramFrets + 1; ++x)
    {
      const line = document.createElementNS(NS, "line");

      line.attr("x1", roundTwo(LEFT + fretSpacing * x) + "mm")
        .attr("y1", roundTwo(STRING_TOP) + "mm")
        .attr("x2", roundTwo(LEFT + fretSpacing * x) + "mm")
        .attr("y2", roundTwo(STRING_TOP + (instrument.strings - 1) * STRING_SPACING) + "mm")
        .attr("stroke", x == 0 ? "#333333" : "#CCCCCC")
        .attr("stroke-width", "1mm")
        .attr("stroke-linecap", "round");

      svg.appendChild(line);
    }

    for (let y = 0; y < instrument.strings; ++y)
    {
      const line = document.createElementNS(NS, "line");

      line.attr("x1", roundTwo(LEFT) + "mm")
        .attr("y1", roundTwo(STRING_TOP + y * STRING_SPACING) + "mm")
        .attr("x2", roundTwo(pageW - RIGHT) + "mm")
        .attr("y2", roundTwo(STRING_TOP + y * STRING_SPACING) + "mm")
        .attr("stroke", "black")
        .attr("stroke-width", "0.2mm");

      svg.appendChild(line);
    }

    if (instrument.dots)
    {
      for (let x = 0; x < Math.min(instrument.dots.length, paramFrets + 1); ++x)
      {
        for (let i = 0; i < instrument.dots[x]; ++i)
        {
          const circle = document.createElementNS(NS, "circle");

          circle
            .attr("r", roundTwo(STRING_SPACING / 6) + "mm")
            .attr("fill", "grey")
            .attr("cx", roundTwo(LEFT + x * fretSpacing - fretSpacing / 2) + "mm")
            .attr(
              "cy",
              roundTwo(STRING_TOP + instrument.strings * STRING_SPACING + i * (STRING_SPACING / 3 + 0.5)) + "mm"
            );

          svg.appendChild(circle);
        }
      }
    }

    // https://personal.sron.nl/~pault/#fig:scheme_light
    const COLORS = ["#eedd88", "#ee8866", "#99ddff", "#bbcc33", "#ffaabb", "#44bb99", "#dddddd"];

    for (let y = instrument.strings - 1; y > -1; --y)
    {
      for (let x = 0; x < paramFrets + 1; ++x)
      {
        const noteIndex = (tuning.tuning[instrument.strings - y - 1] + x) % notes.length;

        const colorIndex =
          Math.trunc((12 + tuning.tuning[instrument.strings - y - 1] + x - degrees[0]) / notes.length);

        if (degrees.includes(noteIndex) || degreesAdd?.includes(noteIndex))
        {
          const circle = document.createElementNS(NS, "circle");

          const circleColor = adjustBrightness(COLORS[colorIndex], 0.8);
          let circleFillColor = COLORS[colorIndex];

          if (noteIndex == degrees[0])
          {
            circleFillColor = "white";
          }

          let cx = roundTwo(LEFT + x * fretSpacing - fretSpacing / 2);

          if (x == 0)
          {
            cx = roundTwo(LEFT - (STRING_SPACING * 2) / 2.5);
          }

          circle
            .attr("r", roundTwo(STRING_SPACING / 2.5) + "mm")
            .attr("stroke", circleColor)
            .attr("fill", circleFillColor)
            .attr("stroke-width", "0.5mm")
            .attr("cx", cx + "mm")
            .attr("cy", roundTwo(STRING_TOP + y * STRING_SPACING) + "mm");

          svg.appendChild(circle);

          const text = document.createElementNS(NS, "text");
          text.textContent = notes[noteIndex];

          text.attr("text-anchor", "middle")
            .attr("x", cx + "mm")
            .attr("y", roundTwo(STRING_TOP + y * STRING_SPACING + 1) + "mm");

          svg.appendChild(text);
        }
      }
    }

    fb.appendChild(svg);

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

interface Window
{
  openGh(): void;
}

//----------------------------------------------------------------------------------------------------------------------

window.addEventListener("DOMContentLoaded", () =>
{
  window.addEventListener("load", darwFretboard);

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
        op.text = INSTRUMENTS[i].tuning[j].name;

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
    document.getElementById(element)?.addEventListener("change", darwFretboard);
  });

  const domSave = document.getElementById("save");
  domSave?.addEventListener("click", () =>
  {
    const svg = document.getElementById("fretboard") as unknown as SVGGElement;

    if (svg)
    {
      const fileContent =
        'data:image/svg+xml,' + encodeURIComponent('<?xml version="1.0" encoding="UTF-8"?>' + svg.innerHTML);

      saveAs(fileContent, "scale.svg");
    }
  });

  const domLink = document.getElementById("link") as HTMLAnchorElement;
  domLink?.addEventListener("click", () =>
  {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.indexOf(' electron/') > -1)
    {
      window.openGh();
    }
    else
    {
      window.location.assign("https://github.com/ebinans/fretwork");
    }
  });
});

//----------------------------------------------------------------------------------------------------------------------
// EOF
//----------------------------------------------------------------------------------------------------------------------
