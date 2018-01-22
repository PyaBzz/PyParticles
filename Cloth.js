//________ Global Variables _________

var physics_accuracy = 1;
var physics_time_step = 1;          // (Milliseconds) Determines temporal resolution of mesh calculations
var canvas_refresh_time_step = 20;    // (Milliseconds) 
var mouse_influence_distance = 10;
var mouse_cutting_distance = 15;
var mesh_height_units = 60;
var mesh_width_units = 100;
var mesh_top_y = 20;
var resting_link_length = 5;
var link_tearing_length = 20 * resting_link_length;
var elastic_stiffness = 0.000002000;   // Higher values can lead to unstability of the point position equation!
var nonleanier_elasticity = 1.1;  // 1 is linear elasticity
var damping_factor = 0.99;    // 0 => highest loss , 1 => no loss
var gravity_acceleration = 0;  // (m/S^2)
var point_mass = 4; // (Kg)

var mouse = { down: false, button: 1, x: 0, y: 0, click_x: 0, click_y: 0, drag_x:0, drag_y:0 };

//###########################  Window  ############################################
//#################################################################################

window.onload = function () {
    canvas = document.getElementById('c');
    ctx = canvas.getContext('2d');
    canvas.width  = 1000;
    canvas.height = 550;
    
	canvas.onmousedown = function (click_event) {
        mouse.button  = click_event.which;
		mesh.points.forEach(function(p){p.position_at_click_x = p.x; p.position_at_click_y = p.y;});
		rectangular_frame = canvas.getBoundingClientRect();
        mouse.click_x = click_event.x - rectangular_frame.left;
        mouse.click_y = click_event.y - rectangular_frame.top;
        mouse.down = true;
        click_event.preventDefault();
    };

    canvas.onmousemove = function (move_event) {
		rectangular_frame = canvas.getBoundingClientRect();
        mouse.x = move_event.pageX - rectangular_frame.left;
        mouse.y = move_event.pageY - rectangular_frame.top;
        move_event.preventDefault();
    };

    canvas.onmouseup = function (release_event) {
		mesh.points.forEach(function(p){p.is_held_by_mouse = false});
		rectangular_frame = canvas.getBoundingClientRect();
		mouse.drag_x = release_event.x - rectangular_frame.left - mouse.click_x;
		mouse.drag_y = release_event.y - rectangular_frame.top - mouse.click_y;
        mouse.down = false;
        release_event.preventDefault();
    };

    canvas.oncontextmenu = function (context_event) {
        context_event.preventDefault();
    };

    boundsx = canvas.width - 1;
    boundsy = canvas.height - 1;
    ctx.strokeStyle = "darkorange"; //'#F0F0F0'
    mesh = new Mesh();
	canvas_refresh_loop_variable = 0;
	mesh_refresh_loop();
    canvas_refresh_loop();
};

function mesh_refresh_loop()
{
	mesh.calculate_link_forces();
	mesh.update_point_positions();
	setTimeout(mesh_refresh_loop, physics_time_step);
}

function canvas_refresh_loop() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		mesh.draw();
		setTimeout(canvas_refresh_loop, canvas_refresh_time_step);
}

//###########################  Mesh  ##############################################
//#################################################################################

var Mesh = function () {

    this.points = [];

    var start_x = canvas.width / 2 - mesh_width_units * resting_link_length / 2;

    for (var y = 0; y <= mesh_height_units; y++) {

        for (var x = 0; x <= mesh_width_units; x++) {

            var p = new Point(start_x + x * resting_link_length, mesh_top_y + y * resting_link_length);

            if (y == 0) p.pin(p.x, p.y);                   // Pin the top edge of the mesh
			if (y == mesh_height_units) p.pin(p.x, p.y);  // Pin the bottom edge of the mesh
			if (x == 0) p.pin(p.x, p.y);                   // Pin the left edge of the mesh
			if (x == mesh_width_units) p.pin(p.x, p.y);   // Pin the right edge of the mesh
			
            if (x != 0) p.attach(this.points[this.points.length - 1]);
            if (y != 0) p.attach(this.points[x + (y - 1) * (mesh_width_units + 1)]);  // Number of points in each row is 1 more than the number of cells

            this.points.push(p);
        }
    }
};

