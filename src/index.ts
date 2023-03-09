import { isAbsolute } from 'path';

export const RGBToB = (r: number, g: number, b: number) => {
  return Math.max(r, g, b) / 255;
};

export const convert1DArrayToValue = (
  data: Uint8Array,
  width: number,
  toBeNewWidth: number
) => {
  const pixelRes = [] as number[];
  let minValue = 1;
  let maxValue = 0;

  const newWidth = toBeNewWidth > width ? width : toBeNewWidth;
  const pixelCount = data.length / 3;
  const height = pixelCount / width;
  const newHeight = Math.floor(newWidth / (width / height));

  const widthSlope = width / newWidth;
  const heightSlope = height / newHeight;
  // being ASCII, we need a ration of height because of the
  // height of the character
  const charSlope = 3;

  for (let i = 0; i < data.length; i += 3) {
    const currRow = Math.floor(i / 3 / width);
    const currCol = i / 3 - width * currRow;
    const newRow = Math.floor(currRow / heightSlope / charSlope);
    const newCol = Math.floor(currCol / widthSlope);
    const index = newRow * newWidth + newCol;

    // no need to continue if we already did previous calculations
    if (pixelRes[index] != null) {
      continue;
    }

    // convert rgb to value and cache it
    const v = RGBToB(data[i], data[i + 1], data[i + 2]);
    pixelRes[index] = v;

    minValue = v < minValue ? v : minValue;
    maxValue = v > maxValue ? v : maxValue;
  }

  return { data: pixelRes, width: newWidth, minValue, maxValue };
};

// binaryCharMap will be a set of characters to be used
// Example: ['%'] will setup a 2-bit ascii with foreground using %
// the return will be a 3 dimensional array where the first level
// is the bit level, second level row and third level column
export const run = (
  img: { width: number; data: Uint8Array },
  binaryCharMap: string[],
  newWidth: number
) => {
  if (img?.data.length === 0) {
    return '';
  }

  const { data, minValue, maxValue, width } = convert1DArrayToValue(
    img.data,
    img.width,
    newWidth
  );

  const chars = [...binaryCharMap];
  const bitsRaw = (maxValue - minValue) / chars.length;
  const charValueMap = chars.map((_, i) => bitsRaw + i * bitsRaw);

  let str = '\n';
  let colCount = 0;

  for (let i = 0; i < data.length; i += 1) {
    const v = data[i];

    // try to find the right index of char
    // TODO: there must be an easier way to do this
    let charIndex = 0;
    for (let c = 0; c < charValueMap.length; c += 1) {
      charIndex = c;
      if (charValueMap[c] > v) {
        break;
      }
    }

    str += chars[charIndex];
    colCount += 1;
    if (colCount % width === 0) {
      str += '\n';
    }
  }

  return str;
};
