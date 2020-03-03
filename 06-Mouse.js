mouse = function (impactRadius, cuttingRadius, slipFactor) {
    this.impactRadius = impactRadius;
    this.cuttingRadius = cuttingRadius;
    this.slipFactor = slipFactor;
    this.x = 0;
    this.y = 0;
    this.dragVect = { x: 0, y: 0 };
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
    pyGrid.canvas.oncontextmenu = function (contextEvent) { contextEvent.preventDefault(); };
    pyGrid.dragBoxes.forEach(function (d) {
        d.element.oncontextmenu = function (contextEvent) { contextEvent.preventDefault(); };
    });

    pyGrid.onmousedown = function (mouseDownEvent) {
        mouseDownEvent.preventDefault();
        pyGrid.mouse.onDown(mouseDownEvent);
    };

    pyGrid.onmousemove = function (moveEvent) {
        moveEvent.preventDefault();
        pyGrid.mouse.onMove(moveEvent);
    };

    pyGrid.onmouseup = function (releaseEvent) {
        releaseEvent.preventDefault();
        pyGrid.mouse.heldNodes.forEach(function (p) { p.heldByMouse = false }); //TODO: Move to pinchyMouse.clearNodes()
        pyGrid.mouse.key = 0;
        pyGrid.mouse.clearNodes();
        pyGrid.mouse.dragBox = null;
    };
}
