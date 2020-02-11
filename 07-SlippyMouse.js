slippyMouse = function (impactRadius, cuttingRadius, slipFactor) {
    mouse.call(this, impactRadius, cuttingRadius, slipFactor);
};

slippyMouse.prototype = new mouse();
slippyMouse.prototype.constructor = slippyMouse;

slippyMouse.prototype.onDown = function (mouseDownEvent) {
    this.key = mouseDownEvent.which;
    this.x = mouseDownEvent.offsetX;
    this.y = mouseDownEvent.offsetY;
    this.getNodesForCoordinates(this.x, this.y);
    if (mouseDownEvent.target == pyGrid.canvas) {
        switch (this.key) {
            case 1:
                break;
            case 2:
                this.closestNode.pin();
                break;
            case 3:
                if (pyGrid.rightClickAction === 0)
                    this.cut();
                else
                    this.closestNode.mark();
                break;
            default:
                break;
        }
    }
    else if (mouseDownEvent.target.className == 'dragbox') {
        var dragBoxIndex = mouseDownEvent.target.getAttribute("dragbox-index");
        this.dragBox = pyGrid.dragBoxes[dragBoxIndex];
        this.dragBox.updateBoundaries();
    }
};

slippyMouse.prototype.onMove = function (moveEvent) {
    if (moveEvent.target != pyGrid.canvas)
        return;
    this.x = moveEvent.offsetX;
    this.y = moveEvent.offsetY;
    this.dragVect.x = moveEvent.movementX;
    this.dragVect.y = moveEvent.movementY;
    this.getNodesForCoordinates(this.x, this.y, false);
    if (this.key === 1) {
        if (this.hasDragBox)
            this.dragBox.move(this.dragVect.x, this.dragVect.y);
        else
            this.drag();
    } else if (this.key === 3) {
        this.cut();
    }
    this.clearNodes();
};

slippyMouse.prototype.getNodesForCoordinates = function (hor, ver, markPath = false) {
    this.closestNode = pyGrid.graph.getClosestNodeToCoordinates(hor, ver, markPath);
    this.touchedNodes = this.closestNode.getNodesInRadius(this.impactRadius);
};

slippyMouse.prototype.clearNodes = function () {
    this.closestNode = null;
    this.touchedNodes = [];
};

slippyMouse.prototype.cut = function () {
    this.touchedNodes.forEach(function (n) {
        n.removeLinks();
    });
};

slippyMouse.prototype.drag = function () {
    this.touchedNodes.forEach(function (n) {
        n.move({ x: this.dragVect.x * this.slipFactor, y: this.dragVect.y * this.slipFactor })
    }, this);
};

Object.defineProperties(slippyMouse.prototype, {
    isUp: { get: function () { return this.key === 0 } },
    hasDragBox: { get: function () { return this.dragBox !== null } },
    isHoldingNodes: { get: function () { return this.heldNodes.length !== 0 } },
});
