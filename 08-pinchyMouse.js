pinchyMouse = function (impactRadius, cuttingRadius, slipFactor, bazgrid) {
    console.error("Not implemented yet");
};

pinchyMouse.prototype = new mouse();
pinchyMouse.prototype.constructor = pinchyMouse;

pinchyMouse.prototype.onDown = function (mouseDownEvent) {
    this.key = mouseDownEvent.which;
    this.clickHor = mouseDownEvent.x;
    this.clickVer = mouseDownEvent.y;
    this.getNodesForCoordinates(this.clickHor, this.clickVer);
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
        this.getNodesForCoordinates(this.hor, this.ver);
        this.touchedNodes.forEach(function (n) {
            n.move({ hor: bazGrid.mouse.dragVect.hor * bazGrid.mouse.slipFactor, ver: bazGrid.mouse.dragVect.ver * bazGrid.mouse.slipFactor })
        });
        this.clearNodes();
    } else {

        this.heldNodes.forEach(function (n) {
            n.move({ hor: bazGrid.mouse.dragVect.hor, ver: bazGrid.mouse.dragVect.ver });
        });
    }

    this.hor += this.dragVect.hor;
    this.ver += this.dragVect.ver;
};

pinchyMouse.prototype.getNodesForCoordinates = function (hor, ver) {
    let gridCoordinates = bazGrid.convertCoordinate(hor, ver, 0, 'dasoo');
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
    node.getDistanceToCoordinates(this.hor, this.ver);
}

pinchyMouse.prototype.clickDistanceTo = function (node) {
    node.getDistanceToCoordinates(this.clickHor, this.clickVer);
}

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
