//###########################  Point  #############################################
//#################################################################################

var Point = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
	this.position_at_click_x = x;
	this.position_at_click_y = y;
	this.position_at_click_z = z;
	this.elastic_force_x = 0;
	this.elastic_force_y = 0;
	this.elastic_force_z = 0;
    this.acceleration_x = 0;
    this.acceleration_y = 0;
    this.acceleration_z = 0;
	this.speed_x = 0;
	this.speed_y = 0;
	this.speed_z = 0;
	this.is_pinned = false;
    this.pin_x = null;
    this.pin_y = null;
    this.pin_z = null;
	this.is_held_by_mouse = false;
    this.links = [];
};

Point.prototype.update_position = function () {

    if (mouse.down) {

        var distance_from_click = Math.sqrt(Math.pow(this.position_at_click_x - mouse.click_x,2) + Math.pow(this.position_at_click_y - mouse.click_y,2));

        switch(mouse.button)
		{
			case 1:
            if (distance_from_click < mouse_influence_distance) this.is_held_by_mouse = true; break;
			case 2:
			if (distance_from_click < mouse_influence_distance) this.pin(this.position_at_click_x, this.position_at_click_y); break;
			case 3:
			var distance_from_mouse = Math.sqrt(Math.pow(this.x - mouse.x,2) + Math.pow(this.y - mouse.y,2));
			if (distance_from_mouse < mouse_cutting_distance) this.links = []; break;
        }
    }

	if (this.is_pinned)
	{
		return;
	}
    else if (this.is_held_by_mouse)
	{
		this.x = this.position_at_click_x + mouse.x - mouse.click_x;
        this.y = this.position_at_click_y + mouse.y - mouse.click_y;
		this.previous_x = this.x;   // For points affected by mouse, there's no inertia nor previous speed!
		this.previous_y = this.y;
		// this.previous_z = this.z;  // Currently the mouse doesn't affect z
		return;
	}
	else
	{
		this.acceleration_x = (- this.elastic_force_x - damping_factor * this.speed_x) / point_mass;
		this.acceleration_y = (- this.elastic_force_y - damping_factor * this.speed_y) / point_mass;
		this.acceleration_z = (- this.elastic_force_z - damping_factor * this.speed_z) / point_mass - gravity_acceleration;  // Gravity acts in -z direction

		if (enable_x) this.x = this.acceleration_x /2 + this.speed_x + this.x ;
		if (enable_y) this.y = this.acceleration_y /2 + this.speed_y + this.y ;
		if (enable_z) this.z = this.acceleration_z /2 + this.speed_z + this.z ;
        min_z = Math.min(min_z, this.z);

		this.speed_x = this.speed_x + this.acceleration_x;
		this.speed_y = this.speed_y + this.acceleration_y;
		this.speed_z = this.speed_z + this.acceleration_z;
		
		this.elastic_force_x = 0;
		this.elastic_force_y = 0;
		this.elastic_force_z = 0;
	}
};

Point.prototype.draw = function () {
	// ctx.fillStyle = "#" + rgbToHex(250*Math.abs(Math.round(this.z))) + rgbToHex(250*Math.abs(Math.round(this.z))) + rgbToHex(250*Math.abs(Math.round(this.z)));
	ctx.fillStyle = point_colour;
	ctx.beginPath();
    enable_z
	? ctx.arc(this.x, this.y, 3*Math.abs(this.z), 0, 2*Math.PI)
	: ctx.arc(this.x, this.y, 2, 0, 2*Math.PI);
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

Point.prototype.pin = function (pinx, piny, pinz) {
	this.is_pinned = true;
    this.pin_x = pinx;
    this.pin_y = piny;
    this.pin_z = pinz;
};

