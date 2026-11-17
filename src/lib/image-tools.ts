export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not save the image."));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

export function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image. Use a JPG, PNG, or WebP."));
    };
    image.src = url;
  });
}

export function drawCover(
  image: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
) {
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not prepare the image.");
  }
  const scale = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const cropWidth = targetWidth / scale;
  const cropHeight = targetHeight / scale;
  context.drawImage(
    image,
    (sourceWidth - cropWidth) / 2,
    (sourceHeight - cropHeight) / 2,
    cropWidth,
    cropHeight,
    0,
    0,
    targetWidth,
    targetHeight,
  );
  return canvas;
}

export async function jpegWithinLimit(
  canvas: HTMLCanvasElement,
  maxBytes: number,
) {
  let width = canvas.width;
  let height = canvas.height;
  let current = canvas;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    let quality = 0.92;
    let blob = await canvasToBlob(current, "image/jpeg", quality);
    while (blob.size > maxBytes && quality > 0.46) {
      quality = Math.round((quality - 0.08) * 100) / 100;
      blob = await canvasToBlob(current, "image/jpeg", quality);
    }
    if (blob.size <= maxBytes || width < 80 || height < 80) {
      return { blob, width, height };
    }
    width = Math.max(80, Math.round(width * 0.85));
    height = Math.max(80, Math.round(height * 0.85));
    const smaller = document.createElement("canvas");
    smaller.width = width;
    smaller.height = height;
    const context = smaller.getContext("2d");
    if (!context) {
      throw new Error("Could not prepare the image.");
    }
    context.drawImage(canvas, 0, 0, width, height);
    current = smaller;
  }

  const blob = await canvasToBlob(current, "image/jpeg", 0.5);
  return { blob, width: current.width, height: current.height };
}

function fittedCanvas(image: HTMLImageElement, maxEdge: number) {
  const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Could not prepare the image.");
  }
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export async function cropSignature(
  file: File,
  boxWidth: number,
  boxHeight: number,
) {
  const image = await loadImage(file);
  const source = fittedCanvas(image, 1400);
  const context = source.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Could not read the signature.");
  }
  const pixels = context.getImageData(0, 0, source.width, source.height);
  const bounds = inkBounds(pixels);
  if (!bounds) {
    throw new Error("No signature ink was found. Use a dark signature on a light page.");
  }

  const output = document.createElement("canvas");
  output.width = boxWidth;
  output.height = boxHeight;
  const outputContext = output.getContext("2d");
  if (!outputContext) {
    throw new Error("Could not prepare the signature.");
  }
  outputContext.fillStyle = "#ffffff";
  outputContext.fillRect(0, 0, boxWidth, boxHeight);
  const padding = 6;
  const availableWidth = boxWidth - padding * 2;
  const availableHeight = boxHeight - padding * 2;
  const scale = Math.min(availableWidth / bounds.width, availableHeight / bounds.height);
  const width = bounds.width * scale;
  const height = bounds.height * scale;
  outputContext.drawImage(
    source,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
    (boxWidth - width) / 2,
    (boxHeight - height) / 2,
    width,
    height,
  );
  return canvasToBlob(output, "image/png");
}

function inkBounds(pixels: ImageData) {
  const { data, width, height } = pixels;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];
      const dark =
        data[index] < 235 || data[index + 1] < 235 || data[index + 2] < 235;
      if (alpha > 24 && dark) {
        found = true;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (!found) {
    return null;
  }
  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

export async function plainBackground(
  file: File,
  color: [number, number, number],
  tolerance: number,
) {
  const image = await loadImage(file);
  const canvas = fittedCanvas(image, 1400);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Could not read the photo.");
  }
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = pixels;
  const corners = [
    0,
    (width - 1) * 4,
    (height - 1) * width * 4,
    ((height - 1) * width + (width - 1)) * 4,
  ];
  const seed = corners.reduce(
    (total, index) => [
      total[0] + data[index],
      total[1] + data[index + 1],
      total[2] + data[index + 2],
    ],
    [0, 0, 0],
  );
  const background = seed.map((value) => Math.round(value / corners.length));
  const seen = new Uint8Array(width * height);
  const queue: number[] = [];

  const matches = (index: number) => {
    if (data[index + 3] < 16) {
      return true;
    }
    return (
      Math.abs(data[index] - background[0]) +
        Math.abs(data[index + 1] - background[1]) +
        Math.abs(data[index + 2] - background[2]) <=
      tolerance
    );
  };

  const push = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return;
    }
    const pixel = y * width + x;
    if (seen[pixel] || !matches(pixel * 4)) {
      return;
    }
    seen[pixel] = 1;
    queue.push(pixel);
  };

  for (let x = 0; x < width; x += 1) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    push(0, y);
    push(width - 1, y);
  }

  let head = 0;
  while (head < queue.length) {
    const pixel = queue[head];
    head += 1;
    const x = pixel % width;
    const y = (pixel - x) / width;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  for (let pixel = 0; pixel < seen.length; pixel += 1) {
    if (!seen[pixel]) {
      continue;
    }
    const index = pixel * 4;
    data[index] = color[0];
    data[index + 1] = color[1];
    data[index + 2] = color[2];
    data[index + 3] = 255;
  }

  context.putImageData(pixels, 0, 0);
  return canvasToBlob(canvas, "image/jpeg", 0.9);
}
