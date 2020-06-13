node = function (col, row, zUnits, bazgrid) {
	this.grid = bazgrid;
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

	this.hor = col * this.grid.restingLinkLength;
	this.ver = row * this.grid.restingLinkLength;
	this.z = zUnits * this.grid.restingLinkLength;
	this.force = { hor: 0, ver: 0, z: 0 };
	this.speed = { hor: 0, ver: 0, z: 0 };
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
	if (!this.isFree)
		return;

	let acceleration = {
		hor: -this.force.hor / this.grid.nodeMass,
		ver: -this.force.ver / this.grid.nodeMass,
		z: -this.force.z / this.grid.nodeMass - this.grid.gravity,  // Gravity acts in -z direction
	};

	if (this.heldByBox) {
		if (this.grid.enableHorAxis) this.hor += (acceleration.hor / 2 + this.grid.damping * this.speed.hor) * this.grid.boxedNodeBrakingFactor;
		if (this.grid.enableVerAxis) this.ver += (acceleration.ver / 2 + this.grid.damping * this.speed.ver) * this.grid.boxedNodeBrakingFactor;
		if (this.grid.enableZAxis) this.z += (acceleration.z / 2 + this.grid.damping * this.speed.z) * this.grid.boxedNodeBrakingFactor;
	} else {
		if (this.grid.enableHorAxis) this.hor += (acceleration.hor / 2 + this.grid.damping * this.speed.hor);
		if (this.grid.enableVerAxis) this.ver += (acceleration.ver / 2 + this.grid.damping * this.speed.ver);
		if (this.grid.enableZAxis) this.z += (acceleration.z / 2 + this.grid.damping * this.speed.z);
	}
	this.grid.minZ = Math.min(this.grid.minZ, this.z);

	this.applyAcceleration(acceleration);

	this.clearForce();
};

node.prototype.getDistanceToCoordinates = function (hor, ver) {
	// Todo: Reuse this for all distance calculations
	return Math.sqrt(Math.pow(this.hor - hor, 2) + Math.pow(this.ver - ver, 2))
}

node.prototype.draw = function () {
	if (this.isFrame)
		return;
	else if (this.grid.pinRadius && this.pinned) {
		this.grid.canvasCtx.beginPath();
		this.grid.canvasCtx.fillStyle = this.grid.pinColour;
		this.grid.canvasCtx.arc(this.hor, this.ver, this.grid.pinRadius, 0, 2 * Math.PI)
		this.grid.canvasCtx.fill();
	} else if (this.grid.markedNodeRadius && this.marked) {
		this.grid.canvasCtx.beginPath();
		this.grid.canvasCtx.fillStyle = this.grid.markedNodeColour;
		this.grid.canvasCtx.arc(this.hor, this.ver, this.grid.markedNodeRadius, 0, 2 * Math.PI)
		this.grid.canvasCtx.fill();
	}
	else if (this.grid.nodeRadius) {
		this.grid.canvasCtx.beginPath();
		this.grid.canvasCtx.fillStyle = this.grid.nodeColour;
		this.grid.enableZAxis
			? this.grid.canvasCtx.arc(this.hor, this.ver, Math.abs(this.z), 0, 2 * Math.PI)
			: this.grid.canvasCtx.arc(this.hor, this.ver, this.grid.nodeRadius, 0, 2 * Math.PI);
		this.grid.canvasCtx.fill();
	}
};

node.prototype.drawLinks = function () {
	if (!this.links.length) return;
	this.links.forEach(function (link) { link.draw() });
};

node.prototype.attach = function (node) {
	this.links.push(
		new link(this, node, this.grid)
	);
};

node.prototype.move = function (vector) {
	if (this.isFree === false)
		return;

	this.hor += vector.hor;
	this.ver += vector.ver;
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
	this.force = { hor: 0, ver: 0, z: 0 };
};

node.prototype.applyForce = function (vector) {
	this.force.hor += vector.hor; this.force.ver += vector.ver; this.force.z += vector.z;
};

node.prototype.applyAcceleration = function (vector) {
	this.speed.hor += vector.hor; this.speed.ver += vector.ver; this.speed.z += vector.z; // Because time step is normalised to 1 sec
};

Object.defineProperties(node.prototype, {
	neighbours: {
		get: function () {
			let allNeighbours = [this.upNeighbour, this.upRightNeighbour, this.rightNeighbour, this.downRightNeighbour, this.downNeighbour, this.downLeftNeighbour, this.leftNeighbour, this.upLeftNeighbour];
			return allNeighbours.filter(function (n) { return n !== null });
		}
	},
	isFree: { get: function () { return this.pinned === false && this.heldByMouse === false && this.isFrame === false; } },
	clientCoordinates: { get: () => this.grid.convertCoordinate(this.hor, this.ver, 0) },  // Coordinates within the canvas!
});
