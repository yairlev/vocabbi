/// <reference path="jquery.md5.js" />

$.Class("Tag",
{
},
{
    init: function (text, context, language, location, date) {
        this.text = text;
        this.context = context;
        this.language = language;
        this.location = location;
        this.date = date;
    },

    getHash: function () {
        return $.md5(this.text + this.context + this.language + this.location);
    }
});