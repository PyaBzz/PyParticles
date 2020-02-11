slippyMouse = function (impactRadius, cuttingRadius, slipFactor) {
    mouse.call(this, impactRadius, cuttingRadius, slipFactor);
};

slippyMouse.prototype = new mouse();
slippyMouse.prototype.constructor = slippyMouse;

slippyMouse.prototype.onMouseDown = function (mouseDownEvent) {
    this.key = mouseDownEvent.which;
    this.clickX = mouseDownEvent.x;
    this.clickY = mouseDownEvent.y;
    this.x = mouseDownEvent.x;
    this.y = mouseDownEvent.y;
    this.getNodesForCoordinates(this.clickX, this.clickY);
    if (mouseDownEvent.target == pyGrid.canvas) {
        switch (this.key) {
            case 1:
                this.getNodesForCoordinates(this.clickX, this.clickY, false);
                break;
            case 2:
                this.closestNode.pin();
                break;
            case 3:
                if (pyGrid.rightClickAction === 0)
                    this.cut();
                else
                    this.getNodesForCoordinates(this.clickX, this.clickY, true);
                // this.closestNode.mark();
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

slippyMouse.prototype.dragThem = function (moveEvent) {
    if (this.key !== 1)
        return;
    // console.log(moveEvent);
    var currentDragStartX = this.x;
    var currentDragStartY = this.y;
    this.x = moveEvent.pageX;
    this.y = moveEvent.pageY;
    pyGrid.mouse.dragVect.x = this.x - currentDragStartX;
    pyGrid.mouse.dragVect.y = this.y - currentDragStartY;
    if (pyGrid.mouse.hasDragBox)
        pyGrid.mouse.dragBox.move(pyGrid.mouse.dragVect.x, pyGrid.mouse.dragVect.y);


    this.getNodesForCoordinates(this.x, this.y, false);
    // this.closestNode.mark();
    this.touchedNodes.forEach(function (n) {
        n.move({ x: pyGrid.mouse.dragVect.x * pyGrid.mouse.slipFactor, y: pyGrid.mouse.dragVect.y * pyGrid.mouse.slipFactor })
    });
    this.clearNodes();

    this.x += this.dragVect.x;
    this.y += this.dragVect.y;
};

slippyMouse.prototype.getNodesForCoordinates = function (hor, ver, markPath = false) {
    var gridCoordinates = pyGrid.convertCoordinate.fromWindowToPyGrid(hor, ver);
    this.closestNode = pyGrid.graph.getClosestNodeToCoordinates(gridCoordinates.hor, gridCoordinates.ver, markPath);
    this.touchedNodes = this.closestNode.getNodesInRadius(this.impactRadius);
    // this.touchedNodes.forEach(function (n) { n.mark() });
};

slippyMouse.prototype.clearNodes = function () {
    this.closestNode = null;
    this.touchedNodes = [];
};

slippyMouse.prototype.check = function (node) {
    // var distance = this.cursorDistanceTo(node);
    // if (distance < this.closestNodeDistance) {
    //     this.closestNode = node;
    //     this.closestNodeDistance = distance;
    // }
    // if (node.pinned) return;
    // if (this.hasDragBox) {
    //     if (this.dragBox.coversNode(node)) {
    //         this.touchedNodes.push(node);
    //     }
    // } else {
    //     if (distance <= this.cuttingRadius)
    //         this.cutNodes.push(node);

    //     if (distance <= this.impactRadius)
    //         this.touchedNodes.push(node);
    // }
};

slippyMouse.prototype.cursorDistanceTo = function (node) {
    return Math.sqrt(Math.pow(node.clientX - this.x, 2) + Math.pow(node.clientY - this.y, 2));
};

slippyMouse.prototype.clickDistanceTo = function (node) {
    return Math.sqrt(Math.pow(node.clientX - this.clickX, 2) + Math.pow(node.clientY - this.clickY, 2));
};

slippyMouse.prototype.cut = function () {
    this.cutNodes.forEach(function (n) {
        n.removeLinks();
    });
};

Object.defineProperties(slippyMouse.prototype, {
    isUp: { get: function () { return this.key === 0 } },
    hasDragBox: { get: function () { return this.dragBox !== null } },
    isHoldingNodes: { get: function () { return this.heldNodes.length !== 0 } },
});
