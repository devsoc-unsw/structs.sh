import { Recorder, RecorderStatus, Encoders } from "canvas-record";
import { canvasElement, drawer, svgElement } from "../VisualiserCanvas";

let rAFId;
let canvasRecorder;

const render = () => {
  drawer.drawOnCanvas(canvasElement, svgElement);
}

export const stopCapture = () => {
  if (canvasRecorder.status !== RecorderStatus.Stopped) stopRecording();
}

const tick = async () => {
  render();

  if (canvasRecorder.status !== RecorderStatus.Recording) return;
  await canvasRecorder.step();

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
    canvasRecorder = null;
  }
};

export const startRecording = async () => {
  await reset();
  const MAX_DURATION_SECONDS = 60 * 15;

  canvasRecorder = new Recorder(drawer.getCanvas(canvasElement), {
    name: "StructsVisualisation",
    duration: MAX_DURATION_SECONDS,
    frameRate: 55,
    download: true,
    encoder: new Encoders.H264MP4Encoder({}),
  });

  await canvasRecorder.start();
  tick();
}

export const stopRecording = async () => {
  if (canvasRecorder) reset();
}
