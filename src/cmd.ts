import * as fs from 'fs';
import decoder from 'jpeg-js/lib/decoder';
import { run } from './index';

// make sure we have an image going forward
const imgSrc = process.argv[2];
if (
  imgSrc == null ||
  imgSrc.length === 0 ||
  !fs.existsSync(imgSrc) ||
  imgSrc.indexOf('.jpg') === -1
) {
  throw new Error('jpg image source is required and needs to be valid');
}

const decodedImg: {
  width: number;
  height: number;
  data: Uint8Array;
} = decoder(fs.readFileSync(imgSrc), {
  useTArray: true,
  formatAsRGBA: false,
});

// console.log(run(decodedImg, ['.', '%'], 100));
console.log(run(decodedImg, [' ', ',', 'o', '%'], 100));
