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
        me.heldNodes.forEach(function (p) { p.heldByMouse = false }); //TODO: Move to pinchyMouse.clearNodes()
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
