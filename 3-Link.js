//###########################  link  ##############################################
//#################################################################################

var link = function (p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
};

link.prototype.calculate_forces = function () {

    if (this.length > link_tearing_length) this.p1.remove_links(this);

	var link_2d_cos = this.diff_x / this.length;
	var link_2d_sin = this.diff_y / this.length;
	// var stretch_length = Math.max(length - resting_link_length, 0);  // A stretching cloth only reacts to stretch not to compression
	var stretch_length = this.length;  // An elastic surface under tension doesn't like to be stretched at all!

    var reaction_force_x = Math.pow(stretch_length, nonleanier_elasticity) * link_2d_cos * elastic_stiffness;
    var reaction_force_y = Math.pow(stretch_length, nonleanier_elasticity) * link_2d_sin * elastic_stiffness;

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
    this.p2.force_x -= reaction_force_x;
    this.p2.force_y -= reaction_force_y;
};

link.prototype.draw = function () {

    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
};

Object.defineProperties(link.prototype,{
	diff_x: { get: function () {return this.p2.x - this.p1.x}},
	diff_y: { get: function () {return this.p2.y - this.p1.y}},
	diff_z: { get: function () {return this.p2.z - this.p1.z}},
	length: { get: function () {return Math.sqrt(Math.pow(this.diff_x,2) + Math.pow(this.diff_y,2) + Math.pow(this.diff_z,2))}},
	zSine:  { get: function () {return 0}},
	zAngle: { get: function () {return 0}}
});
