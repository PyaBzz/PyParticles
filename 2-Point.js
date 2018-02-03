//###########################  Point  #############################################
//#################################################################################

var Point = function (x, y, z) {
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
	this.held_by_mouse = false;
	this.held_by_box = false;
    this.links = [];
	this.containingBox = null;
};

Point.prototype.update_position = function () {

	if (mouse.key == 3 && this.distanceToMouse < mouse.cutting_distance) this.links = [];

	this.acceleration_x = -this.force_x / point_mass;
	this.acceleration_y = -this.force_y / point_mass;
	this.acceleration_z = -this.force_z / point_mass - gravity_acceleration;  // Gravity acts in -z direction
    
	if (enable_x) this.x = (this.acceleration_x/2 + damping_factor * this.speed_x)*(1 - this.held_by_box * 0.4) + this.x ;
	if (enable_y) this.y = (this.acceleration_y/2 + damping_factor * this.speed_y)*(1 - this.held_by_box * 0.4) + this.y ;
	if (enable_z) this.z = (this.acceleration_z/2 + damping_factor * this.speed_z)*(1 - this.held_by_box * 0.4) + this.z ;
	// if (enable_x) this.x = (this.acceleration_x/2 + damping_factor * this.speed_x) + this.x ;
	// if (enable_y) this.y = (this.acceleration_y/2 + damping_factor * this.speed_y) + this.y ;
	// if (enable_z) this.z = (this.acceleration_z/2 + damping_factor * this.speed_z) + this.z ;
       min_z = Math.min(min_z, this.z);
    
	this.speed_x = this.speed_x + this.acceleration_x;
	this.speed_y = this.speed_y + this.acceleration_y;
	this.speed_z = this.speed_z + this.acceleration_z;
	
	this.force_x = 0; this.force_y = 0; this.force_z = 0;
};

Point.prototype.draw = function () {
	// ctx.fillStyle = "#" + rgbToHex(250*Math.abs(Math.round(this.z))) + rgbToHex(250*Math.abs(Math.round(this.z))) + rgbToHex(250*Math.abs(Math.round(this.z)));
	ctx.beginPath();
	if (this.pinned) {
		ctx.fillStyle = pin_colour;
		ctx.arc(this.x, this.y, 1.5, 0, 2*Math.PI)
	} else {
		ctx.fillStyle = point_colour;
		enable_z
		? ctx.arc(this.x, this.y, Math.abs(this.z), 0, 2*Math.PI)
		: ctx.arc(this.x, this.y, 1.5, 0, 2*Math.PI);
	}
    ctx.fill();
};

Point.prototype.drawLinks = function () {
    if (!this.links.length) return;
	this.links.forEach(function(link){link.draw()});
	// this.links[0].draw();
};

Point.prototype.attach = function (point) {
    this.links.push(
        new link(this, point)
    );
};

Point.prototype.remove_links = function (link) {
    this.links.splice(this.links.indexOf(link), 1);
};

Point.prototype.pin = function () {
	this.pinned = true;
};

Point.prototype.isInBox = function (x1, x2, y1, y2) {
	return this.x > x1 && this.x < x2 && this.y > y1 && this.y < y2;
};

Object.defineProperties(Point.prototype,{
	isFree: { get: function () {return !this.pinned && !this.held_by_mouse;}},
	clientX: { get: function () {return this.x + mouse.canvas_reference_frame.left;}},  // Coordinates within the canvas!
	clientY: { get: function () {return this.y + mouse.canvas_reference_frame.top;}},  // Coordinates within the canvas!
	distanceToClick: { get: function () {return Math.sqrt(Math.pow(this.clientX - mouse.clickX,2) + Math.pow(this.clientY - mouse.clickY,2))}},
    distanceToMouse: { get: function () {return Math.sqrt(Math.pow(this.clientX - mouse.x,2) + Math.pow(this.clientY - mouse.y,2))}},
});
