mouse = function (impactRadius, cuttingRadius, slipFactor) {
    this.impactRadius = impactRadius;
    this.cuttingRadius = cuttingRadius;
    this.slipFactor = slipFactor;
    this.x = 0;
    this.y = 0;
    this.drag = { x: 0, y: 0 };
    this.clickX = 0;
    this.clickY = 0;
    this.key = 0;
    this.heldNodes = [];
    this.dragBox = null;
};

mouse.prototype.touches = function (node) {
    if (node.pinned)
        return false;
    if (this.hasDragBox)
        return node.isInBox(this.dragBox.left, this.dragBox.right, this.dragBox.top, this.dragBox.buttom)
    else
        return this.cursorDistanceTo(node) <= this.impactRadius;
};

mouse.prototype.dragHeldNodes = function () {
    pyGrid.mouse.heldNodes.forEach(function (n) {
        n.move({ x: pyGrid.mouse.drag.x, y: pyGrid.mouse.drag.y });
    });
};

mouse.prototype.cuts = function (node) {
    return this.cursorDistanceTo(node) <= this.cuttingRadius;
};

mouse.prototype.cursorDistanceTo = function (node) {
    return Math.sqrt(Math.pow(node.clientX - this.x, 2) + Math.pow(node.clientY - this.y, 2));
};

mouse.prototype.clickDistanceTo = function (node) {
    return Math.sqrt(Math.pow(node.clientX - this.clickX, 2) + Math.pow(node.clientY - this.clickY, 2));
};

Object.defineProperties(mouse.prototype, {
    isUp: { get: function () { return this.key === 0 } },
    isSlippy: { get: function () { return this.slipFactor !== 1 } },
    hasDragBox: { get: function () { return this.dragBox !== null } },
});

mouse.prototype.bindMouseHandlers = function () {
    pyGrid.canvas.oncontextmenu = function (contextEvent) { contextEvent.preventDefault(); };
    pyGrid.dragBoxes.forEach(function (d) { d.element.oncontextmenu = function (contextEvent) { contextEvent.preventDefault(); }; });

    pyGrid.onmousedown = function (mouseDownEvent) {
        mouseDownEvent.preventDefault();
        pyGrid.mouse.key = mouseDownEvent.which;
        pyGrid.mouse.clickX = mouseDownEvent.x;
        pyGrid.mouse.clickY = mouseDownEvent.y;
        if (mouseDownEvent.target == pyGrid.canvas) {
            if (pyGrid.mouse.key == 1) {
                if (pyGrid.mouse.isSlippy === false) {
                    pyGrid.graph.doToAllNodes(function (p) {
                        if (pyGrid.mouse.touches(p)) {
                            p.heldByMouse = true;
                            pyGrid.mouse.heldNodes.push(p);
                        }
                    });
                }
            }
        }
        else if (mouseDownEvent.target.className == 'dragbox') {
            var dragBoxIndex = mouseDownEvent.target.getAttribute("dragbox-index");
            pyGrid.mouse.dragBox = pyGrid.dragBoxes[dragBoxIndex];
        }
    };

    pyGrid.onmousemove = function (moveEvent) {
        moveEvent.preventDefault();
        pyGrid.mouse.x = moveEvent.pageX;
        pyGrid.mouse.y = moveEvent.pageY;
        pyGrid.mouse.drag.x = moveEvent.movementX;
        pyGrid.mouse.drag.y = moveEvent.movementY;
        if (pyGrid.mouse.hasDragBox) {
            pyGrid.mouse.dragBox.move(pyGrid.mouse.drag.x, pyGrid.mouse.drag.y);
        }
        if (pyGrid.mouse.key !== 1)
            return;

        if (pyGrid.mouse.isSlippy === false)
            pyGrid.mouse.dragHeldNodes();
    };

    pyGrid.onmouseup = function (releaseEvent) {
        releaseEvent.preventDefault();
        pyGrid.mouse.heldNodes.forEach(function (p) { p.heldByMouse = false });
        pyGrid.mouse.key = 0;
        pyGrid.mouse.heldNodes = [];
        pyGrid.mouse.dragBox = null;
    };
}
