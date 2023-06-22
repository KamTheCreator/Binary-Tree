class Explorer {
    static ZOOMFACTOR = 1.1; // The factor by which zooming occurs

    constructor(canvas, graphicsBuffer, drawFunction, zoomFactor = Explorer.ZOOMFACTOR) {
        // Canvas that clicks and mouse wheel events are detected on
        this.canvas = canvas;

        // The buffer that should be modified for panning and zooming
        this.graphicsBuffer = graphicsBuffer;

        // Function that will redraw the picture in the graphics buffer
        this.drawFunction = drawFunction;

        // The total transformations that have been applied to the graphics buffer
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoom = 1;

        // The factor by which zooming occurs
        this.zoomFactor = zoomFactor;

        // Reset the graphics buffer (so it can be poppe to reset it later)
        this.graphicsBuffer.push();

        // Register event listeners for zooming and panning
        canvas.addEventListener("wheel", this.wheel.bind(this));
        canvas.addEventListener("mousemove", this.mouseMove.bind(this));
    }

    // Returns the graphics buffer to its "Home" view. Not used right now
    reset() {
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoom = 1;

        this.graphicsBuffer.pop();
        this.graphicsBuffer.push();

        this.drawFunction();
    }

    // Event listener for panning. Detects when the mouse is pressed to detect
    // dragging, and uses the movementX/Y of the event to determine distance to pan
    mouseMove(event) {
        if(mouseIsPressed) {
            var deltaX = (1/this.zoom) * event.movementX;
            var deltaY = (1/this.zoom) * event.movementY;

            this.graphicsBuffer.translate(deltaX, deltaY);

            this.offsetX += deltaX;
            this.offsetY += deltaY;

            this.drawFunction();
        }
    }

    // Even listener for zooming. Uses the event's deltaY to determine whether
    // to zoom in or zoom out
    wheel(event) {
        var deltaX = (CANVASWIDTH/2) - this.offsetX;
        var deltaY = (CANVASHEIGHT/2) - this.offsetY;
        var zoomFactor;

        if(event.deltaY < 0) {
            zoomFactor = this.zoomFactor
        } else if(event.deltaY > 0){
            zoomFactor = 1/this.zoomFactor
        } else {
            // In case of sideways scroll on trackpad
            zoomFactor = 1;
        }

        this.graphicsBuffer.translate(deltaX, deltaY);
        this.graphicsBuffer.scale(zoomFactor);
        this.graphicsBuffer.translate(-deltaX, -deltaY);

        this.zoom *= zoomFactor;

        this.drawFunction();

        return false; // Prevent default scrolling behavoir (maybe?)
    }
}
