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
                    mesh.points.forEach(function (p) {
                        if (p.isFree && p.distanceToClick < pyGrid.mouse.influenceDistance) {
                            p.heldByMouse = true;
                            p.positionAtClickX = p.x;
                            p.positionAtClickY = p.y;
                            pyGrid.mouse.heldpoints.push(p);
                        }
                    });
                }
            }
            if (pyGrid.mouse.key == 2) mesh.points.forEach(function (p) {
                if (p.distanceToClick < pyGrid.mouse.influenceDistance) p.pin();
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
        pyGrid.mouse.currentDragX = pyGrid.mouse.x - currentDragStartX;
        pyGrid.mouse.currentDragY = pyGrid.mouse.y - currentDragStartY;
        if (pyGrid.mouse.clickedABox) {
            mesh.points.forEach(function (p) {
                if (p.isFree && p.isInBox(pyGrid.mouse.targetBoxBoundaries.left, pyGrid.mouse.targetBoxBoundaries.right, pyGrid.mouse.targetBoxBoundaries.top, pyGrid.mouse.targetBoxBoundaries.buttom)) {
                    p.x += pyGrid.mouse.currentDragX * pyGrid.mouse.slipFactor;
                    p.y += pyGrid.mouse.currentDragY * pyGrid.mouse.slipFactor;
                    p.speed.x = 0;   // For points affected by mouse, there's no inertia nor previous speed!
                    p.speed.y = 0;
                    p.speed.z = 0;
                }
            });
            pyGrid.mouse.targetBox.style.left = pyGrid.mouse.targetBox.offsetLeft + pyGrid.mouse.currentDragX + "px";
            pyGrid.mouse.targetBox.style.top = pyGrid.mouse.targetBox.offsetTop + pyGrid.mouse.currentDragY + "px";
            pyGrid.mouse.targetBoxBoundaries.left = pyGrid.mouse.targetBox.offsetLeft;
            pyGrid.mouse.targetBoxBoundaries.right = pyGrid.mouse.targetBox.offsetLeft + pyGrid.mouse.targetBox.offsetWidth;
            pyGrid.mouse.targetBoxBoundaries.top = pyGrid.mouse.targetBox.offsetTop;
            pyGrid.mouse.targetBoxBoundaries.buttom = pyGrid.mouse.targetBox.offsetTop + pyGrid.mouse.targetBox.offsetHeight;
        } else {
            if (pyGrid.mouse.key == 1) {
                if (pyGrid.mouse.slippy) {
                    mesh.points.forEach(function (p) {
                        if (p.isFree && p.distanceToMouse < pyGrid.mouse.influenceDistance) {
                            p.x += pyGrid.mouse.currentDragX * pyGrid.mouse.slipFactor;
                            p.y += pyGrid.mouse.currentDragY * pyGrid.mouse.slipFactor;
                        }
                    });
                } else {
                    pyGrid.mouse.heldpoints.forEach(function (p) {
                        p.x += pyGrid.mouse.currentDragX;
                        p.y += pyGrid.mouse.currentDragY;
                        // this.previous_z = this.z;  // Currently the mouse doesn't affect z
                        p.speed.x = 0;   // For points affected by mouse, there's no inertia nor previous speed!
                        p.speed.y = 0;
                        p.speed.z = 0;
                    });
                }
            }
        }
        moveEvent.preventDefault();
    };

    pyGrid.onmouseup = function (releaseEvent) {
        pyGrid.mouse.heldpoints.forEach(function (p) { p.heldByMouse = false });
        pyGrid.mouse.dragX = releaseEvent.x - pyGrid.mouse.clickX;
        pyGrid.mouse.dragY = releaseEvent.y - pyGrid.mouse.clickY;
        pyGrid.mouse.key = 0;
        pyGrid.mouse.heldpoints = [];
        pyGrid.mouse.clickedABox = false;
        releaseEvent.preventDefault();
    };
}