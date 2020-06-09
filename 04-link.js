link = function (p1, p2, bazgrid) {
	this.grid = bazgrid;
	this.p1 = p1;
	this.p2 = p2;
};

link.prototype.applyForces = function () {

	if (this.hasStretchedToTear)
		this.p1.removeLink(this);  // 2D

	if (this.p1.isFree === false && this.p2.isFree === false)
		return;

	let force = {
		x: Math.sign(this.diff.x) * Math.pow(Math.abs(this.diff.x), this.grid.elasticNonlinearity) * this.grid.elasticStiffness,
		y: Math.sign(this.diff.y) * Math.pow(Math.abs(this.diff.y), this.grid.elasticNonlinearity) * this.grid.elasticStiffness,
		z: Math.sign(this.diff.z) * Math.pow(Math.abs(this.diff.z), this.grid.elasticNonlinearity) * this.grid.elasticStiffness,
	};

	if (this.p2.isFree)
		this.p2.applyForce({ x: -force.x, y: -force.y, z: -force.z });

	if (this.p1.isFree)
		this.p1.applyForce(force);
};

link.prototype.draw = function () {
	this.grid.canvasCtx.moveTo(this.p1.x, this.p1.y);  // 0.5 pixels to properly apply odd numbers to line thickness
	this.grid.canvasCtx.lineTo(this.p2.x, this.p2.y);  // 0.5 pixels to properly apply odd numbers to line thickness
};

Object.defineProperties(link.prototype, {
	diff: { get: function () { return { x: this.p1.x - this.p2.x, y: this.p1.y - this.p2.y, z: this.p1.z - this.p2.z } } },
	hasStretchedToTear: { get: function () { return this.grid.linkTearingLength && this.length2D > this.grid.linkTearingLength } },
	length2D: { get: function () { return Math.sqrt(Math.pow(this.diff.x, 2) + Math.pow(this.diff.y, 2)) } },
	length3D: { get: function () { return Math.sqrt(Math.pow(this.diff.x, 2) + Math.pow(this.diff.y, 2) + Math.pow(this.diff.z, 2)) } },
});
