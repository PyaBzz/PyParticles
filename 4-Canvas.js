bindMouseHandlers = function () {

    pyGrid.canvas.oncontextmenu = function (contextEvent) {
        contextEvent.preventDefault();
    };

    pyGrid.onmousedown = function (mouseDownEvent) {
        mouse.key = mouseDownEvent.which;
        mouse.clickX = mouseDownEvent.x;
        mouse.clickY = mouseDownEvent.y;
        if (mouseDownEvent.target == pyGrid.canvas) {
            if (mouse.key == 1) {
                if (mouse.slippy) {

                } else {
                    mesh.points.forEach(function (p) {
                        if (p.isFree && p.distanceToClick < mouse.influenceDistance) {
                            p.heldByMouse = true;
                            p.positionAtClickX = p.x;
                            p.positionAtClickY = p.y;
                            mouse.heldpoints.push(p);
                        }
                    });
                }
            }
            if (mouse.key == 2) mesh.points.forEach(function (p) {
                if (p.distanceToClick < mouse.influenceDistance) p.pin();
            });
        } else if (mouseDownEvent.target.className == 'dragbox') {
            mouse.clickedABox = true;
            mouse.targetBox = mouseDownEvent.target;
            mouse.targetBoxBoundaries.left = mouse.targetBox.offsetLeft;
            mouse.targetBoxBoundaries.right = mouse.targetBox.offsetLeft + mouse.targetBox.offsetWidth;
            mouse.targetBoxBoundaries.top = mouse.targetBox.offsetTop;
            mouse.targetBoxBoundaries.buttom = mouse.targetBox.offsetTop + mouse.targetBox.offsetHeight;
        }
        mouseDownEvent.preventDefault();
    };

    pyGrid.onmousemove = function (moveEvent) {
        var currentDragStartX = mouse.x;
        var currentDragStartY = mouse.y;
        mouse.x = moveEvent.pageX;
        mouse.y = moveEvent.pageY;
        mouse.currentDragX = mouse.x - currentDragStartX;
        mouse.currentDragY = mouse.y - currentDragStartY;
        if (mouse.clickedABox) {
            mesh.points.forEach(function (p) {
                if (p.isFree && p.isInBox(mouse.targetBoxBoundaries.left, mouse.targetBoxBoundaries.right, mouse.targetBoxBoundaries.top, mouse.targetBoxBoundaries.buttom)) {
                    p.x += mouse.currentDragX * mouse.slipFactor;
                    p.y += mouse.currentDragY * mouse.slipFactor;
                    p.speed_x = 0;   // For points affected by mouse, there's no inertia nor previous speed!
                    p.speed_y = 0;
                    p.speed_z = 0;
                }
            });
            mouse.targetBox.style.left = mouse.targetBox.offsetLeft + mouse.currentDragX + "px";
            mouse.targetBox.style.top = mouse.targetBox.offsetTop + mouse.currentDragY + "px";
            mouse.targetBoxBoundaries.left = mouse.targetBox.offsetLeft;
            mouse.targetBoxBoundaries.right = mouse.targetBox.offsetLeft + mouse.targetBox.offsetWidth;
            mouse.targetBoxBoundaries.top = mouse.targetBox.offsetTop;
            mouse.targetBoxBoundaries.buttom = mouse.targetBox.offsetTop + mouse.targetBox.offsetHeight;
        } else {
            if (mouse.key == 1) {
                if (mouse.slippy) {
                    mesh.points.forEach(function (p) {
                        if (p.isFree && p.distanceToMouse < mouse.influenceDistance) {
                            p.x += mouse.currentDragX * mouse.slipFactor;
                            p.y += mouse.currentDragY * mouse.slipFactor;
                        }
                    });
                } else {
                    mouse.heldpoints.forEach(function (p) {
                        p.x += mouse.currentDragX;
                        p.y += mouse.currentDragY;
                        // this.previous_z = this.z;  // Currently the mouse doesn't affect z
                        p.speed_x = 0;   // For points affected by mouse, there's no inertia nor previous speed!
                        p.speed_y = 0;
                        p.speed_z = 0;
                    });
                }
            }
        }
        moveEvent.preventDefault();
    };

    pyGrid.onmouseup = function (releaseEvent) {
        mouse.heldpoints.forEach(function (p) { p.heldByMouse = false });
        mouse.dragX = releaseEvent.x - mouse.clickX;
        mouse.dragY = releaseEvent.y - mouse.clickY;
        mouse.key = 0;
        mouse.heldpoints = [];
        mouse.clickedABox = false;
        releaseEvent.preventDefault();
    };
}