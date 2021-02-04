//----------------------------------------------------------------------------------------------------------------------
/**
 * @author Edgars Bināns <edgars@eb.lv>
 * @copyright Copyright (c) 2021 Edgars Bināns
 * @license MIT
 */
//----------------------------------------------------------------------------------------------------------------------

export class Utils
{
	static uMod(num: number, div: number): number
	{
		return ((num % div) + div) % div;
	}

	static mmToPtInt(mm: number): number
	{
		return Math.round(mm * 2.8346456692913);
	}

	static mmToPt(mm: number): number
	{
		return mm * 2.8346456692913;
	}

	static adjustBrightness(color: string, scale: number): string
	{
		let rgb = parseInt(color.substr(1), 16);

		const r = Math.min(Math.round(((rgb >> 16) & 0xff) * scale), 255);
		const g = Math.min(Math.round(((rgb >> 8) & 0xff) * scale), 255);
		const b = Math.min(Math.round(((rgb >> 0) & 0xff) * scale), 255);

		rgb = (r << 16) | (g << 8) | b;

		return "#" + rgb.toString(16).padStart(6, "0");
	}

	static saveAs(uri: string, filename: string)
	{
		const link = document.createElement("a");

		link.href = uri;
		link.download = filename;
		link.click();
	}

	private static readonly romanMatrix: [number, string][] = [
		[1000, "M"],
		[900, "CM"],
		[500, "D"],
		[400, "CD"],
		[100, "C"],
		[90, "XC"],
		[50, "L"],
		[40, "XL"],
		[10, "X"],
		[9, "IX"],
		[5, "V"],
		[4, "IV"],
		[1, "I"],
	];

	static toRoman(num: number): string
	{
		for (var i = 0; i < Utils.romanMatrix.length; i++)
		{
			if (num >= Utils.romanMatrix[i][0])
			{
				return Utils.romanMatrix[i][1] + Utils.toRoman(num - Utils.romanMatrix[i][0]);
			}
		}

		return "";
	}
}

//----------------------------------------------------------------------------------------------------------------------
// EOF
//----------------------------------------------------------------------------------------------------------------------
