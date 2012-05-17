/// <reference path="../../jquery/jquery.js" />
/// <reference path="../../jquery/view/view.js" />
/// <reference path="../models/translate.js" />

/**
* @tag controllers, home
*/

$.Controller.extend('VocabbiDocument',
/* @Static */
{
    onDocument: true
},
/* @Prototype */
{
    init: function () {
        this.settingsProxy = new SettingsProxy();
    },

    "{document} ready": function () {
        this.user = new User();
        this.user.bind('select', this.on_select, this);
        this.user.bind('unselect', this.on_unselect, this);
    },

    getContext: function (element, maxCharacters) {
        var isInlineElement = function (element) {
            if (!element)
                return false;

            var nodeName = element.nodeName.toUpperCase();

            if (nodeName == "A" || nodeName == "ABBR" || nodeName == "ACRONYM" || nodeName == "B" || nodeName == "BASEFONT" || nodeName == "BDO" ||
                nodeName == "BIG" || nodeName == "BR" || nodeName == "CITE" || nodeName == "CODE" || nodeName == "DFN" || nodeName == "EM" ||
                nodeName == "FONT" || nodeName == "I" || nodeName == "IMG" || nodeName == "INPUT" || nodeName == "KBD" || nodeName == "LABEL" ||
                nodeName == "Q" || nodeName == "S" || nodeName == "SAMP" || nodeName == "SELECT" || nodeName == "SMALL" || /*nodeName == "SPAN" ||*/
                nodeName == "STRIKE" || nodeName == "STRONG" || nodeName == "SUB" || nodeName == "SUP" || nodeName == "TEXTAREA" || nodeName == "TT" ||
                nodeName == "u" || nodeName == "var")
                return true;

            return false;
        }

        var getFirstBlockAncestorElement = function (element) {
            while (element.parentNode) {
                if (!isInlineElement(element.parentNode))
                    return element.parentNode;
                element = element.parentNode;
            }

            return null;
        }

        element = isInlineElement(element) ? getFirstBlockAncestorElement(element) : element;

        element = element.cloneNode(true);

        element.innerHTML = element.innerHTML.replace(/<em _type="vocabbi_temp_wrapper_selected".*?>(.+?)<\/em>/g, '$1');

        var cleanTextExp = new RegExp("\\s{2,}", "g");

        function cleanText(text) {
            text = text || "";
            return $.trim(text.replace(cleanTextExp, " "));
        }

        var result = cleanText(element.innerText);

        if (maxCharacters && result)
            result = result.substring(0, maxCharacters - 1);

        element = null;

        return result;
    },

    on_select: function (text, rect, wrapper) {
        var me = this;

        if (wrapper)
            wrapper.select();

        var showTooltip = function () {
            me.tooltipController.showTooltip(rect, me.settingsProxy.tooltip_color);

            var context;

            if (wrapper)
                context = me.getContext(wrapper.element[0], 100);
            else
                context = text;

            console.log('context:' + context);

            var target = me.settingsProxy.default_language;

            Translate.getTranslation(text, 'auto', target,
                function (result) {
                    if (result.success) {
                        var source = result.source_language;

                        var res = $.grep(me.settingsProxy.language_pairs, function (elem, index) {
                            return elem.src == source;
                        });

                        if (res.length > 0) {
                            target = res[0].target;

                            Translate.getTranslation(text, source, target,
                                function (result) {
                                    if (result.success) {
                                        me.tooltipController.setContent(text, source, result.translation, target, me.settingsProxy.font_size);
                                        me.tooltipController.setPosition();
                                    }
                                }
                            );
                        } else {
                            me.tooltipController.setContent(text, source, result.translation, target, me.settingsProxy.font_size);
                            me.tooltipController.setPosition();
                        }
                    }
                }
            );
        }

        if (!this.tooltipController) {
            var rootPath = chrome.extension.getURL("/");

            var setTooltipController = function (html) {
                var tooltip = $(html).appendTo(document.body);
                me.tooltipController = tooltip.vocabbi_tooltip().controller();
                me.tooltipController.addEventListener("textSelect", function (text, language) {
                    var requestUrl = createRequestUrl(text, language);
                    //open the google dictionary in a new tab.
                    window.open(requestUrl);
                });
            }

            chrome.extension.sendRequest(
                {
                    op: "getView",
                    url: chrome.extension.getURL('views/vocabbi_tooltip/tooltip'),
                    params: { text: null, background_color: me.settingsProxy.tooltip_color, root_path: rootPath }
                },
                function (result) {
                    setTooltipController(result);
                    showTooltip();
                }
           );
        }
        else {
            showTooltip();
        }
    },

    on_unselect: function (wrapper) {
        if (this.tooltipController)
            this.tooltipController.hideToolTip();
        if (wrapper) {
            wrapper.close();
            wrapper = null;
        }
    }
});