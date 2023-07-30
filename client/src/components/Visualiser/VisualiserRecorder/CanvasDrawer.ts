import { stopRecording } from "./CanvasRecorder";

/* Singleton to ensure we're only using one drawer*/
class CanvasDrawer {
    private static BACKGROUND_COLOUR = "#eae8f5";
    private toggleGIF = false;
    private static instance : CanvasDrawer;

    private constructor() {}

    public static getInstance = (): CanvasDrawer => {
        if (!CanvasDrawer.instance) {
            CanvasDrawer.instance = new CanvasDrawer();
        }

        return CanvasDrawer.instance;
    }

    public getCanvas = (canvasElement) => {
        return canvasElement.current.getContext('2d');
    }

    public clearCanvas = (canvasElement) => {
        let canvas = canvasElement.current;
        let canvasContext = canvas.getContext('2d');
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        canvasContext.fillStyle = CanvasDrawer.BACKGROUND_COLOUR;
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    }

    public toggleCapture = () => {
        this.toggleGIF = !this.toggleGIF;
        if (!this.toggleGIF) stopRecording();
    }

    public drawOnCanvas = (canvasElement, svgElement) => {
        if (!canvasElement || !svgElement) return; 
        let canvas = canvasElement.current;
        let svg = svgElement.current;
        if (svg === null) return;

        let canvasContext = canvas.getContext('2d');
        let img = new Image();
        let svgXML = (new XMLSerializer).serializeToString(svg);
        img.src = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgXML);
    
        img.onload = function() {
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            canvasContext.fillStyle = "#eae8f5";
            canvasContext.fillRect(0, 0, canvas.width, canvas.height);
            canvasContext.drawImage(img, 0, 0);
            
        }
      }
}

export default CanvasDrawer;