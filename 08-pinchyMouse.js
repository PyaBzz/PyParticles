pinchyMouse = function (impactRadius, cuttingRadius, slipFactor) {
    console.error("Not implemented yet");
};

pinchyMouse.prototype = new mouse();
pinchyMouse.prototype.constructor = pinchyMouse;

pinchyMouse.prototype.onDown = function (mouseDownEvent) {
    this.key = mouseDownEvent.which;
    this.clickX = mouseDownEvent.x;
    this.clickY = mouseDownEvent.y;
    this.getNodesForCoordinates(this.clickX, this.clickY);
    if (mouseDownEvent.target == bazGrid.canvas) {
        switch (this.key) {
            case 1:
                if (this.isSlippy) {

                } else {
                    this.closestNode.heldByMouse = true;
                };
                break;
            case 2:
                if (this.isHoldingNodes)
                    this.heldNodes.forEach(function (n) { n.pin() });
                else
                    this.closestNode.pin();
                break;
            case 3:
                if (bazGrid.rightClickAction === 0)
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

pinchyMouse.prototype.onMove = function () {
    if (this.key !== 1)
        return;

    if (this.isSlippy) {
        this.getNodesForCoordinates(this.x, this.y);
        this.touchedNodes.forEach(function (n) {
            n.move({ x: bazGrid.mouse.dragVect.x * bazGrid.mouse.slipFactor, y: bazGrid.mouse.dragVect.y * bazGrid.mouse.slipFactor })
        });
        this.clearNodes();
    } else {

        this.heldNodes.forEach(function (n) {
            n.move({ x: bazGrid.mouse.dragVect.x, y: bazGrid.mouse.dragVect.y });
        });
    }

    this.x += this.dragVect.x;
    this.y += this.dragVect.y;
};

pinchyMouse.prototype.getNodesForCoordinates = function (hor, ver) {
    let gridCoordinates = bazGrid.convert.coordinate.fromWindowToBazGrid(hor, ver);
    this.closestNode = bazGrid.graph.getClosestNodeToCoordinates(gridCoordinates.hor, gridCoordinates.ver);
    if (this.isSlippy)
        this.touchedNodes.push(this.closestNode);
    else
        this.heldNodes.push(this.closestNode);
};

pinchyMouse.prototype.clearNodes = function () {
    this.closestNode = null;
    this.touchedNodes = [];
    this.heldNodes = [];
};

pinchyMouse.prototype.check = function (node) {
    // let distance = this.cursorDistanceTo(node);
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

pinchyMouse.prototype.cursorDistanceTo = function (node) {
    return Math.sqrt(Math.pow(node.clientX - this.x, 2) + Math.pow(node.clientY - this.y, 2));
};

pinchyMouse.prototype.clickDistanceTo = function (node) {
    return Math.sqrt(Math.pow(node.clientX - this.clickX, 2) + Math.pow(node.clientY - this.clickY, 2));
};

pinchyMouse.prototype.cut = function () {
    this.cutNodes.forEach(function (n) {
        n.removeLinks();
    });
};

Object.defineProperties(pinchyMouse.prototype, {
    isUp: { get: function () { return this.key === 0 } },
    isSlippy: { get: function () { return this.slipFactor !== 1 } },
    hasDragBox: { get: function () { return this.dragBox !== null } },
    isHoldingNodes: { get: function () { return this.heldNodes.length !== 0 } },
});
