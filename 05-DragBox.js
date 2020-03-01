dragBox = function (i) {
    this.top = 0;
    this.bottom = 0;
    this.left = 0;
    this.right = 0;
    this.element = document.createElement('div');
    this.element.classList.add('dragbox');
    this.element.setAttribute("dragbox-index", i);
    this.element.textContent = 'Drag Me!';
    this.element.style.top = 0;
};

dragBox.prototype.move = function (dragX, dragY) {
    let centreNode = this.getCentreNode();
    let touchedNodes = this.getTouchedNodes(centreNode, [], false);
    this.dragNodes(touchedNodes, { x: dragX, y: dragY });

    this.element.style.left = this.element.offsetLeft + dragX + "px";
    this.element.style.top = this.element.offsetTop + dragY + "px";

    touchedNodes.forEach(function (n) {
        n.visited = false;
    });

    this.updateBoundaries();  // Caching for performance reasons!
};

dragBox.prototype.dragNodes = function (nodes, dragVect) {
    nodes.forEach(function (n) {
        n.move({ x: dragVect.x * pyGrid.mouse.slipFactor, y: dragVect.y * pyGrid.mouse.slipFactor })
    }, this);
};

dragBox.prototype.getCentreNode = function () {
    return pyGrid.graph.getClosestNodeToCoordinates(this.centreHor, this.centreVer, false);
};

dragBox.prototype.getTouchedNodes = function (rootNode, nodesSoFar, markPath = false) {
    nodesSoFar.push(rootNode);
    rootNode.visited = true;
    if (markPath)
        rootNode.mark();
    rootNode.neighbours.forEach(function (n) {
        if (n.visited === false && this.coversNode(n)) {
            this.getTouchedNodes(n, nodesSoFar, markPath);
        }
    }, this);
    return nodesSoFar;
};

dragBox.prototype.coversNode = function (n) {
    return n.x > this.left && n.x < this.right && n.y < this.bottom && n.y > this.top;
};

// Caching for performance reasons!
// Reading coordinates from DOM objects every time is very slow
dragBox.prototype.updateBoundaries = function () {
    this.left = this.element.offsetLeft;
    this.right = this.left + this.element.offsetWidth;
    this.top = this.element.offsetTop;
    this.bottom = this.top + this.element.offsetHeight;
    this.centreHor = (this.left + this.right) / 2;
    this.centreVer = (this.top + this.bottom) / 2;
};
