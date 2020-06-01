onload = function () {
	container = document.getElementById('container');
	container.createBazGrid(waterConfig);
};

HTMLDivElement.prototype.createBazGrid = function (config) {
	bazGrid = this;

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

	if (this.mouseSlipFactor === 1)
		this.mouse = new pinchyMouse(this.mouseImpactRadius * this.restingLinkLength, this.mouseCuttingRadius * this.restingLinkLength, this.mouseSlipFactor);
	else
		this.mouse = new slippyMouse(this.mouseImpactRadius * this.restingLinkLength, this.mouseCuttingRadius * this.restingLinkLength, this.mouseSlipFactor);

	this.graph = new graph();

	this.dragBoxes = [];
	for (var i = 0; i < bazGrid.dragBoxCount; i++) {
		var box = new dragBox(i);
		this.dragBoxes.push(box);
		this.appendChild(box.element);
		box.updateBoundaries();
	}

	this.mouse.bindHandlers();

	this.convert = {
		colour: {
			rgbToHex: function (r, g, b) {
				return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
			},
			componentToHex: function (c) {
				var hex = c.toString(16);
				return hex.length == 1 ? "0" + hex : hex;
			},
		},
		coordinate: {
			fromWindowToBazGrid: function (horizontal, vertical) {
				return {
					hor: horizontal - bazGrid.referenceFrame.left,
					ver: vertical - bazGrid.referenceFrame.top
				};
			},
			fromBazGridToWindow: function (horizontal, vertical) {
				return {
					hor: horizontal + bazGrid.referenceFrame.left,
					ver: vertical + bazGrid.referenceFrame.top
				};
			},
		},
	}

	this.drawingLoop = function () {
		bazGrid.graph.updateBoxedNodes();
		bazGrid.graph.calculateForces();
		bazGrid.graph.updateNodePositions();
		bazGrid.canvasCtx.clearRect(0, 0, bazGrid.canvas.width, bazGrid.canvas.height);
		if (bazGrid.linkWidth) {
			bazGrid.canvasCtx.lineWidth = bazGrid.linkWidth;
			bazGrid.graph.drawLinks();
		}
		bazGrid.graph.drawNodes();
	}

	setInterval(this.drawingLoop, this.drawingTimeStep);
};