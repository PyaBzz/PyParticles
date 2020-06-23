link = function (p1, p2, bazgrid) {
	this.grid = bazgrid;
	this.p1 = p1;
	this.p2 = p2;
};

link.prototype.applyForces = function () {

	if (this.hasStretchedToTear)
		this.p1.removeLink(this);  // 2D

	if (this.p1.canMove === false && this.p2.canMove === false)
		return;

	let force = {
		hor: Math.sign(this.diff.hor) * Math.pow(Math.abs(this.diff.hor), this.grid.elasticNonlinearity) * this.grid.elasticStiffness,
		ver: Math.sign(this.diff.ver) * Math.pow(Math.abs(this.diff.ver), this.grid.elasticNonlinearity) * this.grid.elasticStiffness,
		dep: Math.sign(this.diff.dep) * Math.pow(Math.abs(this.diff.dep), this.grid.elasticNonlinearity) * this.grid.elasticStiffness,
	};

	if (this.p2.canMove)
		this.p2.applyForce({ hor: -force.hor, ver: -force.ver, dep: -force.dep });

	if (this.p1.canMove)
		this.p1.applyForce(force);
};

link.prototype.draw = function () {
	this.grid.canvasCtx.moveTo(this.p1.hor, this.p1.ver);  // 0.5 pixels to properly apply odd numbers to line thickness
	this.grid.canvasCtx.lineTo(this.p2.hor, this.p2.ver);  // 0.5 pixels to properly apply odd numbers to line thickness
};

Object.defineProperties(link.prototype, {
	diff: { get: function () { return { hor: this.p1.hor - this.p2.hor, ver: this.p1.ver - this.p2.ver, dep: this.p1.dep - this.p2.dep } } },
	hasStretchedToTear: { get: function () { return this.grid.linkTearingLength && this.length2D > this.grid.linkTearingLength } },
	length2D: { get: function () { return Math.sqrt(Math.pow(this.diff.hor, 2) + Math.pow(this.diff.ver, 2)) } },
	length3D: { get: function () { return Math.sqrt(Math.pow(this.diff.hor, 2) + Math.pow(this.diff.ver, 2) + Math.pow(this.diff.dep, 2)) } },
});
