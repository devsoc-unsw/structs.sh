import { Recorder, RecorderStatus, Encoders } from "canvas-record";
import createCanvasContext from "canvas-context";
import { AVC } from "media-codecs";
import { canvasElement, drawOnCanvas } from "./VisualiserCanvas";

// Setup
const pixelRatio = devicePixelRatio;
const width = 512;
const height = 512;
const { context, canvas } = createCanvasContext("2d", {
  width: width * pixelRatio,
  height: height * pixelRatio,
  contextAttributes: { willReadFrequently: true },
});
Object.assign(canvas.style, { width: `${width}px`, height: `${height}px` });

let mainElement = null; 
export function setCanvas(c) {
  mainElement = c;
  mainElement.appendChild(canvas);
}

// Animation
let rAFId;
console.log("hi")
let canvasRecorder;

function render() {
  drawOnCanvas();
}

const tick = async () => {
  render();

  if (canvasRecorder.status !== RecorderStatus.Recording) return;
  await canvasRecorder.step();
  updateStatus();

  if (canvasRecorder.status !== RecorderStatus.Stopped) {
    rAFId = requestAnimationFrame(() => tick());
  }
};

const reset = async () => {
  if (rAFId) {
    cancelAnimationFrame(rAFId);
    rAFId = null;
  }
  if (canvasRecorder) {
    await canvasRecorder.stop();
    console.log("stopping recording.....");
    canvasRecorder = null;
  }

  render();
};


export const startRec = async () => {
  await reset();

  canvasRecorder = new Recorder(context, {
    name: "Canvas GIF Recorder",
    encoder: "GIFEncoder",
    encoderOptions: {
      codec: AVC.getCodec({ profile: "Main", level: "5.2" }),
    },
  });

  console.log(canvasRecorder);

  // Start and encode frame 0
  await canvasRecorder.start();

  // Animate to encode the rest
  tick(canvasRecorder);

}

export const stopRec = async () => {
  reset();
}