Mesh.prototype.calculate_link_forces = function() {

    var i = physics_accuracy;
    while (i--) {
		this.points.forEach
		(
			function(point)
			{
				point.links.forEach(function(link){link.calculate_forces()});
			}
		);
    }
};

Mesh.prototype.update_point_positions = function() {
	this.points.forEach(function(p){p.update_position()});
};

Mesh.prototype.draw = function () {

    ctx.beginPath();
	this.points.forEach(function(p){p.draw()});
    ctx.stroke();
};

//###########################  Point  #############################################
//#################################################################################

var Point = function (x, y) {

    this.x = x;
    this.y = y;
    this.previous_x = x;
    this.previous_y = y;
	this.position_at_click_x = x;
	this.position_at_click_y = y;
	this.force_x = 0;
	this.force_y = 0;
    this.acceleration_x = 0;
    this.acceleration_y = 0;
	this.speed_x = 0;
	this.speed_y = 0;
	this.is_pinned = false;
    this.pin_x = null;
    this.pin_y = null;
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
		return;
	}
	else
	{
		this.speed_x = (this.x - this.previous_x);  // Simplified because t2-t1 = t1-t0 = physics_time_step!
		this.speed_y = (this.y - this.previous_y);
		
		this.acceleration_x = this.force_x / point_mass;
		this.acceleration_y = this.force_y / point_mass + gravity_acceleration;  // Upward acceleration due to force_y acts agains gravity
		
		this.previous_x = this.x;
		this.previous_y = this.y;

		this.x = 0.5 * (this.acceleration_x * Math.pow(1000*physics_time_step,2)) + this.speed_x * damping_factor + this.x ;  // from physics x2-x1 = (x1-x0)*(t2-t1)*damping_factor/(t1-t0) + a*(t2-t1)^2/2   but t2-t1 = t1-t0 = physics_time_step!
		this.y = 0.5 * (this.acceleration_y * Math.pow(1000*physics_time_step,2)) + this.speed_y * damping_factor + this.y ;
		this.force_x = 0;
		this.force_y = 0;
	}
};

Point.prototype.draw = function () {

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

//###########################  link  ##############################################
//#################################################################################

var link = function (p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
};

link.prototype.calculate_forces = function () {

    var diff_x  = this.p2.x - this.p1.x;
    var diff_y  = this.p2.y - this.p1.y;
    var length = Math.sqrt(Math.pow(diff_x,2) + Math.pow(diff_y,2));
	
    if (length > link_tearing_length) this.p1.remove_links(this);

	var link_cos = diff_x / length;
	var link_sin = diff_y / length;
	// var stretch_length = Math.max(length - resting_link_length, 0);  // A stretching cloth only reacts to stretch not to compression
	var stretch_length = length;  // An elastic surface under tension doesn't like to be stretched at all!

    var reaction_force_x = Math.pow(stretch_length, nonleanier_elasticity) * link_cos * elastic_stiffness;
    var reaction_force_y = Math.pow(stretch_length, nonleanier_elasticity) * link_sin * elastic_stiffness;

	if((this.p1.is_pinned || this.p1.is_held_by_mouse) && (this.p2.is_pinned || this.p2.is_held_by_mouse))
	{
		return;
	}
	
    if(this.p1.is_pinned || this.p1.is_held_by_mouse)
	{
		this.p2.force_x -= reaction_force_x;
		this.p2.force_y -= reaction_force_y;
		return;
	}
	if(this.p2.is_pinned || this.p2.is_held_by_mouse)
	{
		this.p1.force_x += reaction_force_x;
		this.p1.force_y += reaction_force_y;
		return;
	}
	
	this.p1.force_x += reaction_force_x;
    this.p1.force_y += reaction_force_y;
    this.p2.force_x -= reaction_force_x;
    this.p2.force_y -= reaction_force_y;
};

link.prototype.draw = function () {

    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
};

