mouse = function (impactRadius, cuttingRadius, slipFactor) {
    this.impactRadius = impactRadius;
    this.cuttingRadius = cuttingRadius;
    this.slipFactor = slipFactor;
    this.clickX = 0;
    this.clickY = 0;
    this.key = 0;
    this.closestNode = null;
    this.closestNodeDistance = Number.MAX_VALUE;
    this.cutNodes = [];
    this.touchedNodes = [];
    this.heldNodes = [];
    this.dragBox = null;
    this.actionsEnum = Object.freeze({ "cut": 0, "mark": 1 })
    this.buttonsEnum = Object.freeze({ "none": 0, "left": 1, "middle": 2, "right": 3 })
};

mouse.prototype.bindHandlers = function () {
    bazGrid.canvas.oncontextmenu = function (contextEvent) { contextEvent.preventDefault(); };
    bazGrid.dragBoxes.forEach(function (d) {
        d.element.oncontextmenu = function (contextEvent) { contextEvent.preventDefault(); };
    });

    bazGrid.onmousedown = function (mouseDownEvent) {
        mouseDownEvent.preventDefault();
        bazGrid.mouse.onDown(mouseDownEvent);
    };

    bazGrid.onmousemove = function (moveEvent) {
        moveEvent.preventDefault();
        bazGrid.mouse.onMove(moveEvent);
    };

    bazGrid.onmouseup = function (releaseEvent) {
        releaseEvent.preventDefault();
        bazGrid.mouse.heldNodes.forEach(function (p) { p.heldByMouse = false }); //TODO: Move to pinchyMouse.clearNodes()
        bazGrid.mouse.key = 0;
        bazGrid.mouse.clearNodes();
        bazGrid.mouse.dragBox = null;
    };
}
