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
};

mouse.prototype.bindHandlers = function () {
    pyGrid.canvas.oncontextmenu = function (contextEvent) { contextEvent.preventDefault(); };
    pyGrid.dragBoxes.forEach(function (d) {
        d.element.oncontextmenu = function (contextEvent) { contextEvent.preventDefault(); };
    });

    pyGrid.onmousedown = function (mouseDownEvent) {
        mouseDownEvent.preventDefault();
        pyGrid.mouse.mouseDown(mouseDownEvent);
    };

    pyGrid.onmousemove = function (moveEvent) {
        moveEvent.preventDefault();
        pyGrid.mouse.x = moveEvent.pageX;
        pyGrid.mouse.y = moveEvent.pageY;
        pyGrid.mouse.dragVect.x = moveEvent.movementX;
        pyGrid.mouse.dragVect.y = moveEvent.movementY;
        if (pyGrid.mouse.hasDragBox)
            pyGrid.mouse.dragBox.move(pyGrid.mouse.dragVect.x, pyGrid.mouse.dragVect.y);

        pyGrid.mouse.dragThem();
    };

    pyGrid.onmouseup = function (releaseEvent) {
        releaseEvent.preventDefault();
        pyGrid.mouse.heldNodes.forEach(function (p) { p.heldByMouse = false });
        pyGrid.mouse.key = 0;
        pyGrid.mouse.clearNodes();
        pyGrid.mouse.dragBox = null;
    };
}
