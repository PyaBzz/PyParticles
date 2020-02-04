//#################################  Cloth  #######################################
//#################################################################################

window.onload = function () {

	container = document.getElementById('container');
	boxes = document.getElementsByClassName('box');
	containerWidth = container.clientWidth;
	containerHeight = container.clientHeight;
	drawingTimeStep = 20;    // (Milliseconds) Determines how often the graphics are refreshed
	meshWidthCells = 60;
	restingLinkLength = containerWidth / meshWidthCells;
	meshHeightCells = Math.ceil(containerHeight / restingLinkLength);
	tearable = false;
	linkTearingLength = 20 * restingLinkLength;
	pointMass = 10.0; // (Kg)
	damping_factor = 0.30;    // 0 = greatest loss, 1 = no loss (potentially unstable)
	elastic_stiffness = 0.26;
	nonlinearity = 1.20;  // 1 is linear elasticity. Has problems with lengths less than 1 !! Also, brings higher order harmonics !!
	enable_x = 1;
	enable_y = 1;
	enable_z = 0;
	gravity_acceleration = 0.0020 // (m/S^2)
	draw_points = false;
	link_colour = "aqua"; //'#1F1F1F'
	point_colour = "red";
	pin_colour = "red";
	line_width = 1;  // pixels
	min_z = 0;
	
    canvas = document.createElement('canvas');
	canvas.width = containerWidth;
	canvas.height = containerHeight;
	container.appendChild(canvas);
    ctx = canvas.getContext('2d');
	mouse = new Mouse(2 * restingLinkLength, 2 * restingLinkLength, true, 0.6);
	
	container.onmousedown = function (click_event) {
        mouse.key = click_event.which;
        mouse.click_x = click_event.x;
        mouse.click_y = click_event.y;
		if (click_event.target == canvas) {
			if (mouse.key == 1) {
				if (mouse.slippy) {
					
				} else {
					mesh.points.forEach(function(p){
						if (p.isFree && p.distanceToClick < mouse.influence_distance) {
							p.held_by_mouse = true;
							p.position_at_click_x = p.x;
							p.position_at_click_y = p.y;
							mouse.held_points.push(p);
						}
					});
				}
			}
			if (mouse.key == 2) mesh.points.forEach(function(p){
				if (p.distanceToClick < mouse.influence_distance) p.pin();
			});
		} else if (click_event.target.className == 'box') {
			mouse.clicked_a_box = true;
			mouse.target_box = click_event.target;
			mouse.target_box_boundaries.left = mouse.target_box.offsetLeft;
			mouse.target_box_boundaries.right = mouse.target_box.offsetLeft + mouse.target_box.offsetWidth;
			mouse.target_box_boundaries.top = mouse.target_box.offsetTop;
			mouse.target_box_boundaries.buttom = mouse.target_box.offsetTop +  mouse.target_box.offsetHeight;
		}
        click_event.preventDefault();
    };

    container.onmousemove = function (move_event) {
		var current_drag_start_x = mouse.x;
		var current_drag_start_y = mouse.y;
        mouse.x = move_event.pageX;
        mouse.y = move_event.pageY;
		mouse.current_drag_x = mouse.x - current_drag_start_x;
		mouse.current_drag_y = mouse.y - current_drag_start_y;
		if (mouse.clicked_a_box) {
			mesh.points.forEach(function(p){
				if (p.isFree && p.isInBox(mouse.target_box_boundaries.left, mouse.target_box_boundaries.right, mouse.target_box_boundaries.top, mouse.target_box_boundaries.buttom)) {
					p.x += mouse.current_drag_x * mouse.slip_factor;
					p.y += mouse.current_drag_y * mouse.slip_factor;
					p.speed_x = 0;   // For points affected by mouse, there's no inertia nor previous speed!
					p.speed_y = 0;
					p.speed_z = 0;

				}
			});
			mouse.target_box.style.left = mouse.target_box.offsetLeft + mouse.current_drag_x + "px";
			mouse.target_box.style.top = mouse.target_box.offsetTop + mouse.current_drag_y + "px";
			mouse.target_box_boundaries.left = mouse.target_box.offsetLeft;
			mouse.target_box_boundaries.right = mouse.target_box.offsetLeft + mouse.target_box.offsetWidth;
			mouse.target_box_boundaries.top = mouse.target_box.offsetTop;
			mouse.target_box_boundaries.buttom = mouse.target_box.offsetTop +  mouse.target_box.offsetHeight;
		} else {
			if (mouse.key == 1) {
				if (mouse.slippy) {
					mesh.points.forEach(function(p){
						if (p.isFree && p.distanceToMouse < mouse.influence_distance) {
							p.x += mouse.current_drag_x * mouse.slip_factor;
							p.y += mouse.current_drag_y * mouse.slip_factor;
						}
					});
				} else {
					mouse.held_points.forEach(function(p){
						p.x += mouse.current_drag_x;
						p.y += mouse.current_drag_y;
						// this.previous_z = this.z;  // Currently the mouse doesn't affect z
						p.speed_x = 0;   // For points affected by mouse, there's no inertia nor previous speed!
						p.speed_y = 0;
						p.speed_z = 0;
					});
				}
			}
		}
        move_event.preventDefault();
    };

    container.onmouseup = function (release_event) {
		mouse.held_points.forEach(function(p){p.held_by_mouse = false});
		mouse.drag_x = release_event.x - mouse.click_x;
		mouse.drag_y = release_event.y - mouse.click_y;
		mouse.key = 0;
		mouse.held_points = [];
		mouse.clicked_a_box = false;
        release_event.preventDefault();
    };

    canvas.oncontextmenu = function (context_event) {
        context_event.preventDefault();
    };

    mesh = new Mesh();
    setInterval(drawing_loop, drawingTimeStep);
};

function drawing_loop() {
	mesh.calculate_link_forces();
	mesh.updatePointBounds();
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

var Mouse = function (inf_dist, cut_dist, slpy, slp_ftr) {
	this.influence_distance = inf_dist;
	this.cutting_distance = cut_dist;
	this.slippy = slpy;
	this.slip_factor = slp_ftr;
	this.x = 0;
	this.y = 0;
	this.current_drag_x = 0;
	this.current_drag_y = 0;
	this.click_x = 0;
	this.click_y = 0;
	this.drag_x = 0;
	this.drag_y = 0;
	this.key = 0;
	this.held_points = [];
	this.canvas_reference_frame = canvas.getBoundingClientRect();  // Required for comparison against point positions
	this.clicked_a_box = false;
	this.target_box = {};
	this.target_box_boundaries = {left: 0, right: 0, top: 0, buttom: 0};
};

// Object.defineProperties(Mouse.target_box_boundaries.prototype,{
	// left: { get: function () {return !this.pinned && !this.held_by_mouse;}},
	// right: { get: function () {return Math.sqrt(Math.pow(this.x - mouse.click_x,2) + Math.pow(this.y - mouse.click_y,2))}},
	// top: { get: function () {return Math.sqrt(Math.pow(this.x - mouse.x,2) + Math.pow(this.y - mouse.y,2))}}
// });
