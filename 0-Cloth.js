//#################################  Cloth  #######################################
//#################################################################################

window.onload = function () {

	drawing_time_step = 20;    // (Milliseconds) Determines how often the graphics are refreshed
	mesh_width_cells = 30;
	mesh_height_cells = 20;
	resting_link_length = 10;
	mesh_top_y = 20;
	tearable = false;
	link_tearing_length = 20 * resting_link_length;
	point_mass = 10.0; // (Kg)
	damping_factor = 0.30;    // 0 = greatest loss, 1 = no loss (potentially unstable)
	elastic_stiffness = 0.26;
	nonlinearity = 1.20;  // 1 is linear elasticity. Has problems with lengths less than 1 !! Also, brings higher order harmonics !!
	enable_x = 1;
	enable_y = 1;
	enable_z = 0;
	gravity_acceleration = 0.0020 // (m/S^2)
	draw_points = false;
	link_colour = "grey"; //'#1F1F1F'
	point_colour = "aqua";
	pin_colour = "red";
	line_width = 1;  // pixels
	min_z = 0;

	mouse = {
		influence_distance: 2 * resting_link_length,
		cutting_distance: 2 * resting_link_length,
		//------------------
		x: 0,
		y: 0,
		click_x: 0,
		click_y: 0,
		drag_x:0,
		drag_y:0,
		down: false,
		button: 1
	};

    canvas = document.getElementById('c');
    ctx = canvas.getContext('2d');
    canvas.width  = 1000;
    canvas.height = 550;
    
	canvas.onmousedown = function (click_event) {
        mouse.button = click_event.which;
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
		mesh.points.forEach(function(p){p.held_by_mouse = false});
		rectangular_frame = canvas.getBoundingClientRect();
		mouse.drag_x = release_event.x - rectangular_frame.left - mouse.click_x;
		mouse.drag_y = release_event.y - rectangular_frame.top - mouse.click_y;
        mouse.down = false;
        release_event.preventDefault();
    };

    canvas.oncontextmenu = function (context_event) {
        context_event.preventDefault();
    };

    mesh = new Mesh();
    setInterval(drawing_loop, drawing_time_step);
};

function drawing_loop() {
	mesh.calculate_link_forces();
	mesh.update_point_positions();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.lineWidth = line_width;
	mesh.drawLinks();
	if (draw_points) mesh.drawPoints();
};

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

function componentToHex(c) {
	// if(c == 0) return "00";
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};
