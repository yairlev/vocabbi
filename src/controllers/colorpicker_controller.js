$.Controller.extend('ColorPicker',
/* @Static */
{
rgbToHex: function (rgb) {
    var rgbvals = /rgb\((.+),(.+),(.+)\)/i.exec(rgb);
    var rval = parseInt(rgbvals[1]);
    var gval = parseInt(rgbvals[2]);
    var bval = parseInt(rgbvals[3]);

    var rHex = rval.toString(16);
    var gHex = gval.toString(16);
    var bHex = bval.toString(16);

    rHex = rHex.length == 1 ? "0" + rHex : rHex;
    gHex = gHex.length == 1 ? "0" + gHex : gHex;
    bHex = bHex.length == 1 ? "0" + bHex : bHex;

    return '#' + rHex + gHex + bHex;
}
},

/* @Prototype */
{

init: function (element, selectedColor) {
    this.selectColor(selectedColor);
},

addEventListener: function (event, callback) {
    this[event] = callback;
},

selectColor: function (color) {

    if (this.selectedCell) {
        this.selectedCell.removeClass('color_cell_selected');
    }
    this.selectedCell = $('.color_cell', this.element).filter(function () {
        return ColorPicker.rgbToHex($(this).css('background-color')) == color
    });
    this.selectedCell.addClass('color_cell_selected');

    if (this["select"]) {
        this["select"].call(this, ColorPicker.rgbToHex(this.selectedCell.css('background-color')))
    }
},

".color_cell mouseup": function (el, ev) {
    this.selectColor(ColorPicker.rgbToHex(el.css('background-color')));
},

".color_cell mouseover": function (el, ev) {
    if (el != this.selectedCell) {
        el.addClass('color_cell_selected');
    }
},

".color_cell mouseout": function (el, ev) {
    if (el.css('background-color') != this.selectedCell.css('background-color')) {
        el.removeClass('color_cell_selected');
    }
},

toggle: function () {
    this.element.toggle();
},

show: function () {
    this.element.show();
},

hide: function () {
    this.element.hide();
}


});


