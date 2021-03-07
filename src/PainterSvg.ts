//----------------------------------------------------------------------------------------------------------------------
/**
 * @author Edgars Bināns <edgars@eb.lv>
 * @copyright Copyright (c) 2021 Edgars Bināns
 * @license MIT
 */
//----------------------------------------------------------------------------------------------------------------------

import { Painter, PainterLineCap } from "./Painter";

//----------------------------------------------------------------------------------------------------------------------

function mm(num: number): string
{
	num = Math.round(num * 1000) / 1000;
	return `${num}mm`;
}

//----------------------------------------------------------------------------------------------------------------------

export class PainterSvg extends Painter
{
	private svg: SVGSVGElement;
	private static readonly NS = "http://www.w3.org/2000/svg";

	getSvg(): SVGSVGElement
	{
		return this.svg;
	}

	constructor()
	{
		super();
		this.svg = document.createElementNS(PainterSvg.NS, "svg");
	}

	page(pageW: number, pageH: number): void
	{
		this.svg.setAttribute("xmlns", PainterSvg.NS);
		this.svg.setAttribute("width", mm(pageW));
		this.svg.setAttribute("height", mm(pageH));
		this.svg.setAttribute("font-family", "'DejaVu Sans', Verdana, Geneva, Tahoma, sans-serif");
		this.svg.setAttribute("font-size", mm(Painter.DEFAULT_FONT_SIZE));
		this.svg.setAttribute("font-weight", "bold");
		this.svg.setAttribute("fill", Painter.DEFAULT_FONT_COLOR);
		this.svg.setAttribute("text-anchor", "middle");
		this.svg.setAttribute("dominant-baseline", "central");

		const background = document.createElementNS(PainterSvg.NS, "rect");

		background.setAttribute("width", "100%");
		background.setAttribute("height", "100%");
		background.setAttribute("fill", "white");

		this.svg.appendChild(background);
	}

	textMiddle(text: string, x: number, y: number, color?: string, size?: number, link?: string): void
	{
		const textNode = document.createElementNS(PainterSvg.NS, "text");

		textNode.textContent = text;

		textNode.setAttribute("x", mm(x));
		textNode.setAttribute("y", mm(y));

		if (size)
		{
			textNode.setAttribute("font-size", mm(size));
		}

		if (color)
		{
			textNode.setAttribute("fill", color);
		}

		if (link)
		{
			const aNode = document.createElementNS(PainterSvg.NS, "a");
			aNode.setAttribute("href", "https://fretwork.eb.lv/");
			aNode.appendChild(textNode);
			this.svg.appendChild(aNode);
		}
		else
		{
			this.svg.appendChild(textNode);
		}
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
		const line = document.createElementNS(PainterSvg.NS, "line");

		line.setAttribute("x1", mm(x1));
		line.setAttribute("y1", mm(y1));
		line.setAttribute("x2", mm(x2));
		line.setAttribute("y2", mm(y2));
		line.setAttribute("stroke", stroke);
		line.setAttribute("stroke-width", mm(width));

		if (linecap)
		{
			line.setAttribute("stroke-linecap", linecap);
		}

		this.svg.appendChild(line);
	}

	circle(
		radius: number,
		cx: number,
		cy: number,
		fill: string,
		stroke?: string,
		width?: number,
		data?: unknown
	): void
	{
		const circle = document.createElementNS(PainterSvg.NS, "circle");

		circle.setAttribute("r", mm(radius));
		circle.setAttribute("cx", mm(cx));
		circle.setAttribute("cy", mm(cy));
		circle.setAttribute("fill", fill);

		if (stroke && width)
		{
			circle.setAttribute("stroke", stroke);
			circle.setAttribute("stroke-width", mm(width));
		}

		if (data)
		{
			circle.setAttribute("data", JSON.stringify(data));
		}

		this.svg.appendChild(circle);
	}
}

//----------------------------------------------------------------------------------------------------------------------
// EOF
//----------------------------------------------------------------------------------------------------------------------
