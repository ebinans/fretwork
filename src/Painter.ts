//----------------------------------------------------------------------------------------------------------------------
/**
 * @author Edgars Bināns <edgars@eb.lv>
 * @copyright Copyright (c) 2021 Edgars Bināns
 * @license MIT
 */
//----------------------------------------------------------------------------------------------------------------------

export type PainterLineCap = "butt" | "round" | "square";

export abstract class Painter
{
	static readonly DEFAULT_FONT_SIZE = 2.6;
	static readonly DEFAULT_FONT_COLOR = "#333333";

	abstract page(pageW: number, pageH: number): void;
	abstract textMiddle(text: string, x: number, y: number, color?: string, size?: number, link?: string): void;

	abstract circle(
		radius: number,
		cx: number,
		cy: number,
		fill: string,
		stroke?: string,
		width?: number,
		data?: unknown
	): void;

	abstract line(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		stroke: string,
		width: number,
		linecap?: PainterLineCap
	): void;
}

//----------------------------------------------------------------------------------------------------------------------
// EOF
//----------------------------------------------------------------------------------------------------------------------
