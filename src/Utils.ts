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
}

//----------------------------------------------------------------------------------------------------------------------
// EOF
//----------------------------------------------------------------------------------------------------------------------
