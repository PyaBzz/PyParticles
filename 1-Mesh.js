//###########################  Mesh  ##############################################
//#################################################################################

var Mesh = function () {

    this.points = [];

    var start_x = canvas.width / 2 - mesh_width_units * resting_link_length / 2;

    for (var y = 0; y <= mesh_height_units; y++) {

        for (var x = 0; x <= mesh_width_units; x++) {

            var p = new Point(start_x + x * resting_link_length, mesh_top_y + y * resting_link_length, 0);

            if (y == 0) p.pin(p.x, p.y);                   // Pin the top edge of the mesh
			if (y == mesh_height_units) p.pin(p.x, p.y);  // Pin the bottom edge of the mesh
			if (x == 0) p.pin(p.x, p.y);                   // Pin the left edge of the mesh
			if (x == mesh_width_units) p.pin(p.x, p.y);   // Pin the right edge of the mesh
			
            if (x != 0) p.attach(this.points[this.points.length - 1]);  // Horizontal link to previous point on the left
			else console.log(x, y);
            if (y != 0) p.attach(this.points[x + (y - 1) * (mesh_width_units + 1)]);  // Number of points in each row is 1 more than the number of cells

            this.points.push(p);
        }
    }
};

Mesh.prototype.calculate_link_forces = function() {
	this.points.forEach(function(point){
			point.links.forEach(function(link){link.calculate_forces()});
	});
};

Mesh.prototype.update_point_positions = function() {
	this.points.forEach(function(p){p.update_position()});
};

Mesh.prototype.drawPoints = function () {
	ctx.strokeStyle = point_colour;
    ctx.beginPath();
	this.points.forEach(function(p){p.draw()});
    ctx.stroke();
};

Mesh.prototype.drawLinks = function () {
	ctx.strokeStyle = link_colour;
    ctx.beginPath();
	this.points.forEach(function(p){p.drawLinks()});
    ctx.stroke();
};

