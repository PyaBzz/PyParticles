//________ Global Variables _________

var physically_accurate_but_less_stable = true;
if(physically_accurate_but_less_stable) {
	var calculation_time_step = 1;          // (Milliseconds) Determines temporal resolution of mesh calculations
	var time_factor_in_movement_equaitons = Math.pow(1000*calculation_time_step,2);
	var canvas_refresh_time_step = 20;    // (Milliseconds) 
	var mouse_influence_distance = 10;
	var mouse_cutting_distance = 15;
	var mesh_height_units = 10;
	var mesh_width_units = 20;
	var mesh_top_y = 20;
	var resting_link_length = 5;  // (Metres) Never try numbers near 1 because length of less than 1 to the power of nonlinearity causes instability
	var tearable = false;
	var link_tearing_length = 20 * resting_link_length;
	var elastic_stiffness = 0.000000250;   // Higher values can lead to unstability of the point position equation!
	var nonlinear_elasticity = 1.00;  // 1 is linear elasticity
	var damping_factor = 0.000;
	var gravity_acceleration = 0.000000010 // (m/S^2)
	var point_mass = 4; // (Kg)
	var enable_3rd_dimension = false;
	var link_colour = "red"; //'#1F1F1F'
	var point_colour = "aqua";
	var line_width = 1;  // pixels
} else {
	var calculation_time_step = 1;          // (Milliseconds) Determines temporal resolution of mesh calculations
	var canvas_refresh_time_step = 20;    // (Milliseconds) 
	var mouse_influence_distance = 10;
	var mouse_cutting_distance = 15;
	var mesh_height_units = 10;
	var mesh_width_units = 10;
	var mesh_top_y = 20;
	var resting_link_length = 40;  // Never try numbers near 1 because length of less than 1 to the power of nonlinearity causes instability
	var tearable = false;
	var link_tearing_length = 20 * resting_link_length;
	var elastic_stiffness = 2.440;   // Higher values can lead to unstability of the point position equation!
	var nonlinear_elasticity = 1.1;  // 1 is linear elasticity
	var damping_factor = 0.99;    // 0 => highest loss , 1 => no loss
	var gravity_acceleration = 0.0010 // (m/S^2)
	var point_mass = 4; // (Kg)
	var enable_3rd_dimension = true;
	var link_colour = "red"; //'#1F1F1F'
	var point_colour = "aqua";
	var line_width = 1;  // pixels
}
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

    mesh = new Mesh();
	setInterval(mesh_calculation_loop, calculation_time_step);
    setInterval(canvas_refresh_loop, canvas_refresh_time_step);
};

function mesh_calculation_loop() {
	mesh.calculate_link_forces();
	mesh.update_point_positions();
};

function canvas_refresh_loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.lineWidth = line_width;
	mesh.drawLinks();
	mesh.drawPoints();
};

