onload = function () {
	let container = document.getElementById('container');
	let bazgrid = new BazGrid(container, waterConfig);
};

BazGrid = function (container, config) {
	this.container = container;
	for (let key in config)
		this[key] = config[key];

	this.restingLinkLength = this.container.clientWidth / this.horizontalCellCount;  // Todo: Refactor to cellCount.hor and cellCount.ver
	this.verticalCellCount = Math.ceil(this.container.clientHeight / this.restingLinkLength);
	this.linkTearingLength = this.linkTearingLengthFactor * this.restingLinkLength;

	this.canvas = document.createElement('canvas');
	this.canvas.width = this.container.clientWidth;
	this.canvas.height = this.container.clientHeight;
	this.container.appendChild(this.canvas);
	this.canvasCtx = this.canvas.getContext('2d');
	this.referenceFrame = this.canvas.getBoundingClientRect();  // Required for comparison against node positions

	if (this.mouseSlipFactor === 1)
		this.mouse = new pinchyMouse(this.mouseImpactRadius * this.restingLinkLength, this.mouseCuttingRadius * this.restingLinkLength, this.mouseSlipFactor, this);
	else
		this.mouse = new slippyMouse(this.mouseImpactRadius * this.restingLinkLength, this.mouseCuttingRadius * this.restingLinkLength, this.mouseSlipFactor, this);

	this.graph = new graph(this);

	this.dragBoxes = [];
	for (let i = 0; i < this.dragBoxCount; i++) {
		let box = new dragBox(i, this);
		this.dragBoxes.push(box);
		this.container.appendChild(box.element);
		box.updateBoundaries();
	}

	this.mouse.bindHandlers(this);
	this.run();
};

BazGrid.prototype.run = function () {
	this.drawingLoop = setInterval(() => {
		this.updateBoxedNodes();
		this.graph.calculateForces();
		this.graph.updateNodePositions();
		this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		if (this.linkWidth) {
			this.canvasCtx.lineWidth = this.linkWidth;
			this.graph.drawLinks();
		}
		this.graph.drawNodes();
	}, this.drawingCycleTime);
}

BazGrid.prototype.convertCoordinate = function (horizontal, vertical, direction = 0) {
	if (direction)    // fromWindowToBazGrid
		return {
			hor: horizontal - this.referenceFrame.left,
			ver: vertical - this.referenceFrame.top
		};
	else    // fromBazGridToWindow
		return {
			hor: horizontal + this.referenceFrame.left,
			ver: vertical + this.referenceFrame.top
		};
}

BazGrid.prototype.updateBoxedNodes = function () {
	this.dragBoxes.forEach(function (d) {
		d.updateTouchedNodes();
	});
};
