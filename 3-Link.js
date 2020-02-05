var link = function (p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
};

link.prototype.apply_forces = function () {
	var diff_x = this.p1.x - this.p2.x;
	var diff_y = this.p1.y - this.p2.y;
	var diff_z = this.p1.z - this.p2.z;
	var twoD_length = Math.sqrt(Math.pow(diff_x, 2) + Math.pow(diff_y, 2));

	if (pyGrid.tearable && twoD_length > pyGrid.linkTearingLengthFactor) this.p1.remove_links(this);  // 2D
	// if (tearable && length > linkTearingLengthFactor) this.p1.remove_links(this);  // 3D

	var force_x = Math.sign(diff_x) * Math.pow(Math.abs(diff_x), pyGrid.elasticNonlinearity) * pyGrid.elasticStiffness;
	var force_y = Math.sign(diff_y) * Math.pow(Math.abs(diff_y), pyGrid.elasticNonlinearity) * pyGrid.elasticStiffness;
	var force_z = Math.sign(diff_z) * Math.pow(Math.abs(diff_z), pyGrid.elasticNonlinearity) * pyGrid.elasticStiffness;

	if ((this.p1.pinned || this.p1.heldByMouse) && (this.p2.pinned || this.p2.heldByMouse)) return;

	if (this.p2.pinned || this.p2.heldByMouse) {
		this.p1.force_x += force_x; this.p1.force_y += force_y; this.p1.force_z += force_z;
		return;
	}
	if (this.p1.pinned || this.p1.heldByMouse) {
		this.p2.force_x -= force_x; this.p2.force_y -= force_y; this.p2.force_z -= force_z;
		return;
	}

	this.p1.force_x += force_x; this.p1.force_y += force_y; this.p1.force_z += force_z;
	this.p2.force_x -= force_x; this.p2.force_y -= force_y; this.p2.force_z -= force_z;
};

link.prototype.draw = function () {
	pyGrid.canvasCtx.moveTo(this.p1.x, this.p1.y);  // 0.5 pixels to properly apply odd numbers to line thickness
	pyGrid.canvasCtx.lineTo(this.p2.x, this.p2.y);  // 0.5 pixels to properly apply odd numbers to line thickness
};
