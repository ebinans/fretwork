//----------------------------------------------------------------------------------------------------------------------
/**
 * @author Edgars Bināns <edgars@eb.lv>
 * @copyright Copyright (c) 2021 Edgars Bināns
 * @license MIT
 */
//----------------------------------------------------------------------------------------------------------------------

import { Painter, PainterLineCap } from "./Painter";

//----------------------------------------------------------------------------------------------------------------------

export class PainterSvg extends Painter
{
	private svg: SVGSVGElement;

	getSvg(): SVGSVGElement
	{
		return this.svg;
	}

	constructor()
	{
		super();

		const NS = "http://www.w3.org/2000/svg";
		this.svg = document.createElementNS(NS, "svg");
	}

	page(pageW: number, pageH: number)
	{
		this.svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		this.svg.setAttribute("width", pageW + "mm");
		this.svg.setAttribute("height", pageH + "mm");
		this.svg.setAttribute("font-family", "'DejaVu Sans', Verdana, Geneva, Tahoma, sans-serif");
		this.svg.setAttribute("font-size", Painter.DEFAULT_FONT_SIZE + "mm");
		this.svg.setAttribute("font-weight", "bold");
		this.svg.setAttribute("fill", Painter.DEFAULT_FONT_COLOR);
		this.svg.setAttribute("text-anchor", "middle");
		this.svg.setAttribute("dominant-baseline", "central");

		const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");

		background.setAttribute("width", "100%");
		background.setAttribute("height", "100%");
		background.setAttribute("fill", "white");

		this.svg.appendChild(background);
	}

	textMiddle(text: string, x: number, y: number, size?: number, link?: string, color?: string): void
	{
		const textNode = document.createElementNS("http://www.w3.org/2000/svg", "text");

		textNode.textContent = text;

		textNode.setAttribute("x", x + "mm");
		textNode.setAttribute("y", y + "mm");

		if (size)
		{
			textNode.setAttribute("font-size", size + "mm");
		}

		if (color)
		{
			textNode.setAttribute("fill", color);
		}

		if (link)
		{
			const aNode = document.createElementNS("http://www.w3.org/2000/svg", "a");
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

//----------------------------------------------------------------------------------------------------------------------
// EOF
//----------------------------------------------------------------------------------------------------------------------
