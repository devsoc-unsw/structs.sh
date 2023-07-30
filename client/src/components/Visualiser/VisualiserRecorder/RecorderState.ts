import { drawOnCanvas, clearCanvas } from './../VisualiserCanvas';
import { startRecording, stopRecording } from '../VisualiserRecorder/canvasRecordIndex';

/* Using Singleton to ensure we always keep the same instance of recorder */
class RecorderState {
    private recording : Boolean;
    private static instance : RecorderState;
    private static UPLOAD_RATE = 10;
    private canvasInterval;

    private constructor() {
        this.recording = false;
        this.canvasInterval = null;
    }

    public static getInstance(): RecorderState {
        if (!RecorderState.instance) {
            RecorderState.instance = new RecorderState();
        }

        return RecorderState.instance;
    }

    public isRecording(): Boolean {
        return this.recording;
    }

    public toggleRecord() {
        this.recording = !this.recording;
    }

    public record() {
        if (this.canvasInterval === null) {
            clearCanvas();
            this.canvasInterval = setInterval(drawOnCanvas, RecorderState.UPLOAD_RATE);
            startRecording();
        }
    }

    public stop() {
        stopRecording();
        this.toggleRecord();
        clearInterval(this.canvasInterval);
        this.canvasInterval = null;
    }

}

export { RecorderState };
