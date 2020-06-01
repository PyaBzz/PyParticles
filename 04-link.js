link = function (p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
};

link.prototype.applyForces = function () {

	if (this.hasStretchedToTear)
		this.p1.removeLink(this);  // 2D

	if (this.p1.isFree === false && this.p2.isFree === false)
		return;

	var force = {
		x: Math.sign(this.diff.x) * Math.pow(Math.abs(this.diff.x), bazGrid.elasticNonlinearity) * bazGrid.elasticStiffness,
		y: Math.sign(this.diff.y) * Math.pow(Math.abs(this.diff.y), bazGrid.elasticNonlinearity) * bazGrid.elasticStiffness,
		z: Math.sign(this.diff.z) * Math.pow(Math.abs(this.diff.z), bazGrid.elasticNonlinearity) * bazGrid.elasticStiffness,
	};

	if (this.p2.isFree)
		this.p2.applyForce({ x: -force.x, y: -force.y, z: -force.z });

	if (this.p1.isFree)
		this.p1.applyForce(force);
};

link.prototype.draw = function () {
	bazGrid.canvasCtx.moveTo(this.p1.x, this.p1.y);  // 0.5 pixels to properly apply odd numbers to line thickness
	bazGrid.canvasCtx.lineTo(this.p2.x, this.p2.y);  // 0.5 pixels to properly apply odd numbers to line thickness
};

Object.defineProperties(link.prototype, {
	diff: { get: function () { return { x: this.p1.x - this.p2.x, y: this.p1.y - this.p2.y, z: this.p1.z - this.p2.z } } },
	hasStretchedToTear: { get: function () { return bazGrid.linkTearingLength && this.length2D > bazGrid.linkTearingLength } },
	length2D: { get: function () { return Math.sqrt(Math.pow(this.diff.x, 2) + Math.pow(this.diff.y, 2)) } },
	length3D: { get: function () { return Math.sqrt(Math.pow(this.diff.x, 2) + Math.pow(this.diff.y, 2) + Math.pow(this.diff.z, 2)) } },
});
