dragBox = function (i, bazgrid) {
    this.grid = bazgrid;
    this.top = 0;
    this.bottom = 0;
    this.left = 0;
    this.right = 0;
    this.element = document.createElement('div');
    this.element.classList.add('dragbox');
    this.element.setAttribute("dragbox-index", i);
    this.element.textContent = 'Drag Me!';
    this.element.style.top = 0;
    this.touchedNodes = [];
};

dragBox.prototype.move = function (dragHor, dragVer, moveNodes = false, nodeVisitFunc = null) {
    this.updateTouchedNodes(nodeVisitFunc);
    if (moveNodes)
        this.dragNodes({ hor: dragHor, ver: dragVer });

    this.element.style.left = this.element.offsetLeft + dragHor + "px";
    this.element.style.top = this.element.offsetTop + dragVer + "px";

    this.updateBoundaries();  // Caching for performance reasons!
};

dragBox.prototype.dragNodes = function (dragVect) {
    this.touchedNodes.forEach(function (n) {
        n.move({ hor: dragVect.hor * this.grid.mouse.slipFactor, ver: dragVect.ver * this.grid.mouse.slipFactor })
    }, this);
};

dragBox.prototype.getCentreNode = function () {
    return this.grid.graph.getClosestNodeToCoordinates(this.centreHor, this.centreVer, false);
};

dragBox.prototype.updateTouchedNodes = function (nodeVisitFunc = null) {
    this.clearTouchedNodes();
    let centreNode = this.getCentreNode();
    this.touchedNodes = this.grid.graph.getNodesWhere(n => this.coversNode(n), centreNode, nodeVisitFunc);
    this.touchedNodes.forEach(n => n.heldByBox = true);
    return this.touchedNodes;
};

dragBox.prototype.clearTouchedNodes = function () {
    this.touchedNodes.forEach(function (n) { n.heldByBox = false; });
    this.touchedNodes = [];
};

dragBox.prototype.coversNode = function (n) {
    return n.hor > this.left && n.hor < this.right && n.ver < this.bottom && n.ver > this.top;
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
