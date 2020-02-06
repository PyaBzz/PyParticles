point = function (x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;

	this.force_x = 0;
	this.force_y = 0;
	this.force_z = 0;
	this.acceleration_x = 0;
	this.acceleration_y = 0;
	this.acceleration_z = 0;
	this.speed_x = 0;
	this.speed_y = 0;
	this.speed_z = 0;
	this.pinned = false;
	this.heldByMouse = false;
	this.heldByBox = false;
	this.links = [];
	this.containingBox = null;
};

point.prototype.update_position = function () {

	if (pyGrid.mouse.key == 3 && this.distanceToMouse < pyGrid.mouse.cuttingDistance) this.links = [];

	this.acceleration_x = -this.force_x / pyGrid.nodeMass;
	this.acceleration_y = -this.force_y / pyGrid.nodeMass;
	this.acceleration_z = -this.force_z / pyGrid.nodeMass - pyGrid.gravity;  // Gravity acts in -z direction

	if (pyGrid.enableXAxis) this.x += (this.acceleration_x / 2 + pyGrid.damping * this.speed_x) * (1 - this.heldByBox * 0.4);
	if (pyGrid.enableYAxis) this.y += (this.acceleration_y / 2 + pyGrid.damping * this.speed_y) * (1 - this.heldByBox * 0.4);
	if (pyGrid.enableZAxis) this.z += (this.acceleration_z / 2 + pyGrid.damping * this.speed_z) * (1 - this.heldByBox * 0.4);
	// if (enable_x) this.x = (this.acceleration_x/2 + damping_factor * this.speed_x) + this.x ;
	// if (enable_y) this.y = (this.acceleration_y/2 + damping_factor * this.speed_y) + this.y ;
	// if (enable_z) this.z = (this.acceleration_z/2 + damping_factor * this.speed_z) + this.z ;
	pyGrid.minZ = Math.min(pyGrid.minZ, this.z);

	this.speed_x += this.acceleration_x;
	this.speed_y += this.acceleration_y;
	this.speed_z += this.acceleration_z;

	this.force_x = 0; this.force_y = 0; this.force_z = 0;
};

point.prototype.draw = function () {
	// pyGrid.canvasCtx.fillStyle = "#" + rgbToHex(250*Math.abs(Math.round(this.z))) + rgbToHex(250*Math.abs(Math.round(this.z))) + rgbToHex(250*Math.abs(Math.round(this.z)));
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

point.prototype.drawLinks = function () {
	if (!this.links.length) return;
	this.links.forEach(function (link) { link.draw() });
	// this.links[0].draw();
};

point.prototype.attach = function (point) {
	this.links.push(
		new link(this, point)
	);
};

point.prototype.remove_links = function (link) {
	this.links.splice(this.links.indexOf(link), 1);
};

point.prototype.pin = function () {
	this.pinned = true;
};

point.prototype.isInBox = function (x1, x2, y1, y2) {
	return this.x > x1 && this.x < x2 && this.y > y1 && this.y < y2;
};

Object.defineProperties(point.prototype, {
	isFree: { get: function () { return !this.pinned && !this.heldByMouse; } },
	clientX: { get: function () { return this.x + pyGrid.mouse.referenceFrame.left; } },  // Coordinates within the canvas!
	clientY: { get: function () { return this.y + pyGrid.mouse.referenceFrame.top; } },  // Coordinates within the canvas!
	distanceToClick: { get: function () { return Math.sqrt(Math.pow(this.clientX - pyGrid.mouse.clickX, 2) + Math.pow(this.clientY - pyGrid.mouse.clickY, 2)) } },
	distanceToMouse: { get: function () { return Math.sqrt(Math.pow(this.clientX - pyGrid.mouse.x, 2) + Math.pow(this.clientY - pyGrid.mouse.y, 2)) } },
});
