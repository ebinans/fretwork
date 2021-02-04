//----------------------------------------------------------------------------------------------------------------------
/**
 * @author Edgars Bināns <edgars@eb.lv>
 * @copyright Copyright (c) 2021 Edgars Bināns
 * @license MIT
 */
//----------------------------------------------------------------------------------------------------------------------

import PDFDocument = require("pdfkit");
import blobStream = require("blob-stream");

import { Utils } from "./Utils";
import { Painter, PainterLineCap } from "./Painter";

//----------------------------------------------------------------------------------------------------------------------

export class PainterPdf extends Painter
{
	private pdf: PDFKit.PDFDocument;
	private stream: blobStream.IBlobStream;

	savePdf(filename: string)
	{
		this.stream.on("finish", () =>
		{
			const link = document.createElement("a");

			link.href = this.stream.toBlobURL("application/pdf");
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
			.then((response) => response.arrayBuffer())
			.then((font) => this.pdf.registerFont("DejaVu Sans Bold", font));
	}

	page(pageW: number, pageH: number)
	{
		this.pdf.addPage({ size: [Utils.mmToPtInt(pageW), Utils.mmToPtInt(pageH)], margin: 0 });
		this.pdf.font("DejaVu Sans Bold");
	}

	textMiddle(text: string, x: number, y: number, size?: number, link?: string, color?: string): void
	{
		this.pdf
			.fillColor(color ? color : Painter.DEFAULT_FONT_COLOR)
			.fontSize(Utils.mmToPt(size ? size : Painter.DEFAULT_FONT_SIZE));

		const textWidth = this.pdf.widthOfString(text);
		const textHeight = this.pdf.heightOfString(text);

		this.pdf.text(text, Utils.mmToPt(x) - textWidth / 2, Utils.mmToPt(y) - textHeight / 2, { link: link });
	}

	line(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		stroke: string,
		width: number,
		linecap?: PainterLineCap
	): void
	{
		this.pdf.lineCap(linecap ? linecap : "butt");

		this.pdf
			.moveTo(Utils.mmToPt(x1), Utils.mmToPt(y1))
			.lineTo(Utils.mmToPt(x2), Utils.mmToPt(y2))
			.lineWidth(Utils.mmToPt(width))
			.stroke(stroke);
	}

	circle(radius: number, cx: number, cy: number, fill: string, stroke?: string, width?: number): void
	{
		this.pdf.circle(Utils.mmToPt(cx), Utils.mmToPt(cy), Utils.mmToPt(radius));

		if (stroke && width)
		{
			this.pdf.lineWidth(Utils.mmToPt(width)).fillAndStroke(fill, stroke);
		}
		else
		{
			this.pdf.fill(fill);
		}
	}
}

//----------------------------------------------------------------------------------------------------------------------
// EOF
//----------------------------------------------------------------------------------------------------------------------
