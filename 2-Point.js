//###########################  Point  #############################################
//#################################################################################

var Point = function (x, y, z) {

    this.x = x;
    this.y = y;
    this.z = z;
    this.previous_x = x;
    this.previous_y = y;
    this.previous_z = z;
	this.position_at_click_x = x;
	this.position_at_click_y = y;
	this.position_at_click_z = z;
	this.force_x = 0;
	this.force_y = 0;
	this.force_z = 0;
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
		this.previous_z = this.z;
		return;
	}
	else
	{
		this.speed_x = (this.x - this.previous_x);  // Simplified because t2-t1 = t1-t0 = physics_time_step!
		this.speed_y = (this.y - this.previous_y);
		this.speed_z = (this.z - this.previous_z);
		
		this.acceleration_x = this.force_x / point_mass;
		this.acceleration_y = this.force_y / point_mass;
		this.acceleration_z = this.force_z / point_mass - gravity_acceleration;  // Upward acceleration due to force_z acts against gravity

		this.previous_x = this.x;
		this.previous_y = this.y;
		this.previous_z = this.z;

		this.x = 0.5 * (this.acceleration_x * Math.pow(1000*physics_time_step,2)) + this.speed_x * damping_factor + this.x ;  // from physics x2-x1 = (x1-x0)*(t2-t1)*damping_factor/(t1-t0) + a*(t2-t1)^2/2   but t2-t1 = t1-t0 = physics_time_step!
		this.y = 0.5 * (this.acceleration_y * Math.pow(1000*physics_time_step,2)) + this.speed_y * damping_factor + this.y ;
		this.z = 0.5 * (this.acceleration_z * Math.pow(1000*physics_time_step,2)) + this.speed_z * damping_factor + this.z ;
		this.force_x = 0;
		this.force_y = 0;
		this.force_z = 0;
	}
};

Point.prototype.draw = function () {
	ctx.strokeStyle = point_colour;
	ctx.fillStyle = "#" + 30*this.z + 30*this.z + 30*this.z;
	// ctx.fillStyle = "yellow";
	ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, 2*Math.PI);
    // ctx.stroke();
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

Point.prototype.pin = function (pinx, piny) {
	this.is_pinned = true;
    this.pin_x = pinx;
    this.pin_y = piny;
};

