//________ Global Variables _________

var physics_time_step = 1;          // (Milliseconds) Determines temporal resolution of mesh calculations
var canvas_refresh_time_step = 20;    // (Milliseconds) 
var mouse_influence_distance = 10;
var mouse_cutting_distance = 15;
var mesh_height_units = 4;
var mesh_width_units = 4;
var mesh_top_y = 20;
var resting_link_length = 20;
var link_tearing_length = 20 * resting_link_length;
var elastic_stiffness = 0.000002000;   // Higher values can lead to unstability of the point position equation!
var nonleanier_elasticity = 1.1;  // 1 is linear elasticity
var damping_factor = 0.99;    // 0 => highest loss , 1 => no loss
var gravity_acceleration = 0;  // (m/S^2)
var point_mass = 4; // (Kg)
var link_colour = "#1F1F1F"; //'#F0F0F0'
var point_colour = "aqua";

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
    // ctx.strokeStyle = "#1F1F1F"; //'#F0F0F0'
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
		mesh.drawPoints();
		mesh.drawLinks();
		setTimeout(canvas_refresh_loop, canvas_refresh_time_step);
}

