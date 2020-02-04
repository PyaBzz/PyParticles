//###########################  Mesh  ##############################################
//#################################################################################

Mesh = function () {

    this.points = [];

    for (var y = 0; y <= meshHeightCells; y++) {
        for (var x = 0; x <= meshWidthCells; x++) {
            var p = new Point(x * restingLinkLength, y * restingLinkLength, 0);

            if (y == 0) p.pin();                   // Pin the top edge of the mesh
			if (y == meshHeightCells) p.pin();  // Pin the bottom edge of the mesh

			if (x == 0) p.pin();                   // Pin the left edge of the mesh
			if (x == meshWidthCells) p.pin();   // Pin the right edge of the mesh

			// if (x > meshWidthCells/2 && y > meshHeightCells/2) p.pin();   // Pin the right edge of the mesh

            if (x != 0) p.attach(this.points[this.points.length - 1]);  // Horizontal link to previous point on the left
            if (y != 0) p.attach(this.points[x + (y - 1) * (meshWidthCells + 1)]);  // Number of points in each row is 1 more than the number of cells
            this.points.push(p);
        }
    }
};

Mesh.prototype.calculate_link_forces = function() {
	this.points.forEach(function(point){
		point.links.forEach(function(link){link.apply_forces()});
	});
};

Mesh.prototype.updatePointBounds = function() {
	this.points.forEach(function(p){
		Array.prototype.forEach.call(boxes, function(b){
			if (p.isInBox(b.offsetLeft, b.offsetLeft + b.offsetWidth, b.offsetTop, b.offsetTop + b.offsetHeight)) {
				p.held_by_box = 1;
				p.containingBox = b;
			} else {
				p.held_by_box = 0;
				p.containingBox = null;
			}
		});
	});
};

Mesh.prototype.update_point_positions = function() {
	this.points.forEach(function(p){
		if (p.isFree) p.update_position();
	});
};

Mesh.prototype.drawPoints = function () {
	this.points.forEach(function(p){p.draw()});
};

Mesh.prototype.drawLinks = function () {
	ctx.strokeStyle = link_colour;
    ctx.beginPath();
	this.points.forEach(function(p){p.drawLinks()});
    ctx.stroke();
};
