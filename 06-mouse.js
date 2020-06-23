mouse = function (impactRadius, cuttingRadius, slipFactor, bazgrid) {
    this.grid = bazgrid;
    this.isOnGrid = true;
    this.impactRadius = impactRadius;
    this.cuttingRadius = cuttingRadius;
    this.slipFactor = slipFactor;
    this.clickHor = 0;
    this.clickVer = 0;
    this.hor = null;
    this.ver = null;
    this.key = 0;
    this.closestNode = null;
    this.closestNodeDistance = Number.MAX_VALUE;
    this.cutNodes = [];
    this.touchedNodes = [];
    this.heldNodes = [];
    this.dragBox = null;
    this.actionsEnum = Object.freeze({ "cut": 0, "mark": 1 })
    this.buttonsEnum = Object.freeze({ "none": 0, "left": 1, "middle": 2, "right": 3 })
};

mouse.prototype.onDown = function (mouseDownEvent) {
    this.key = mouseDownEvent.which;
    this.hor = mouseDownEvent.offsetX;
    this.ver = mouseDownEvent.offsetY;
    if (mouseDownEvent.target == this.grid.canvas) {
        this.getNodesForCoordinates(this.hor, this.ver, nodeVisitFunc = null);
        switch (this.key) {
            case this.buttonsEnum.left:
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
    }
    else if (mouseDownEvent.target.className == 'dragbox') {
        let dragBoxIndex = mouseDownEvent.target.getAttribute("dragbox-index");
        this.dragBox = this.grid.dragBoxes[dragBoxIndex];
        this.dragBox.updateBoundaries();
    }
};

mouse.prototype.onMove = function (moveEvent) {
    this.hor = moveEvent.offsetX + moveEvent.movementX;
    this.ver = moveEvent.offsetY + moveEvent.movementY;
    if (this.isUp)
        return;

    if (this.hasDragBox)
        this.moveBox(moveEvent);
};

mouse.prototype.moveBox = function (moveEvent) {
    switch (this.key) {
        case this.buttonsEnum.left:
            this.dragBox.move(moveEvent.movementX, moveEvent.movementY, nodeVisitFunc = null);
            break;
        case this.buttonsEnum.middle:
            break;
        case this.buttonsEnum.right:
            this.dragBox.move(moveEvent.movementX, moveEvent.movementY, nodeVisitFunc = null);
            break;
        default:
            break;
    }
}

mouse.prototype.getNodesForCoordinates = function (hor, ver, nodeVisitFunc = null) {
    this.clearNodes();
    this.closestNode = this.grid.graph.getClosestNodeToCoordinates(hor, ver, nodeVisitFunc);
    this.touchedNodes = this.grid.graph.getNodesWhere(n => n.getDistanceToCoordinates(hor, ver) <= this.impactRadius, this.closestNode);
};

mouse.prototype.clearNodes = function () {
    this.touchedNodes.forEach(function (n) { n.visited = false });
    this.touchedNodes = [];
    this.closestNode = null;
};

mouse.prototype.cut = function () {
    this.touchedNodes.forEach(function (n) {
        n.removeLinks();
    });
};

mouse.prototype.bindHandlers = function () {
    let me = this;

    this.grid.canvas.oncontextmenu = function (contextEvent) {
        contextEvent.preventDefault();
    };

    this.grid.dragBoxes.forEach(function (d) {
        d.element.oncontextmenu = function (contextEvent) {
            contextEvent.preventDefault();
        };
    });

    this.grid.container.onmousedown = function (mouseDownEvent) {
        mouseDownEvent.preventDefault();
        me.onDown(mouseDownEvent);
    };

    this.grid.container.onmousemove = function (moveEvent) {
        moveEvent.preventDefault();
        me.onMove(moveEvent);
    };

    this.grid.container.onmouseup = function (releaseEvent) {
        releaseEvent.preventDefault();
        me.key = 0;
        me.clearNodes();
        me.dragBox = null;
    };

    this.grid.container.onmouseenter = function (enterEvent) {
        me.isOnGrid = true;
    }

    this.grid.container.onmouseleave = function (leaveEvent) {
        me.isOnGrid = false;
    }
}
