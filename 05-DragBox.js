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
    this.touchedNodes = [];
};

dragBox.prototype.move = function (dragX, dragY, markPath = false) {
    this.updateTouchedNodes(markPath);
    this.dragNodes({ x: dragX, y: dragY });

    this.element.style.left = this.element.offsetLeft + dragX + "px";
    this.element.style.top = this.element.offsetTop + dragY + "px";

    this.updateBoundaries();  // Caching for performance reasons!
};

dragBox.prototype.dragNodes = function (dragVect) {
    this.touchedNodes.forEach(function (n) {
        n.move({ x: dragVect.x * pyGrid.mouse.slipFactor, y: dragVect.y * pyGrid.mouse.slipFactor })
    }, this);
};

dragBox.prototype.getCentreNode = function () {
    return pyGrid.graph.getClosestNodeToCoordinates(this.centreHor, this.centreVer, false);
};

dragBox.prototype.updateTouchedNodes = function (markPath = false) {
    this.clearTouchedNodes();
    let centreNode = this.getCentreNode();
    this.touchedNodes = pyGrid.graph.getNodesWhere(n => this.coversNode(n), centreNode, markPath);
    this.touchedNodes.forEach(n => n.heldByBox = true);
    return this.touchedNodes;
};

dragBox.prototype.clearTouchedNodes = function () {
    this.touchedNodes.forEach(function (n) { n.heldByBox = false; });
    this.touchedNodes = [];
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
