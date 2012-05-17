$.Model("Tooltip",
{
    getPosition: function (ev) {
        return { left: ev.clientX, top: ev.clientY }
    },
    getDimentions: function (ev) {
        return { height:100, width:100 }
    }
},
{

})