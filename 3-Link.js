//###########################  link  ##############################################
//#################################################################################

var link = function (p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
};

link.prototype.calculate_forces = function () {
	var diff_x = this.p1.x - this.p2.x;
	var diff_y = this.p1.y - this.p2.y;
	var diff_z = this.p1.z - this.p2.z;
	var twoD_length = Math.sqrt(Math.pow(diff_x,2) + Math.pow(diff_y,2));
	
    if (tearable && twoD_length > link_tearing_length) this.p1.remove_links(this);  // 2D
    // if (tearable && length > link_tearing_length) this.p1.remove_links(this);  // 3D
	
    var reaction_force_x = Math.sign(diff_x)*Math.pow(Math.abs(diff_x),nonlinearity) * elastic_stiffness;
    var reaction_force_y = Math.sign(diff_y)*Math.pow(Math.abs(diff_y),nonlinearity) * elastic_stiffness;
    var reaction_force_z = diff_z * elastic_stiffness;

	if((this.p1.is_pinned || this.p1.is_held_by_mouse) && (this.p2.is_pinned || this.p2.is_held_by_mouse)) return;
	
	if(this.p2.is_pinned || this.p2.is_held_by_mouse)
	{
		this.p1.elastic_force_x += reaction_force_x;
		this.p1.elastic_force_y += reaction_force_y;
		this.p1.elastic_force_z += reaction_force_z;
		return;
	}
    if(this.p1.is_pinned || this.p1.is_held_by_mouse)
	{
		this.p2.elastic_force_x -= reaction_force_x;
		this.p2.elastic_force_y -= reaction_force_y;
		this.p2.elastic_force_z -= reaction_force_z;
		return;
	}
	
	this.p1.elastic_force_x += reaction_force_x;
    this.p1.elastic_force_y += reaction_force_y;
    this.p1.elastic_force_z += reaction_force_z;
    this.p2.elastic_force_x -= reaction_force_x;
    this.p2.elastic_force_y -= reaction_force_y;
    this.p2.elastic_force_z -= reaction_force_z;
};

link.prototype.draw = function () {
    ctx.moveTo(this.p1.x + 0.5, this.p1.y + 0.5);  // 0.5 pixels to properly apply odd numbers to line thickness
    ctx.lineTo(this.p2.x + 0.5, this.p2.y + 0.5);  // 0.5 pixels to properly apply odd numbers to line thickness
};
