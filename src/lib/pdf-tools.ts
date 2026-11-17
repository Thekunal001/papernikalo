import { PDFDocument } from "pdf-lib";
import { canvasToBlob, loadImage } from "@/lib/image-tools";

export function pdfBlob(bytes: Uint8Array) {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy], { type: "application/pdf" });
}

async function openPdf(file: File) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const data = new Uint8Array(await file.arrayBuffer());
  return pdfjs.getDocument({ data }).promise;
}

async function renderPage(file: File, scale: number, quality: number) {
  const document = await openPdf(file);
  const pages: { blob: Blob; width: number; height: number }[] = [];

  for (let number = 1; number <= document.numPages; number += 1) {
    const page = await document.getPage(number);
    const points = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale });
    const canvas = window.document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvas, viewport }).promise;
    pages.push({
      blob: await canvasToBlob(canvas, "image/jpeg", quality),
      width: points.width,
      height: points.height,
    });
  }

  await document.cleanup();
  return pages;
}

export async function compressPdf(file: File, scale: number, quality: number) {
  const pages = await renderPage(file, scale, quality);
  const document = await PDFDocument.create();

  for (const page of pages) {
    const image = await document.embedJpg(new Uint8Array(await page.blob.arrayBuffer()));
    const pdfPage = document.addPage([page.width, page.height]);
    pdfPage.drawImage(image, {
      x: 0,
      y: 0,
      width: page.width,
      height: page.height,
    });
  }

  return pdfBlob(await document.save());
}

export async function pdfPagesToImages(file: File) {
  const pages = await renderPage(file, 1.6, 0.85);
  return pages.map((page) => page.blob);
}

export async function mergeDocuments(files: File[]) {
  if (files.length < 2) {
    throw new Error("Add at least two files.");
  }
  const document = await PDFDocument.create();

  for (const file of files) {
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (isPdf) {
      const source = await PDFDocument.load(await file.arrayBuffer());
      const copied = await document.copyPages(source, source.getPageIndices());
      copied.forEach((page) => document.addPage(page));
      continue;
    }

    const image = await embedImage(document, file);
    const page = document.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  return pdfBlob(await document.save());
}

async function embedImage(document: PDFDocument, file: File) {
  if (file.type === "image/png") {
    return document.embedPng(await file.arrayBuffer());
  }
  if (file.type === "image/jpeg") {
    return document.embedJpg(await file.arrayBuffer());
  }
  const image = await loadImage(file);
  const canvas = window.document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not prepare an image for the PDF.");
  }
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0);
  const blob = await canvasToBlob(canvas, "image/jpeg", 0.9);
  return document.embedJpg(new Uint8Array(await blob.arrayBuffer()));
}
