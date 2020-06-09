mouse = function (impactRadius, cuttingRadius, slipFactor, bazgrid) {
    this.grid = bazgrid;
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

mouse.prototype.bindHandlers = function (bazgrid) {
    bazgrid.canvas.oncontextmenu = function (contextEvent) { contextEvent.preventDefault(); };
    bazgrid.dragBoxes.forEach(function (d) {
        d.element.oncontextmenu = function (contextEvent) { contextEvent.preventDefault(); };
    });

    bazgrid.onmousedown = function (mouseDownEvent) {
        mouseDownEvent.preventDefault();
        bazgrid.mouse.onDown(mouseDownEvent);
    };

    bazgrid.onmousemove = function (moveEvent) {
        moveEvent.preventDefault();
        bazgrid.mouse.onMove(moveEvent);
    };

    bazgrid.onmouseup = function (releaseEvent) {
        releaseEvent.preventDefault();
        bazgrid.mouse.heldNodes.forEach(function (p) { p.heldByMouse = false }); //TODO: Move to pinchyMouse.clearNodes()
        bazgrid.mouse.key = 0;
        bazgrid.mouse.clearNodes();
        bazgrid.mouse.dragBox = null;
    };
}
