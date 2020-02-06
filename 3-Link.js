link = function (p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
};

link.prototype.applyForces = function () {

	if (this.hastStretchedToTear) this.p1.removeLinks(this);  // 2D

	var force_x = Math.sign(this.diff.x) * Math.pow(Math.abs(this.diff.x), pyGrid.elasticNonlinearity) * pyGrid.elasticStiffness;
	var force_y = Math.sign(this.diff.y) * Math.pow(Math.abs(this.diff.y), pyGrid.elasticNonlinearity) * pyGrid.elasticStiffness;
	var force_z = Math.sign(this.diff.z) * Math.pow(Math.abs(this.diff.z), pyGrid.elasticNonlinearity) * pyGrid.elasticStiffness;

	if ((this.p1.pinned || this.p1.heldByMouse) && (this.p2.pinned || this.p2.heldByMouse)) return;

	if (this.p2.pinned || this.p2.heldByMouse) {
		this.p1.force.x += force_x; this.p1.force.y += force_y; this.p1.force.z += force_z;
		return;
	}
	if (this.p1.pinned || this.p1.heldByMouse) {
		this.p2.force.x -= force_x; this.p2.force.y -= force_y; this.p2.force.z -= force_z;
		return;
	}

	this.p1.force.x += force_x; this.p1.force.y += force_y; this.p1.force.z += force_z;
	this.p2.force.x -= force_x; this.p2.force.y -= force_y; this.p2.force.z -= force_z;
};

link.prototype.draw = function () {
	pyGrid.canvasCtx.moveTo(this.p1.x, this.p1.y);  // 0.5 pixels to properly apply odd numbers to line thickness
	pyGrid.canvasCtx.lineTo(this.p2.x, this.p2.y);  // 0.5 pixels to properly apply odd numbers to line thickness
};

Object.defineProperties(link.prototype, {
	diff: { get: function () { return { x: this.p1.x - this.p2.x, y: this.p1.y - this.p2.y, z: this.p1.z - this.p2.z } } },
	hastStretchedToTear: { get: function () { return pyGrid.linkTearingLength && this.length2D > pyGrid.linkTearingLength } },
	length2D: { get: function () { return Math.sqrt(Math.pow(this.diff.x, 2) + Math.pow(this.diff.y, 2)) } },
	length3D: { get: function () { return Math.sqrt(Math.pow(this.diff.x, 2) + Math.pow(this.diff.y, 2) + Math.pow(this.diff.z, 2)) } },
});
