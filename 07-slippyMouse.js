slippyMouse = function (impactRadius, cuttingRadius, slipFactor, bazgrid) {
    mouse.call(this, impactRadius, cuttingRadius, slipFactor, bazgrid);
};

slippyMouse.prototype = new mouse();
slippyMouse.prototype.constructor = slippyMouse;

slippyMouse.prototype.bindHandlers = function () {
    mouse.prototype.bindHandlers.call(this);
}

slippyMouse.prototype.onDown = function (mouseDownEvent) {
    mouse.prototype.onDown.call(this, mouseDownEvent);
};

slippyMouse.prototype.onMove = function (moveEvent) {
    mouse.prototype.onMove.call(this, moveEvent);

    if (this.hasDragBox)
        return;
    if (moveEvent.target !== this.grid.canvas)
        return;
    let dragVect = { hor: moveEvent.movementX, ver: moveEvent.movementY };
    this.getNodesForCoordinates(this.hor, this.ver, nodeVisitFunc = null);
    switch (this.key) {
        case this.buttonsEnum.left:
            this.drag(dragVect);
            break;
        case this.buttonsEnum.middle:
            this.closestNode.pin();
            break;
        case this.buttonsEnum.right:
            if (this.grid.rightClickAction === this.actionsEnum.cut)
                this.cut();
            else
                this.closestNode.mark();
            break;
        default:
            break;
    }
    this.clearNodes();
};

slippyMouse.prototype.getNodesForCoordinates = function (hor, ver, nodeVisitFunc = null) {
    mouse.prototype.getNodesForCoordinates.call(this, hor, ver, nodeVisitFunc);
};

slippyMouse.prototype.clearNodes = function () {
    mouse.prototype.clearNodes.call(this);
};

slippyMouse.prototype.cut = function () {
    mouse.prototype.cut.call(this);
};

slippyMouse.prototype.drag = function (dragVect) {
    this.touchedNodes.forEach(function (n) {
        n.move({ hor: dragVect.hor * this.slipFactor, ver: dragVect.ver * this.slipFactor })
    }, this);
};

Object.defineProperties(slippyMouse.prototype, {
    isUp: { get: function () { return this.key === this.buttonsEnum.none } },
    hasDragBox: { get: function () { return this.dragBox !== null } },
    isHoldingNodes: { get: function () { return this.heldNodes.length !== 0 } },
});
