onload = function () {
	container = document.getElementById('container');
	dragBoxes = document.getElementsByClassName('dragbox');
	container.createPyGrid(waterConfig, dragBoxes);
};

HTMLDivElement.prototype.createPyGrid = function (config, dragBoxes) {
	pyGrid = this;

	for (var key in config)
		this[key] = config[key];

	this.restingLinkLength = this.clientWidth / this.horizontalCellCount;
	this.verticalCellCount = Math.ceil(this.clientHeight / this.restingLinkLength);
	this.linkTearingLength = this.linkTearingLengthFactor * this.restingLinkLength;
	this.dragBoxes = dragBoxes;

	this.canvas = document.createElement('canvas');
	this.canvas.width = this.clientWidth;
	this.canvas.height = this.clientHeight;
	this.appendChild(this.canvas);
	this.canvasCtx = this.canvas.getContext('2d');

	mouse = new mouse(this.mouseImpactCellCount * this.restingLinkLength, this.mouseCuttingCellCount * this.restingLinkLength, true, 0.6);
	mesh = new mesh();

	bindMouseHandlers();
	setInterval(drawingLoop, this.drawingTimeStep);
};

drawingLoop = function () {
	mesh.calculateForces();
	mesh.updateNodeBounds();
	mesh.updateNodePositions();
	pyGrid.canvasCtx.clearRect(0, 0, pyGrid.canvas.width, pyGrid.canvas.height);
	pyGrid.canvasCtx.lineWidth = pyGrid.linkWidth;
	mesh.drawLinks();
	if (pyGrid.drawNodes) mesh.drawpoints();
};

rgbToHex = function (r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

componentToHex = function (c) {
	// if(c == 0) return "00";
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
};

mouse = function (impactDistance, cutDistance, slpy, slp_ftr) {
	this.influenceDistance = impactDistance;
	this.cuttingDistance = cutDistance;
	this.slippy = slpy;
	this.slipFactor = slp_ftr;
	this.x = 0;
	this.y = 0;
	this.currentDragX = 0;
	this.currentDragY = 0;
	this.clickX = 0;
	this.clickY = 0;
	this.dragX = 0;
	this.dragY = 0;
	this.key = 0;
	this.heldpoints = [];
	this.referenceFrame = pyGrid.canvas.getBoundingClientRect();  // Required for comparison against point positions
	this.clickedABox = false;
	this.targetBox = {};
	this.targetBoxBoundaries = { left: 0, right: 0, top: 0, buttom: 0 };
};

// Object.defineProperties(Mouse.targetBoxBoundaries.prototype,{
	// left: { get: function () {return !this.pinned && !this.heldByMouse;}},
	// right: { get: function () {return Math.sqrt(Math.pow(this.x - mouse.clickX,2) + Math.pow(this.y - mouse.clickY,2))}},
	// top: { get: function () {return Math.sqrt(Math.pow(this.x - mouse.x,2) + Math.pow(this.y - mouse.y,2))}}
// });
