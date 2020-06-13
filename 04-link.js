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
		hor: Math.sign(this.diff.hor) * Math.pow(Math.abs(this.diff.hor), this.grid.elasticNonlinearity) * this.grid.elasticStiffness,
		ver: Math.sign(this.diff.ver) * Math.pow(Math.abs(this.diff.ver), this.grid.elasticNonlinearity) * this.grid.elasticStiffness,
		z: Math.sign(this.diff.z) * Math.pow(Math.abs(this.diff.z), this.grid.elasticNonlinearity) * this.grid.elasticStiffness,
	};

	if (this.p2.isFree)
		this.p2.applyForce({ hor: -force.hor, ver: -force.ver, z: -force.z });

	if (this.p1.isFree)
		this.p1.applyForce(force);
};

link.prototype.draw = function () {
	this.grid.canvasCtx.moveTo(this.p1.hor, this.p1.ver);  // 0.5 pixels to properly apply odd numbers to line thickness
	this.grid.canvasCtx.lineTo(this.p2.hor, this.p2.ver);  // 0.5 pixels to properly apply odd numbers to line thickness
};

Object.defineProperties(link.prototype, {
	diff: { get: function () { return { hor: this.p1.hor - this.p2.hor, ver: this.p1.ver - this.p2.ver, z: this.p1.z - this.p2.z } } },
	hasStretchedToTear: { get: function () { return this.grid.linkTearingLength && this.length2D > this.grid.linkTearingLength } },
	length2D: { get: function () { return Math.sqrt(Math.pow(this.diff.hor, 2) + Math.pow(this.diff.ver, 2)) } },
	length3D: { get: function () { return Math.sqrt(Math.pow(this.diff.hor, 2) + Math.pow(this.diff.ver, 2) + Math.pow(this.diff.z, 2)) } },
});
