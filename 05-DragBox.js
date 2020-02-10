dragBox = function (i) {
    this.top = 0;
    this.bottom = 0;
    this.left = 0;
    this.right = 0;
    this.element = document.createElement('div');
    this.element.classList.add('dragbox');
    this.element.setAttribute("dragbox-index", i);
    this.element.textContent = 'Drag Me!';
    this.element.style.top = 0;
};

dragBox.prototype.move = function (x, y) {
    this.element.style.left = this.element.offsetLeft + x + "px";
    this.element.style.top = this.element.offsetTop + y + "px";
    this.updateBoundaries();  // Caching for performance reasons!
};

dragBox.prototype.coversNode = function (n) {
    return n.x > this.left && n.x < this.right && n.y < this.bottom && n.y > this.top;
};

dragBox.prototype.updateBoundaries = function () {
    this.left = this.element.offsetLeft;
    this.right = this.left + this.element.offsetWidth;
    this.top = this.element.offsetTop;
    this.bottom = this.top + this.element.offsetHeight;
};
