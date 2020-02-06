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

	this.dragBoxes = [];
	for (var i = 0; i < pyGrid.dragBoxCount; i++) {
		var dragBox = document.createElement('div');
		dragBox.classList.add('dragbox');
		dragBox.textContent = 'Drag Me!';
		dragBox.style.top = 0;
		this.dragBoxes.push(dragBox);
		this.appendChild(dragBox);
	}

	this.mouse = new mouse(this.mouseImpactCellCount * this.restingLinkLength, this.mouseCuttingCellCount * this.restingLinkLength, true, 0.6);
	graph = new graph();

	bindMouseHandlers();
	setInterval(drawingLoop, this.drawingTimeStep);
};

drawingLoop = function () {
	graph.calculateForces();
	// graph.updateNodeBounds();  // Has huge performance penalty!
	graph.updateNodePositions();
	pyGrid.canvasCtx.clearRect(0, 0, pyGrid.canvas.width, pyGrid.canvas.height);
	if (pyGrid.linkWidth) {
		pyGrid.canvasCtx.lineWidth = pyGrid.linkWidth;
		graph.drawLinks();
	}
	if (pyGrid.nodeRadius) graph.drawNodes();
};

rgbToHex = function (r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

componentToHex = function (c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
};
