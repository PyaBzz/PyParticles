onload = function () {
	container = document.getElementById('container');
	dragBoxes = document.getElementsByClassName('dragbox');
	container.createPyGrid(waterConfig, dragBoxes);
};

HTMLDivElement.prototype.createPyGrid = function (config, dragBoxes) { //TODO: This function will create the grid and physics and everything with no change to window properties.
	pyGrid = this;
	for (var key in config)
		this[key] = config[key];

	this.restingLinkLength = this.clientWidth / this.horizontalCellCount;
	this.verticalCellCount = Math.ceil(this.clientHeight / this.restingLinkLength);
	this.linkTearingLength = this.linkTearingLengthFactor * this.restingLinkLength;
	this.dragBoxes = dragBoxes;

	pyGrid.canvas = document.createElement('canvas');
	pyGrid.canvas.width = this.clientWidth;
	pyGrid.canvas.height = this.clientHeight;
	this.appendChild(pyGrid.canvas);
	pyGrid.canvasCtx = pyGrid.canvas.getContext('2d');

	bindCanvasHandlers();
	mouse = new mouse(this.mouseImpactCellCount * this.restingLinkLength, this.mouseCuttingCellCount * this.restingLinkLength, true, 0.6);

	pyGrid.canvas.oncontextmenu = function (contextEvent) {
		contextEvent.preventDefault();
	};

	mesh = new Mesh();
	setInterval(drawingLoop, pyGrid.drawingTimeStep);
};

function drawingLoop() {
	mesh.calculateForces();
	mesh.updateNodeBounds();
	mesh.updateNodePositions();
	pyGrid.canvasCtx.clearRect(0, 0, pyGrid.canvas.width, pyGrid.canvas.height);
	pyGrid.canvasCtx.lineWidth = pyGrid.linkWidth;
	mesh.drawLinks();
	if (pyGrid.drawNodes) mesh.drawPoints();
};

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

function componentToHex(c) {
	// if(c == 0) return "00";
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
};

function mouse(impactDistance, cutDistance, slpy, slp_ftr) {
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
	this.heldPoints = [];
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
