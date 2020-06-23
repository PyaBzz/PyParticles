pinchyMouse = function (impactRadius, cuttingRadius, slipFactor, bazgrid) {
    mouse.call(this, impactRadius, cuttingRadius, slipFactor, bazgrid);
};

pinchyMouse.prototype = new mouse();
pinchyMouse.prototype.constructor = pinchyMouse;

pinchyMouse.prototype.bindHandlers = function () {
    mouse.prototype.bindHandlers.call(this);
}

pinchyMouse.prototype.onDown = function (mouseDownEvent) {
    mouse.prototype.onDown.call(this, mouseDownEvent);
};

pinchyMouse.prototype.onMove = function (moveEvent) {
    mouse.prototype.onMove.call(this, moveEvent);

    if (this.hasDragBox)
        return;
    if (moveEvent.target !== this.grid.canvas)
        return;
    let dragVect = { hor: moveEvent.movementX, ver: moveEvent.movementY };
    switch (this.key) {
        case this.buttonsEnum.left:
            this.drag(dragVect);
            break;
        case this.buttonsEnum.middle:
            this.getNodesForCoordinates(this.hor, this.ver, nodeVisitFunc = null);
            this.closestNode.pin();
            break;
        case this.buttonsEnum.right:
            this.getNodesForCoordinates(this.hor, this.ver, nodeVisitFunc = null);
            if (this.grid.rightClickAction === this.actionsEnum.cut)
                this.cut();
            else
                this.closestNode.mark();
            break;
        default:
            break;
    }
};

pinchyMouse.prototype.getNodesForCoordinates = function (hor, ver, nodeVisitFunc = null) {
    mouse.prototype.getNodesForCoordinates.call(this, hor, ver, nodeVisitFunc);
    this.touchedNodes.forEach((n) => n.heldByMouse = true);
};

pinchyMouse.prototype.clearNodes = function () {
    this.touchedNodes.forEach(function (p) { p.heldByMouse = false });
    mouse.prototype.clearNodes.call(this);
};

pinchyMouse.prototype.cut = function () {
    mouse.prototype.cut.call(this);
};

pinchyMouse.prototype.drag = function (dragVect) {
    this.touchedNodes.forEach(function (n) {
        n.move({ hor: dragVect.hor, ver: dragVect.ver })
    }, this);
};

Object.defineProperties(pinchyMouse.prototype, { //Todo: Move to parent class
    isUp: { get: function () { return this.key === this.buttonsEnum.none } },
    hasDragBox: { get: function () { return this.dragBox !== null } },
    isHoldingNodes: { get: function () { return this.heldNodes.length !== 0 } },
});
