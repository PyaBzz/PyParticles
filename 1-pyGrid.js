onload = function () {
	container = document.getElementById('container');
	container.createPyGrid(waterConfig);
};

HTMLDivElement.prototype.createPyGrid = function (config) {
	pyGrid = this;

	for (var key in config)
		this[key] = config[key];

	this.restingLinkLength = this.clientWidth / this.horizontalCellCount;
	this.verticalCellCount = Math.ceil(this.clientHeight / this.restingLinkLength);
	this.linkTearingLength = this.linkTearingLengthFactor * this.restingLinkLength;

	this.canvas = document.createElement('canvas');
	this.canvas.width = this.clientWidth;
	this.canvas.height = this.clientHeight;
	this.appendChild(this.canvas);
	this.canvasCtx = this.canvas.getContext('2d');
	this.referenceFrame = this.canvas.getBoundingClientRect();  // Required for comparison against node positions

	this.dragBoxes = [];
	for (var i = 0; i < pyGrid.dragBoxCount; i++) {
		var box = new dragBox(i);
		this.dragBoxes.push(box);
		this.appendChild(box.element);
	}

	this.mouse = new mouse(this.mouseImpactRadius * this.restingLinkLength, this.mouseCuttingRadius * this.restingLinkLength, this.mouseSlipFactor);
	this.graph = new graph();

	bindMouseHandlers();
	setInterval(drawingLoop, this.drawingTimeStep);
};

drawingLoop = function () {
	pyGrid.graph.calculateForces();
	// pyGrid.graph.updateNodeBounds();  // Has huge performance penalty!
	pyGrid.graph.updateNodePositions();
	pyGrid.canvasCtx.clearRect(0, 0, pyGrid.canvas.width, pyGrid.canvas.height);
	if (pyGrid.linkWidth) {
		pyGrid.canvasCtx.lineWidth = pyGrid.linkWidth;
		pyGrid.graph.drawLinks();
	}
	if (pyGrid.nodeRadius) pyGrid.graph.drawNodes();
};

rgbToHex = function (r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

componentToHex = function (c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
};

convertCoordinate = {
	fromWindowToPyGrid: function (horizontal, vertical) {
		return {
			hor: horizontal - pyGrid.referenceFrame.left,
			ver: vertical - pyGrid.referenceFrame.top
		};
	},
	fromPyGridToWindow: function (horizontal, vertical) {
		return {
			hor: horizontal + pyGrid.referenceFrame.left,
			ver: vertical + pyGrid.referenceFrame.top
		};
	},
}