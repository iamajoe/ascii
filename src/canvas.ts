import { run } from './index';

function getPixels(url) {
  return new Promise<{
    data: Uint8Array;
    width: number;
    height: number;
  }>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const context = canvas.getContext('2d');
      if (context == null) {
        resolve({
          data: new Uint8Array([]),
          width: 0,
          height: 0,
        });
        return;
      }

      context.drawImage(img, 0, 0);

      const pixels = context.getImageData(0, 0, img.width, img.height);

      resolve({
        data: new Uint8Array(pixels.data),
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = function (err) {
      reject(err);
    };
    img.src = url;
  });
}

export default async (url: string) => {
  const data = await getPixels(url);
  return run(data, ['%'], 100);
};
