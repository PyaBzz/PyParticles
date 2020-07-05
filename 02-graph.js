graph = function (bazgrid) {
	this.grid = bazgrid;
	this.nodes = [];

	for (let row = 0; row <= this.grid.verticalCellCount; row++) {
		this.nodes[row] = [];
		for (let col = 0; col <= this.grid.horizontalCellCount; col++) {
			let p = new node(col, row, 0, this.grid);

			// Link up-neighbour
			if (row != 0) {
				p.upNeighbour = this.nodes[row - 1][col];
				p.attach(p.upNeighbour);
				p.upNeighbour.downNeighbour = p;
			}

			// Link left-neighbour
			if (col != 0) {
				p.leftNeighbour = this.nodes[row][col - 1];
				p.attach(p.leftNeighbour);
				p.leftNeighbour.rightNeighbour = p;
			}

			// Link up-left-neighbour
			if (row != 0 && col != 0) {
				p.upLeftNeighbour = this.nodes[row - 1][col - 1];
				if (this.grid.drawDiagonalLinks)
					p.attach(p.upLeftNeighbour);
				p.upLeftNeighbour.downRightNeighbour = p;
			}

			// Link up-right-neighbour
			if (row != 0 && col != this.grid.horizontalCellCount) {
				p.upRightNeighbour = this.nodes[row - 1][col + 1];
				if (this.grid.drawDiagonalLinks)
					p.attach(p.upRightNeighbour);
				p.upRightNeighbour.downLeftNeighbour = p;
			}

			this.grid.frameDefiningStatements.forEach(function (statement) {
				if (eval(statement)) {
					p.frame();
				}
			}, this);

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

graph.prototype.updateNodePositions = function () {
	this.doToAllNodes(function (p) {
		p.updatePosition();
	});
};

graph.prototype.drawNodes = function () {
	this.doToAllNodes(function (p) { p.draw() });
};

graph.prototype.drawLinks = function () {
	this.grid.canvasCtx.strokeStyle = this.grid.linkColour;
	this.grid.canvasCtx.beginPath();
	this.doToAllNodes(function (p) { p.drawLinks() });
	this.grid.canvasCtx.stroke();
};

graph.prototype.doToAllNodes = function (func) {
	for (let row = 0; row < this.nodes.length; row++) {
		for (let col = 0; col < this.nodes[0].length; col++) {
			func(this.nodes[row][col]);
		};
	}
};

graph.prototype.getClosestNodeToCoordinates = function (hor, ver, nodeVisitFunc = null) {
	// let runnerNode = this.nodes[0][0];
	let runnerNode = this.estimateNodeByCoordinates(hor, ver);
	let bestNeighbour = runnerNode;
	let runnerNodeDistance = Infinity;
	let bestNeighbourDistance = Number.MAX_VALUE;
	while (bestNeighbourDistance < runnerNodeDistance) {
		if (nodeVisitFunc)
			nodeVisitFunc(runnerNode);
		runnerNode = bestNeighbour;
		runnerNodeDistance = runnerNode.getDistanceToCoordinates(hor, ver);
		runnerNode.neighbours.forEach(function (neighbour) {
			if (neighbour != null) {
				let neighbourDistance = neighbour.getDistanceToCoordinates(hor, ver);
				if (neighbourDistance < bestNeighbourDistance) {
					bestNeighbour = neighbour;
					bestNeighbourDistance = neighbourDistance;
				}
			}
		});
	}
	return runnerNode;
};

graph.prototype.getNodesWhere = function (predicate, rootNode, nodeVisitFunc = null) {
	let resultArray = [];
	if (rootNode == null) { // Todo: Do we need this?
		for (let row = 0; row < this.nodes.length; row++) {
			for (let col = 0; col < this.nodes[0].length; col++) {
				n = this.nodes[row][col];
				if (predicate(n) != false)
					resultArray.push(n);
			}
		}
	} else {
		resultArray.push(rootNode);
		rootNode.visited = true;
		if (nodeVisitFunc)
			nodeVisitFunc(rootNode);
		rootNode.neighbours.forEach(function (n) {
			if (n.visited === false && predicate(n) != false) {
				this.getNodesWhereRecurse(predicate, n, resultArray, nodeVisitFunc);
			}
		}, this);

		resultArray.forEach(function (n) {
			n.visited = false;
		});
	}
	return resultArray;
};

graph.prototype.getNodesWhereRecurse = function (predicate, node, resultArray, nodeVisitFunc = null) {
	resultArray.push(node);
	node.visited = true;
	if (nodeVisitFunc)
		nodeVisitFunc(node);
	node.neighbours.forEach(function (n) {
		if (n.visited === false && predicate(n) != false) {
			this.getNodesWhereRecurse(predicate, n, resultArray, nodeVisitFunc);
		}
	}, this);
};

graph.prototype.estimateNodeByCoordinates = function (hor, ver) {
	let col = Math.round(hor / this.grid.restingLinkLength);
	col = Math.min(col, this.maxColIndex);
	col = Math.max(col, 0);
	let row = Math.round(ver / this.grid.restingLinkLength);
	row = Math.min(row, this.maxRowIndex);
	row = Math.max(row, 0);
	return this.nodes[row][col]; //Todo: Is the order right?
};

Object.defineProperties(graph.prototype, {
	maxRowIndex: { get: function () { return this.nodes.length - 1 } },
	maxColIndex: { get: function () { return this.nodes[0].length - 1 } },
});
