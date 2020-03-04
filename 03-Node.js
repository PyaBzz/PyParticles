node = function (col, row, zUnits) {
	this.col = col;
	this.row = row;
	this.zUnits = zUnits;

	this.upNeighbour = null;
	this.upRightNeighbour = null;
	this.rightNeighbour = null;
	this.downRightNeighbour = null;
	this.downNeighbour = null;
	this.downLeftNeighbour = null;
	this.leftNeighbour = null;
	this.upLeftNeighbour = null;

	this.x = col * pyGrid.restingLinkLength;
	this.y = row * pyGrid.restingLinkLength;
	this.z = zUnits * pyGrid.restingLinkLength;
	this.force = { x: 0, y: 0, z: 0 };
	this.speed = { x: 0, y: 0, z: 0 };
	this.acceleration = { x: 0, y: 0, z: 0 };
	this.isFrame = false;
	this.pinned = false;
	this.marked = false;
	this.heldByMouse = false;
	this.heldByBox = false;
	this.links = [];
	this.containingBox = null;
	this.visited = false;
};

node.prototype.updatePosition = function () {
	if (!this.isFree) return;

	this.acceleration.x = -this.force.x / pyGrid.nodeMass;
	this.acceleration.y = -this.force.y / pyGrid.nodeMass;
	this.acceleration.z = -this.force.z / pyGrid.nodeMass - pyGrid.gravity;  // Gravity acts in -z direction

	if (this.heldByBox) {
		if (pyGrid.enableXAxis) this.x += (this.acceleration.x / 2 + pyGrid.damping * this.speed.x) * pyGrid.boxedNodeBrakingFactor;
		if (pyGrid.enableYAxis) this.y += (this.acceleration.y / 2 + pyGrid.damping * this.speed.y) * pyGrid.boxedNodeBrakingFactor;
		if (pyGrid.enableZAxis) this.z += (this.acceleration.z / 2 + pyGrid.damping * this.speed.z) * pyGrid.boxedNodeBrakingFactor;
	} else {
		if (pyGrid.enableXAxis) this.x += (this.acceleration.x / 2 + pyGrid.damping * this.speed.x);
		if (pyGrid.enableYAxis) this.y += (this.acceleration.y / 2 + pyGrid.damping * this.speed.y);
		if (pyGrid.enableZAxis) this.z += (this.acceleration.z / 2 + pyGrid.damping * this.speed.z);
	}
	pyGrid.minZ = Math.min(pyGrid.minZ, this.z);

	this.speed.x += this.acceleration.x;
	this.speed.y += this.acceleration.y;
	this.speed.z += this.acceleration.z;

	this.clearForce();
};

node.prototype.getDistanceToCoordinates = function (hor, ver) {
	return Math.sqrt(Math.pow(this.x - hor, 2) + Math.pow(this.y - ver, 2))
}

node.prototype.draw = function () {
	if (this.isFrame)
		return;
	else if (pyGrid.pinRadius && this.pinned) {
		pyGrid.canvasCtx.beginPath();
		pyGrid.canvasCtx.fillStyle = pyGrid.pinColour;
		pyGrid.canvasCtx.arc(this.x, this.y, pyGrid.pinRadius, 0, 2 * Math.PI)
		pyGrid.canvasCtx.fill();
	} else if (pyGrid.markedNodeRadius && this.marked) {
		pyGrid.canvasCtx.beginPath();
		pyGrid.canvasCtx.fillStyle = pyGrid.markedNodeColour;
		pyGrid.canvasCtx.arc(this.x, this.y, pyGrid.markedNodeRadius, 0, 2 * Math.PI)
		pyGrid.canvasCtx.fill();
	}
	else if (pyGrid.nodeRadius) {
		pyGrid.canvasCtx.beginPath();
		pyGrid.canvasCtx.fillStyle = pyGrid.nodeColour;
		pyGrid.enableZAxis
			? pyGrid.canvasCtx.arc(this.x, this.y, Math.abs(this.z), 0, 2 * Math.PI)
			: pyGrid.canvasCtx.arc(this.x, this.y, pyGrid.nodeRadius, 0, 2 * Math.PI);
		pyGrid.canvasCtx.fill();
	}
};

node.prototype.drawLinks = function () {
	if (!this.links.length) return;
	this.links.forEach(function (link) { link.draw() });
};

node.prototype.attach = function (node) {
	this.links.push(
		new link(this, node)
	);
};

node.prototype.move = function (vector) {
	if (this.isFree === false)
		return;

	this.x += vector.x;
	this.y += vector.y;
};

node.prototype.removeLink = function (link) {
	this.links.splice(this.links.indexOf(link), 1);
};

node.prototype.removeLinks = function () {
	this.links = [];
};

node.prototype.pin = function () {
	this.pinned = true;
};

node.prototype.frame = function () {
	this.isFrame = true;
};

node.prototype.mark = function () {
	this.marked = true;
};

node.prototype.clearForce = function () {
	this.force = { x: 0, y: 0, z: 0 };
};

node.prototype.applyForce = function (x, y, z) {
	this.force.x += x; this.force.y += y; this.force.z += z;
};

Object.defineProperties(node.prototype, {
	neighbours: {
		get: function () {
			let allNeighbours = [this.upNeighbour, this.upRightNeighbour, this.rightNeighbour, this.downRightNeighbour, this.downNeighbour, this.downLeftNeighbour, this.leftNeighbour, this.upLeftNeighbour];
			return allNeighbours.filter(function (n) { return n !== null });
		}
	},
	isFree: { get: function () { return this.pinned === false && this.heldByMouse === false && this.isFrame === false; } },
	clientX: { get: function () { return this.x + pyGrid.referenceFrame.left; } },  // Coordinates within the canvas!
	clientY: { get: function () { return this.y + pyGrid.referenceFrame.top; } },  // Coordinates within the canvas!
});
