link = function (p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
};

link.prototype.apply_forces = function () {
	var diff = { x: this.p1.x - this.p2.x, y: this.p1.y - this.p2.y, z: this.p1.z - this.p2.z };
	var twoD_length = Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2));

	if (pyGrid.linkTearingLength && twoD_length > pyGrid.linkTearingLength) this.p1.remove_links(this);  // 2D
	// if (tearable && length > linkTearingLength) this.p1.remove_links(this);  // 3D

	var force_x = Math.sign(diff.x) * Math.pow(Math.abs(diff.x), pyGrid.elasticNonlinearity) * pyGrid.elasticStiffness;
	var force_y = Math.sign(diff.y) * Math.pow(Math.abs(diff.y), pyGrid.elasticNonlinearity) * pyGrid.elasticStiffness;
	var force_z = Math.sign(diff.z) * Math.pow(Math.abs(diff.z), pyGrid.elasticNonlinearity) * pyGrid.elasticStiffness;

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
