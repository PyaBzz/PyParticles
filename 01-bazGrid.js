onload = function () {
	let container = document.getElementById('container');
	let bazgrid = new BazGrid(container, waterConfig);
};

BazGrid = function (container, config) {
	this.container = container;
	for (let key in config)
		this[key] = config[key];

	this.restingLinkLength = this.container.clientWidth / this.horizontalCellCount;
	this.verticalCellCount = Math.ceil(this.container.clientHeight / this.restingLinkLength);
	this.linkTearingLength = this.linkTearingLengthFactor * this.restingLinkLength;

	this.canvas = document.createElement('canvas');
	this.canvas.width = this.container.clientWidth;
	this.canvas.height = this.container.clientHeight;
	this.container.appendChild(this.canvas);
	this.canvasCtx = this.canvas.getContext('2d');
	this.referenceFrame = this.canvas.getBoundingClientRect();  // Required for comparison against node positions

	this.mouse = new slippyMouse(this.mouseImpactRadius * this.restingLinkLength, this.mouseCuttingRadius * this.restingLinkLength, this.mouseSlipFactor, this);

	this.graph = new graph(this);

	this.dragBoxes = [];
	for (let i = 0; i < this.dragBoxCount; i++) {
		let box = new dragBox(i, this);
		this.dragBoxes.push(box);
		this.container.appendChild(box.element);
		box.updateBoundaries();
	}

	this.mouse.bindHandlers();
	this.bindHandlers();
	this.run();
};

BazGrid.prototype.run = function () {
	let me = this;
	this.drawingLoop = setInterval(function () {
		me.updateBoxedNodes();
		me.graph.calculateForces();
		if (me.enableDynamics)
			me.graph.updateNodePositions();
		me.canvasCtx.clearRect(0, 0, me.canvas.width, me.canvas.height);
		if (me.linkWidth) {
			me.canvasCtx.lineWidth = me.linkWidth;
			me.graph.drawLinks();
		}
		me.graph.drawNodes();
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

BazGrid.prototype.pause = function () {
	clearInterval(this.drawingLoop);
	this.drawingLoop = 0;
}

BazGrid.prototype.resume = function () {
	this.run();
}

BazGrid.prototype.bindHandlers = function () {
	let me = this;
	let ctrl_pause = document.getElementById('ctrl-pause');

	ctrl_pause.onchange = function (changeEvent) {
		if (changeEvent.target.checked)
			me.pause();
		else
			me.resume();
	}

	let ctrl_mouse_slippy = document.getElementById('ctrl-mouse-slippy');
	ctrl_mouse_slippy.checked = true;
	let ctrl_mouse_pinchy = document.getElementById('ctrl-mouse-pinchy');

	ctrl_mouse_slippy.onchange = function (changeEvent) {
		if (changeEvent.target.checked) {
			me.mouse = new slippyMouse(me.mouseImpactRadius * me.restingLinkLength, me.mouseCuttingRadius * me.restingLinkLength, me.mouseSlipFactor, me);
			me.mouse.bindHandlers();
		}
	}

	ctrl_mouse_pinchy.onchange = function (changeEvent) {
		if (changeEvent.target.checked) {
			me.mouse = new pinchyMouse(me.mouseImpactRadius * me.restingLinkLength, me.mouseCuttingRadius * me.restingLinkLength, me.mouseSlipFactor, me);
			me.mouse.bindHandlers();
		}
	}

	let ctrl_rclick_mark = document.getElementById('ctrl-rclick-mark');
	ctrl_rclick_mark.checked = true;
	let ctrl_rclick_cut = document.getElementById('ctrl-rclick-cut');

	ctrl_rclick_mark.onchange = function (changeEvent) {
		if (changeEvent.target.checked) {
			me.rightClickAction = me.mouse.actionsEnum.mark;
		}
	}

	ctrl_rclick_cut.onchange = function (changeEvent) {
		if (changeEvent.target.checked) {
			me.rightClickAction = me.mouse.actionsEnum.cut;
		}
	}
};
