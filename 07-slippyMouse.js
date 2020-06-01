slippyMouse = function (impactRadius, cuttingRadius, slipFactor) {
    mouse.call(this, impactRadius, cuttingRadius, slipFactor);
};

slippyMouse.prototype = new mouse();
slippyMouse.prototype.constructor = slippyMouse;

slippyMouse.prototype.onDown = function (mouseDownEvent) {
    this.key = mouseDownEvent.which;
    let hor = mouseDownEvent.offsetX;
    let ver = mouseDownEvent.offsetY;
    if (mouseDownEvent.target == bazGrid.canvas) {
        this.getNodesForCoordinates(hor, ver);
        switch (this.key) {
            case this.buttonsEnum.left:
                break;
            case this.buttonsEnum.middle:
                this.closestNode.pin();
                break;
            case this.buttonsEnum.right:
                if (bazGrid.rightClickAction === this.actionsEnum.cut)
                    this.cut();
                else
                    this.closestNode.mark();
                break;
            default:
                break;
        }
    }
    else if (mouseDownEvent.target.className == 'dragbox') {
        let dragBoxIndex = mouseDownEvent.target.getAttribute("dragbox-index");
        this.dragBox = bazGrid.dragBoxes[dragBoxIndex];
        this.dragBox.updateBoundaries();
    }
};

slippyMouse.prototype.onMove = function (moveEvent) {
    if (this.isUp)
        return;

    if (this.hasDragBox) {
        switch (this.key) {
            case this.buttonsEnum.left:
                this.dragBox.move(moveEvent.movementX, moveEvent.movementY, markPath = false);
                break;
            case this.buttonsEnum.middle:
                break;
            case this.buttonsEnum.right:
                this.dragBox.move(moveEvent.movementX, moveEvent.movementY, markPath = true);
                break;
            default:
                break;
        }
    } else {
        if (moveEvent.target !== bazGrid.canvas)
            return;
        let hor = moveEvent.offsetX + moveEvent.movementX;
        let ver = moveEvent.offsetY + moveEvent.movementY;
        let dragVect = { x: moveEvent.movementX, y: moveEvent.movementY };
        this.getNodesForCoordinates(hor, ver, false);
        switch (this.key) {
            case this.buttonsEnum.left:
                this.drag(dragVect);
                break;
            case this.buttonsEnum.middle:
                this.closestNode.pin();
                break;
            case this.buttonsEnum.right:
                if (bazGrid.rightClickAction === this.actionsEnum.cut)
                    this.cut();
                else
                    this.closestNode.mark();
                break;
            default:
                break;
        }
        this.clearNodes();
    }
};

slippyMouse.prototype.getNodesForCoordinates = function (hor, ver, markPath = false) {
    this.clearNodes();
    this.closestNode = bazGrid.graph.getClosestNodeToCoordinates(hor, ver, false);
    this.touchedNodes = bazGrid.graph.getNodesWhere(n => n.getDistanceToCoordinates(hor, ver) <= this.impactRadius, this.closestNode);
    return this.touchedNodes;
};

slippyMouse.prototype.clearNodes = function () {
    this.touchedNodes.forEach(function (n) { n.visited = false });
    this.touchedNodes = [];
    this.closestNode = null;
};

slippyMouse.prototype.cut = function () {
    this.touchedNodes.forEach(function (n) {
        n.removeLinks();
    });
};

slippyMouse.prototype.drag = function (dragVect) {
    this.touchedNodes.forEach(function (n) {
        n.move({ x: dragVect.x * this.slipFactor, y: dragVect.y * this.slipFactor })
    }, this);
};

Object.defineProperties(slippyMouse.prototype, {
    isUp: { get: function () { return this.key === this.buttonsEnum.none } },
    hasDragBox: { get: function () { return this.dragBox !== null } },
    isHoldingNodes: { get: function () { return this.heldNodes.length !== 0 } },
});
