import { fetchUrlAsDataUri } from "@lichens-innovation/ts-common/web";

export interface GenerateResumePdfArgs {
  locale: string;
}

interface RasterizeSvgToPngArgs {
  svg: string;
  maxSize?: number;
}

export const rasterizeSvgToPng = ({ svg, maxSize = 256 }: RasterizeSvgToPngArgs): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const [canvasW, canvasH] =
        aspectRatio >= 1
          ? [maxSize, Math.round(maxSize / aspectRatio)]
          : [Math.round(maxSize * aspectRatio), maxSize];

      const canvas = document.createElement("canvas");
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvasW, canvasH);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to rasterize SVG"));
    };
    img.src = objectUrl;
  });

export const getImageDimensions = (dataUri: string): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("Failed to load image dimensions"));
    img.src = dataUri;
  });

interface LogoForPdf {
  dataUri: string;
  width: number;
  height: number;
}

export const loadLogoForPdf = async (relativePath: string): Promise<LogoForPdf | null> => {
  const url = `${window.location.origin}${import.meta.env.BASE_URL}${relativePath}`;
  const dataUri = relativePath.endsWith(".svg")
    ? await fetch(url)
        .then((r) => r.text())
        .then((svgText) => rasterizeSvgToPng({ svg: svgText, maxSize: 256 }))
    : ((await fetchUrlAsDataUri(url)) ?? "");

  if (!dataUri) return null;

  const { width, height } = await getImageDimensions(dataUri);
  return { dataUri, width, height };
};

interface FitImageInBoxArgs {
  naturalWidth: number;
  naturalHeight: number;
  boxWidth: number;
  boxHeight: number;
}

interface FitImageInBoxResult {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

export const fitImageInBox = ({
  naturalWidth,
  naturalHeight,
  boxWidth,
  boxHeight,
}: FitImageInBoxArgs): FitImageInBoxResult => {
  const aspectRatio = naturalWidth / naturalHeight;
  let width = boxWidth;
  let height = boxWidth / aspectRatio;

  if (height > boxHeight) {
    height = boxHeight;
    width = boxHeight * aspectRatio;
  }

  return {
    offsetX: (boxWidth - width) / 2,
    offsetY: (boxHeight - height) / 2,
    width,
    height,
  };
};
