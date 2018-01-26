//#############################  Assumptions  #####################################
//#################################################################################
// Lengths are in metres for calculation but in pixels for representation.
// Every time-step in calculation corresponds to ONE SECOND in physics model.
//
//________ Global Variables _________

var calculation_time_step = 10; // (Milliseconds) Determines how often point positions are refreshed
var drawing_time_step = 20;    // (Milliseconds) Determines how often the graphics are refreshed
var mouse_influence_distance = 10;
var mouse_cutting_distance = 15;
var mesh_height_cells = 10;
var mesh_width_cells = 10;
var mesh_top_y = 20;
var resting_link_length = 40;  // Never try numbers near 1 because length of less than 1 to the power of nonlinearity causes instability
var tearable = false;
var link_tearing_length = 20 * resting_link_length;
var point_mass = 14.40; // (Kg)
var damping_factor = 0.00;    // Higher values => greater loss
var elastic_stiffness = 0.450;   // Higher
var nonlinear_elasticity = 1.0;  // 1 is linear elasticity. Has problems with lengths less than 1 !!
var enable_3rd_dimension = true;
var gravity_acceleration = 0.10 // (m/S^2)
var link_colour = "grey"; //'#1F1F1F'
var point_colour = "aqua";
var line_width = 1;  // pixels
var min_z = 0;

var mouse = { down: false, button: 1, x: 0, y: 0, click_x: 0, click_y: 0, drag_x:0, drag_y:0 };

//###########################  Window  ############################################
//#################################################################################

window.onload = function () {
    canvas = document.getElementById('c');
    display_for_characteristic = document.getElementById('characteristic');
    display_for_period = document.getElementById('period');
    display_for_exponent = document.getElementById('exponent');
    display_for_z = document.getElementById('display_for_z');
    ctx = canvas.getContext('2d');
    canvas.width  = 1000;
    canvas.height = 550;
	
	calculate_oscillation_model();
	display_for_characteristic.innerHTML = "characteristic: " + characteristic;
	display_for_period.innerHTML = "period: " + period;
	display_for_exponent.innerHTML = "exponent: " + envelope_exponent;
    
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
	setInterval(calculation_loop, calculation_time_step);
    setInterval(drawing_loop, drawing_time_step);
};

function calculation_loop() {
	mesh.calculate_link_forces();
	mesh.update_point_positions();
};

function drawing_loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.lineWidth = line_width;
	mesh.drawLinks();
	mesh.drawPoints();
	display_for_z.innerHTML = min_z.toFixed(2);
};

function calculate_oscillation_model() {
	characteristic = Math.pow(damping_factor,2) - 4 * point_mass * elastic_stiffness;
	angular_frequency = Math.sqrt(- characteristic) / (2 * point_mass);
	frequency = angular_frequency / (2* Math.PI);
	period = 1 / frequency;
	envelope_exponent = - damping_factor / (2 * point_mass);
};