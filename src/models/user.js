$.Class("User",
{

},
{
    init: function () {

        var me = this;
        this.settings = new SettingsProxy();

        $(document).bind('keydown', function (e) { me.key_down(e, me); });
        $(document).bind('keyup', function (e) { me.key_up(e, me); });
        $(document).bind('mousedown', function (e) { me._mousePos = { top: e.clientY, left: e.clientX } });
        $(document).bind('mouseup', function (e) { me.mouse_up(e, me); });
        document.addEventListener("contextmenu", function (e) {
            if (me.keyDown == me.settings.key_code) { e.preventDefault(); }
        });

        chrome.extension.sendRequest(
                {
                    op: "getTagsHashList"
                },
                function (tagHashList) {
                    me.tags.tagHashList = tagHashList;
                });
    },

    bind: function (event, callback, context) {
        this[event] = callback;
        this[event]['context'] = context;
    },

    key_down: function (e, me) {
        me.keyDown = e.keyCode;
    },

    key_up: function (e, me) {

        me.keyDown = null;

        if (e.keyCode == KeyCodes.ESCAPE) {
            if (me.unselect)
                me.unselect.call(me.unselect.context);
        }
    },

    mouse_up: function (e, me) {

        me.unselect.call(me.unselect.context, me.wrapper);

        if (me.keyDown == me.settings.key_code) {
            //if text was selected
            if (document.getSelection() && document.getSelection().toString() != '') {
                if (me.select) {

                    var rect;

                    if (document.activeElement.nodeName == "TEXTAREA" || document.activeElement.nodeName == "INPUT") {
                        var top = me._mousePos.top;
                        var left = me._mousePos.left;
                        var height = Math.abs(top - e.top);
                        var width = Math.abs(left - e.clientX);

                        rect = { top: top, left: left, height: height, width: width }
                    }
                    else {
                        rect = document.getSelection().getRangeAt(0).getBoundingClientRect();
                    }

                    me.select.call(me.select.context, document.getSelection().toString(), rect);
                }
            }
            //if text was not selected by the user prior to the mouse-up event
            else if (e.button == me.settings.mouse_button && e.target.nodeName.toLowerCase() != 'html' && e.target.nodeName.toLowerCase() != 'body'
                        && e.target.nodeName.toLowerCase() != 'script') {

                //Create a wrapper controller around the selected element
                var wrapper = me.wrapper = me.createWrapper(e);
                me.select.call(me.select.context, wrapper.element.text(), wrapper.element[0].getBoundingClientRect(), wrapper);
            }
        }
        else if (me.unselect) {

        }
    },

    createWrapper: function (e) {
        this.createTempWrappers(e.target);
        this.markElectedWrapper(e);

        //return innerHTML to original state except for the selected word	
        e.target.innerHTML = e.target.innerHTML.replace(/<em _type="vocabbi_temp_wrapper" class="vocabbi_wrapper" style="font: inherit">(.+?)<\/em>/g, '$1');

        var selectedElement = $('em[_type="vocabbi_temp_wrapper_selected"]', e.target);

        if (selectedElement) {
            //create the wrapper controller
            selectedElement.wrapper();
            return selectedElement.controller();
        }
        else {
            return null;
        }
    },

    createTempWrappers: function (target) {

        var NODETYPE_TEXT = 3;

        var unicodeLetterRegex = XRegExp("\\p{L}+");

        if (target.nodeType == NODETYPE_TEXT && unicodeLetterRegex.test(target.nodeValue)) {
            wordBoundryRegex = new XRegExp("(\\p{L}+)", "g");
            var newNodeStr = target.nodeValue.replace(wordBoundryRegex, '<em _type="vocabbi_temp_wrapper" class="vocabbi_wrapper" style="font: inherit">$1</em>');
            $(target).replaceWith(newNodeStr);

        }
        else {
            var childNodes = []

            for (var i = 0; i < target.childNodes.length; i++) {
                childNodes.push(target.childNodes[i]);
            }

            for (i = 0; i < childNodes.length; i++) {
                //Recursive call
                this.createTempWrappers(childNodes[i]);

            }
        }

    },

    markElectedWrapper: function (e) {
        var mouseTop = e.pageY;
        var mouseLeft = e.pageX;

        var tags = $(e.target).find('em[_type="vocabbi_temp_wrapper"]');

        for (var i = 0; i < tags.length; i++) {

            var tag = $(tags[i]);

            //Get the tag's absolute position.
            var tagPosition = tag.offset();

            var tagWidth = tag.width();
            var tagHeight = tag.height();

            if (mouseLeft >= tagPosition.left &&
                         mouseLeft <= tagPosition.left + tagWidth &&
                         mouseTop >= tagPosition.top &&
                         mouseTop <= tagPosition.top + tagHeight) {
                tag.attr('_type', 'vocabbi_temp_wrapper_selected');
                return tag[0];  
            }

        }
    },

    tags: {
        contain: function (tag) {
            return
        },

        set: function (tag) {
            
        }
    }
})

