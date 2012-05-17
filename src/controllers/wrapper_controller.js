$.Controller.extend('Wrapper',
/* @Static */
{

},

/* @Prototype */
{

init: function () {

},

select: function () {
    this.element.attr('class', 'vocabbi_wrapper_selected');
    //this.element.css('background', '#3297fd');
    //this.element.css('color', '#ffffff');
},

isSelected: function () {
    return this.element.attr('class') == 'vocabbi_wrapper_selected';
},

close: function () {
    if (this.element)
        this.element.replaceWith(this.element.text());
}

});