slippyMouse = function (impactRadius, cuttingRadius, slipFactor) {
    mouse.call(this, impactRadius, cuttingRadius, slipFactor);
};

slippyMouse.prototype = new mouse();
slippyMouse.prototype.constructor = slippyMouse;

slippyMouse.prototype.onDown = function (mouseDownEvent) {
    this.key = mouseDownEvent.which;
    this.x = mouseDownEvent.offsetX;
    this.y = mouseDownEvent.offsetY;
    if (mouseDownEvent.target == pyGrid.canvas) {
        this.getNodesForCoordinates(this.x, this.y);
        switch (this.key) {
            case this.buttonsEnum.left:
                break;
            case this.buttonsEnum.middle:
                this.closestNode.pin();
                break;
            case this.buttonsEnum.right:
                if (pyGrid.rightClickAction === this.actionsEnum.cut)
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
    if (this.isUp)
        return;

    if (this.hasDragBox) {
        if (this.key === this.buttonsEnum.right)
            this.dragBox.move(moveEvent.movementX, moveEvent.movementY, markPath = true);
        else
            this.dragBox.move(moveEvent.movementX, moveEvent.movementY, markPath = false);
    } else {
        if (moveEvent.target !== pyGrid.canvas)
            return;
        this.x = moveEvent.offsetX;
        this.y = moveEvent.offsetY;
        this.dragVect.x = moveEvent.movementX;
        this.dragVect.y = moveEvent.movementY;
        this.getNodesForCoordinates(this.x, this.y, false);
        if (this.key === this.buttonsEnum.left) {
            this.drag();
        } else if (this.key === this.buttonsEnum.right) {
            if (pyGrid.rightClickAction === this.actionsEnum.cut)
                this.cut();
            else
                this.closestNode.mark();
        }
        this.clearNodes();
    }
};

slippyMouse.prototype.getNodesForCoordinates = function (hor, ver, markPath = false) {
    this.clearNodes();
    this.closestNode = pyGrid.graph.getClosestNodeToCoordinates(hor, ver, false);
    this.touchedNodes = pyGrid.graph.getNodesWhere(n => n.getDistanceToCoordinates(hor, ver) <= this.impactRadius, this.closestNode);
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

slippyMouse.prototype.drag = function () {
    this.touchedNodes.forEach(function (n) {
        n.move({ x: this.dragVect.x * this.slipFactor, y: this.dragVect.y * this.slipFactor })
    }, this);
};

Object.defineProperties(slippyMouse.prototype, {
    isUp: { get: function () { return this.key === this.buttonsEnum.none } },
    hasDragBox: { get: function () { return this.dragBox !== null } },
    isHoldingNodes: { get: function () { return this.heldNodes.length !== 0 } },
});
