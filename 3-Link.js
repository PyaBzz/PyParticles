//###########################  link  ##############################################
//#################################################################################

var link = function (p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
};

link.prototype.calculate_forces = function () {
	var diff_x = this.p2.x - this.p1.x;
	var diff_y = this.p2.y - this.p1.y;
	var diff_z = this.p2.z - this.p1.z;
	var length = Math.sqrt(Math.pow(diff_x,2) + Math.pow(diff_y,2) + Math.pow(diff_z,2));
	var z_sin =  diff_z / length;
	var twoD_length = Math.sqrt(Math.pow(diff_x,2) + Math.pow(diff_y,2));
	var twoD_cos = diff_x / twoD_length;
	var twoD_sin = diff_y / twoD_length;
	
    if (twoD_length > link_tearing_length) this.p1.remove_links(this);  // 2D
    // if (length > link_tearing_length) this.p1.remove_links(this);  // 3D
	
	// var stretch_length = Math.max(length - resting_link_length, 0);  // A stretching cloth only reacts to stretch not to compression
	var stretch_length = length;  // An elastic surface under tension doesn't like to be stretched at all!

    var reaction_force_x = Math.pow(stretch_length, nonleanier_elasticity) * twoD_cos * elastic_stiffness;
    var reaction_force_y = Math.pow(stretch_length, nonleanier_elasticity) * twoD_sin * elastic_stiffness;
    var reaction_force_z = Math.pow(stretch_length, nonleanier_elasticity) * z_sin * elastic_stiffness;

	if((this.p1.is_pinned || this.p1.is_held_by_mouse) && (this.p2.is_pinned || this.p2.is_held_by_mouse)) return;
	
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
    this.p1.force_z += reaction_force_z;
    this.p2.force_x -= reaction_force_x;
    this.p2.force_y -= reaction_force_y;
    this.p2.force_z -= reaction_force_z;
};

link.prototype.draw = function () {
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
};
