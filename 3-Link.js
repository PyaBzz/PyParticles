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
	// var length = Math.sqrt(Math.pow(diff_x,2) + Math.pow(diff_y,2) + Math.pow(diff_z,2));
	// var twoD_length = Math.sqrt(Math.pow(diff_x,2) + Math.pow(diff_y,2));
	// var z_sin = diff_z / length;
	// var z_cos = twoD_length / length;
	// var twoD_cos = diff_x / twoD_length;
	// var twoD_sin = diff_y / twoD_length;
	
    // if (tearable && twoD_length > link_tearing_length) this.p1.remove_links(this);  // 2D
    if (tearable && length > link_tearing_length) this.p1.remove_links(this);  // 3D
	
	// var stretch_length = Math.max(length - resting_link_length, 0);  // A stretching cloth only reacts to stretch not to compression
	// var stretch_length = length - resting_link_length;  // An elastic surface at rest resists stretch but doesn't mind compression
	// var stretch_length = length;  // An already stretched elastic surface not only resists stretch but also tries to contract

	// var nonlinear_effective_stretch_length = Math.pow(stretch_length, nonlinearity);
	// var twoD_nonlinear_effective_stretch_length = nonlinear_effective_stretch_length * z_cos;

    var reaction_force_x = Math.sign(diff_x - resting_link_length)*Math.pow(Math.abs(diff_x - resting_link_length),nonlinearity) * elastic_stiffness;
    var reaction_force_y = Math.sign(diff_y - resting_link_length)*Math.pow(Math.abs(diff_y - resting_link_length),nonlinearity) * elastic_stiffness;
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
