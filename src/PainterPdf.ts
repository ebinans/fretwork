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

import { Utils } from "./Utils";
import { Painter, PainterLineCap } from "./Painter";

//----------------------------------------------------------------------------------------------------------------------

export class PainterPdf extends Painter
{
	private pdf: PDFKit.PDFDocument;
	private stream: blobStream.IBlobStream;

	savePdf(filename: string)
	{
		this.stream.on('finish', () =>
		{
			const link = document.createElement("a");

			link.href = this.stream.toBlobURL('application/pdf');
			link.download = filename;
			link.click();
		});

		this.pdf.end();
	}

	constructor()
	{
		super();

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
		this.pdf.addPage({ size: [Utils.mmToPtInt(pageW), Utils.mmToPtInt(pageH)], margin: 0 });
		this.pdf.font("DejaVu Sans Bold");
	}

	textMiddle(text: string, x: number, y: number, size?: number, link?: string): void
	{
		this.pdf.fillColor(Painter.DEFAULT_FONT_COLOR).fontSize(Utils.mmToPt(size ? size : Painter.DEFAULT_FONT_SIZE));
		const textWidth = this.pdf.widthOfString(text);
		const textHeight = this.pdf.heightOfString(text);

		this.pdf.text(text, Utils.mmToPt(x) - textWidth / 2, Utils.mmToPt(y) - textHeight / 2, { link: link });
	}

	line(x1: number, y1: number, x2: number, y2: number, stroke: string, width: number, linecap?: PainterLineCap): void
	{
		if (linecap)
		{
			this.pdf
				.lineCap(linecap)
				.moveTo(Utils.mmToPt(x1), Utils.mmToPt(y1))
				.lineTo(Utils.mmToPt(x2), Utils.mmToPt(y2))
				.lineWidth(Utils.mmToPt(width))
				.stroke(stroke);
		}

		else
		{
			this.pdf
				.moveTo(Utils.mmToPt(x1), Utils.mmToPt(y1))
				.lineTo(Utils.mmToPt(x2), Utils.mmToPt(y2))
				.lineWidth(Utils.mmToPt(width))
				.stroke(stroke);
		}
	}

	circle(radius: number, cx: number, cy: number, fill: string, stroke?: string, width?: number): void
	{
		if (stroke && width)
		{
			this.pdf
				.circle(Utils.mmToPt(cx), Utils.mmToPt(cy), Utils.mmToPt(radius))
				.lineWidth(Utils.mmToPt(width))
				.fillAndStroke(fill, stroke);
		}

		else
		{
			this.pdf
				.circle(Utils.mmToPt(cx), Utils.mmToPt(cy), Utils.mmToPt(radius))
				.fill(fill);
		}
	}
}

//----------------------------------------------------------------------------------------------------------------------
// EOF
//----------------------------------------------------------------------------------------------------------------------
