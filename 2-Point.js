//###########################  Point  #############################################
//#################################################################################

var Point = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
	this.position_at_click_x = 0;  // Required to accurately track mouse movements
	this.position_at_click_y = 0;  // Required to accurately track mouse movements
	this.position_at_click_z = 0;  // Required to accurately track mouse movements
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
    this.links = [];
};

Point.prototype.update_position = function () {

	if (mouse.button == 3 && this.distanceToMouse < mouse.cutting_distance) this.links = [];

	this.acceleration_x = -this.force_x / point_mass;
	this.acceleration_y = -this.force_y / point_mass;
	this.acceleration_z = -this.force_z / point_mass - gravity_acceleration;  // Gravity acts in -z direction
    
	if (enable_x) this.x = this.acceleration_x/2 + damping_factor * this.speed_x + this.x ;
	if (enable_y) this.y = this.acceleration_y/2 + damping_factor * this.speed_y + this.y ;
	if (enable_z) this.z = this.acceleration_z/2 + damping_factor * this.speed_z + this.z ;
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

Object.defineProperties(Point.prototype,{
	isFree: { get: function () {return !this.pinned && !this.held_by_mouse;}},
	distanceToClick: { get: function () {return Math.sqrt(Math.pow(this.x - mouse.click_x,2) + Math.pow(this.y - mouse.click_y,2))}},
	distanceToMouse: { get: function () {return Math.sqrt(Math.pow(this.x - mouse.x,2) + Math.pow(this.y - mouse.y,2))}}
});
