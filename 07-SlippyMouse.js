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
    if (this.key === 0)
        return;

    if (this.hasDragBox) {
        this.dragBox.move(moveEvent.movementX, moveEvent.movementY);
    } else {
        if (moveEvent.target !== pyGrid.canvas)
            return;
        this.x = moveEvent.offsetX;
        this.y = moveEvent.offsetY;
        this.dragVect.x = moveEvent.movementX;
        this.dragVect.y = moveEvent.movementY;
        this.getNodesForCoordinates(this.x, this.y, false);
        if (this.key === 1) {
            this.drag();
        } else if (this.key === 3) {
            //Todo: Replace with enum for mouse actions
            if (pyGrid.rightClickAction === 0)
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
    this.getNodesInRadius(this.closestNode, hor, ver, markPath);
};

slippyMouse.prototype.getNodesInRadius = function (rootNode, hor, ver, markPath) {
    this.touchedNodes.push(rootNode);
    rootNode.visited = true;
    if (markPath)
        rootNode.mark();
    rootNode.neighbours.forEach(function (n) {
        if (n.visited === false && n.getDistanceToCoordinates(hor, ver) <= this.impactRadius) {
            this.getNodesInRadius(n, hor, ver);
        }
    }, this);
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
    isUp: { get: function () { return this.key === 0 } },
    hasDragBox: { get: function () { return this.dragBox !== null } },
    isHoldingNodes: { get: function () { return this.heldNodes.length !== 0 } },
});
