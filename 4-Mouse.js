mouse = function (impactDistance, cutDistance, slpy, slp_ftr) {
    this.influenceDistance = impactDistance;
    this.cuttingDistance = cutDistance;
    this.slippy = slpy;
    this.slipFactor = slp_ftr;
    this.x = 0;
    this.y = 0;
    this.currentDrag = { x: 0, y: 0 };
    this.clickX = 0;
    this.clickY = 0;
    this.dragX = 0;
    this.dragY = 0;
    this.key = 0;
    this.heldnodes = [];
    this.referenceFrame = pyGrid.canvas.getBoundingClientRect();  // Required for comparison against node positions
    this.clickedABox = false;
    this.targetBox = {};
    this.targetBoxBoundaries = { left: 0, right: 0, top: 0, buttom: 0 };
};

mouse.prototype.touches = function (node) {
    return this.cursorDistanceTo(node) <= this.influenceDistance;
};

mouse.prototype.grabs = function (node) {
    return this.clickDistanceTo(node) <= this.influenceDistance;
};

mouse.prototype.cuts = function (node) {
    return this.cursorDistanceTo(node) <= this.cuttingDistance;
};

mouse.prototype.cursorDistanceTo = function (node) {
    return Math.sqrt(Math.pow(node.clientX - this.x, 2) + Math.pow(node.clientY - this.y, 2));
};

mouse.prototype.clickDistanceTo = function (node) {
    return Math.sqrt(Math.pow(node.clientX - this.clickX, 2) + Math.pow(node.clientY - this.clickY, 2));
};

Object.defineProperties(mouse.prototype, {
    isUp: { get: function () { return this.key === 0 } },
});

bindMouseHandlers = function () {

    pyGrid.canvas.oncontextmenu = function (contextEvent) {
        contextEvent.preventDefault();
    };

    pyGrid.onmousedown = function (mouseDownEvent) {
        pyGrid.mouse.key = mouseDownEvent.which;
        pyGrid.mouse.clickX = mouseDownEvent.x;
        pyGrid.mouse.clickY = mouseDownEvent.y;
        if (mouseDownEvent.target == pyGrid.canvas) {
            if (pyGrid.mouse.key == 1) {
                if (pyGrid.mouse.slippy) {

                } else {
                    mesh.nodes.forEach(function (p) {
                        if (p.isFree && pyGrid.mouse.grabs(p)) {
                            p.heldByMouse = true;
                            p.positionAtClickX = p.x;
                            p.positionAtClickY = p.y;
                            pyGrid.mouse.heldnodes.push(p);
                        }
                    });
                }
            }
            if (pyGrid.mouse.key == 2) mesh.nodes.forEach(function (p) {
                if (pyGrid.mouse.grabs(p)) p.pin();
            });
        } else if (mouseDownEvent.target.className == 'dragbox') {
            pyGrid.mouse.clickedABox = true;
            pyGrid.mouse.targetBox = mouseDownEvent.target;
            pyGrid.mouse.targetBoxBoundaries.left = pyGrid.mouse.targetBox.offsetLeft;
            pyGrid.mouse.targetBoxBoundaries.right = pyGrid.mouse.targetBox.offsetLeft + pyGrid.mouse.targetBox.offsetWidth;
            pyGrid.mouse.targetBoxBoundaries.top = pyGrid.mouse.targetBox.offsetTop;
            pyGrid.mouse.targetBoxBoundaries.buttom = pyGrid.mouse.targetBox.offsetTop + pyGrid.mouse.targetBox.offsetHeight;
        }
        mouseDownEvent.preventDefault();
    };

    pyGrid.onmousemove = function (moveEvent) {
        var currentDragStartX = pyGrid.mouse.x;
        var currentDragStartY = pyGrid.mouse.y;
        pyGrid.mouse.x = moveEvent.pageX;
        pyGrid.mouse.y = moveEvent.pageY;
        pyGrid.mouse.currentDrag.x = pyGrid.mouse.x - currentDragStartX;
        pyGrid.mouse.currentDrag.y = pyGrid.mouse.y - currentDragStartY;
        if (pyGrid.mouse.clickedABox) {
            mesh.nodes.forEach(function (p) {
                if (p.isFree && p.isInBox(pyGrid.mouse.targetBoxBoundaries.left, pyGrid.mouse.targetBoxBoundaries.right, pyGrid.mouse.targetBoxBoundaries.top, pyGrid.mouse.targetBoxBoundaries.buttom)) {
                    p.x += pyGrid.mouse.currentDrag.x * pyGrid.mouse.slipFactor;
                    p.y += pyGrid.mouse.currentDrag.y * pyGrid.mouse.slipFactor;
                    p.speed = { x: 0, y: 0, z: 0 };   // For nodes affected by mouse, there's no inertia nor previous speed!
                }
            });
            pyGrid.mouse.targetBox.style.left = pyGrid.mouse.targetBox.offsetLeft + pyGrid.mouse.currentDrag.x + "px";
            pyGrid.mouse.targetBox.style.top = pyGrid.mouse.targetBox.offsetTop + pyGrid.mouse.currentDrag.y + "px";
            pyGrid.mouse.targetBoxBoundaries.left = pyGrid.mouse.targetBox.offsetLeft;
            pyGrid.mouse.targetBoxBoundaries.right = pyGrid.mouse.targetBox.offsetLeft + pyGrid.mouse.targetBox.offsetWidth;
            pyGrid.mouse.targetBoxBoundaries.top = pyGrid.mouse.targetBox.offsetTop;
            pyGrid.mouse.targetBoxBoundaries.buttom = pyGrid.mouse.targetBox.offsetTop + pyGrid.mouse.targetBox.offsetHeight;
        } else {
            if (pyGrid.mouse.key == 1) {
                if (pyGrid.mouse.slippy) {
                    mesh.nodes.forEach(function (p) {
                        if (p.isFree && pyGrid.mouse.touches(p)) {
                            p.x += pyGrid.mouse.currentDrag.x * pyGrid.mouse.slipFactor;
                            p.y += pyGrid.mouse.currentDrag.y * pyGrid.mouse.slipFactor;
                        }
                    });
                } else {
                    pyGrid.mouse.heldnodes.forEach(function (p) {
                        p.x += pyGrid.mouse.currentDrag.x;
                        p.y += pyGrid.mouse.currentDrag.y;
                        // this.previous_z = this.z;  // Currently the mouse doesn't affect z
                        p.speed.x = { x: 0, y: 0, z: 0 };   // For nodes affected by mouse, there's no inertia nor previous speed!
                    });
                }
            }
        }
        moveEvent.preventDefault();
    };

    pyGrid.onmouseup = function (releaseEvent) {
        pyGrid.mouse.heldnodes.forEach(function (p) { p.heldByMouse = false });
        pyGrid.mouse.dragX = releaseEvent.x - pyGrid.mouse.clickX;
        pyGrid.mouse.dragY = releaseEvent.y - pyGrid.mouse.clickY;
        pyGrid.mouse.key = 0;
        pyGrid.mouse.heldnodes = [];
        pyGrid.mouse.clickedABox = false;
        releaseEvent.preventDefault();
    };
}
