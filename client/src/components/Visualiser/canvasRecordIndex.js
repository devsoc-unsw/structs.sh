import { Recorder, RecorderStatus, Encoders } from "canvas-record";
import { AVC } from "media-codecs";
import { drawOnCanvas, getCanvas } from "./VisualiserCanvas";

// Animation
let rAFId;
let canvasRecorder;

function render() {
  drawOnCanvas();
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

 // render();
};

export const startRecording = async () => {
  await reset();
  const MAX_DURATION = 1000;

  canvasRecorder = new Recorder(getCanvas(), {
    name: "StructsVisualisation",
    duration: MAX_DURATION,
    frameRate: 30,
    encoder: new Encoders['MP4WasmEncoder'],
    download: true,
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

export const stopRecording = async () => {
  if (canvasRecorder) reset();
}
