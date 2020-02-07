node = function (col, row, zUnits) {
	this.col = col;
	this.row = row;
	this.zUnits = zUnits;
	this.x = col * pyGrid.restingLinkLength;
	this.y = row * pyGrid.restingLinkLength;
	this.z = zUnits * pyGrid.restingLinkLength;
	this.force = { x: 0, y: 0, z: 0 };
	this.speed = { x: 0, y: 0, z: 0 };
	this.acceleration = { x: 0, y: 0, z: 0 };
	this.pinned = false;
	this.heldByMouse = false;
	this.heldByBox = false;
	this.links = [];
	this.containingBox = null;
};

node.prototype.updatePosition = function () {

	if (pyGrid.mouse.key == 3 && pyGrid.mouse.cuts(this)) this.links = [];

	this.acceleration.x = -this.force.x / pyGrid.nodeMass;
	this.acceleration.y = -this.force.y / pyGrid.nodeMass;
	this.acceleration.z = -this.force.z / pyGrid.nodeMass - pyGrid.gravity;  // Gravity acts in -z direction

	if (pyGrid.enableXAxis) this.x += (this.acceleration.x / 2 + pyGrid.damping * this.speed.x) * (1 - this.heldByBox * 0.4);
	if (pyGrid.enableYAxis) this.y += (this.acceleration.y / 2 + pyGrid.damping * this.speed.y) * (1 - this.heldByBox * 0.4);
	if (pyGrid.enableZAxis) this.z += (this.acceleration.z / 2 + pyGrid.damping * this.speed.z) * (1 - this.heldByBox * 0.4);
	pyGrid.minZ = Math.min(pyGrid.minZ, this.z);

	this.speed.x += this.acceleration.x;
	this.speed.y += this.acceleration.y;
	this.speed.z += this.acceleration.z;

	this.force = { x: 0, y: 0, z: 0 };
};

node.prototype.draw = function () {
	pyGrid.canvasCtx.beginPath();
	if (this.pinned) {
		pyGrid.canvasCtx.fillStyle = pyGrid.pinColour;
		pyGrid.canvasCtx.arc(this.x, this.y, pyGrid.nodeRadius, 0, 2 * Math.PI)
	} else {
		pyGrid.canvasCtx.fillStyle = pyGrid.nodeColour;
		pyGrid.enableZAxis
			? pyGrid.canvasCtx.arc(this.x, this.y, Math.abs(this.z), 0, 2 * Math.PI)
			: pyGrid.canvasCtx.arc(this.x, this.y, pyGrid.nodeRadius, 0, 2 * Math.PI);
	}
	pyGrid.canvasCtx.fill();
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

node.prototype.removeLinks = function (link) {
	this.links.splice(this.links.indexOf(link), 1);
};

node.prototype.pin = function () {
	this.pinned = true;
};

node.prototype.isInBox = function (x1, x2, y1, y2) {
	return this.x > x1 && this.x < x2 && this.y > y1 && this.y < y2;
};

Object.defineProperties(node.prototype, {
	isFree: { get: function () { return !this.pinned && !this.heldByMouse; } },
	clientX: { get: function () { return this.x + pyGrid.referenceFrame.left; } },  // Coordinates within the canvas!
	clientY: { get: function () { return this.y + pyGrid.referenceFrame.top; } },  // Coordinates within the canvas!
});
