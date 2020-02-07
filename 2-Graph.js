graph = function () {

	this.nodes = [];

	for (var row = 0; row <= pyGrid.verticalCellCount; row++) {
		this.nodes[row] = [];
		for (var col = 0; col <= pyGrid.horizontalCellCount; col++) {
			var p = new node(col, row, 0);

			if (row == 0) p.pin();                   // Pin the top edge of the graph
			if (row == pyGrid.verticalCellCount) p.pin();  // Pin the bottom edge of the graph

			if (col == 0) p.pin();                   // Pin the left edge of the graph
			if (col == pyGrid.horizontalCellCount) p.pin();   // Pin the right edge of the graph

			if (col != 0) p.attach(this.nodes[row][col - 1]);  // Horizontal link to the left neighbour
			if (row != 0) p.attach(this.nodes[row - 1][col]);  // Vertical link to the right neighbour

			this.nodes[row].push(p);
		}
	}
};

graph.prototype.calculateForces = function () {
	this.doToAllNodes(function (n) {
		n.links.forEach(function (link) {
			link.applyForces();
		});
	});
};

graph.prototype.updateNodeBounds = function () {
	this.doToAllNodes(function (p) {
		Array.prototype.forEach.call(pyGrid.dragBoxes, function (b) {
			if (p.isInBox(b.offsetLeft, b.offsetLeft + b.offsetWidth, b.offsetTop, b.offsetTop + b.offsetHeight)) {
				p.heldByBox = 1;
				p.containingBox = b;
			} else {
				p.heldByBox = 0;
				p.containingBox = null;
			}
		});
	});
};

graph.prototype.updateNodePositions = function () {
	this.doToAllNodes(function (p) {
		if (p.isFree) p.updatePosition();
	});
};

graph.prototype.drawNodes = function () {
	this.doToAllNodes(function (p) { p.draw() });
};

graph.prototype.drawLinks = function () {
	pyGrid.canvasCtx.strokeStyle = pyGrid.linkColour;
	pyGrid.canvasCtx.beginPath();
	this.doToAllNodes(function (p) { p.drawLinks() });
	pyGrid.canvasCtx.stroke();
};

graph.prototype.doToAllNodes = function (func) {
	for (var row = 0; row < this.nodes.length; row++) {
		for (var col = 0; col < this.nodes[0].length; col++) {
			func(this.nodes[row][col]);
		};
	}
};

graph.prototype.getNodesWhere = function (func) {
	var compliantNodes = [];
	for (var row = 0; row < this.nodes.length; row++) {
		for (var col = 0; col < this.nodes[0].length; col++) {
			n = this.nodes[row][col];
			if (func(n) != false)
				compliantNodes.push(n);
		}
	}
	return compliantNodes;
};

