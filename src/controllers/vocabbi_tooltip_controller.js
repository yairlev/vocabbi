/// <reference path="../../jquery/jquery.js" />
/// <reference path="../../jquery/view/view.js" />

/**
* @tag controllers, home
*/
$.Controller.extend('VocabbiTooltip',
/* @Static */
{

},
/* @Prototype */
{
    init: function () {

        var me = this;

        //handle the Star click
        $('.vocabbi-tooltip-a', this.element).mouseup(function (event) { event.stopImmediatePropagation(); me.onStarClick(); });

        //handle the Star click
        $('.vocabbi-speaker', this.element).mouseup(function (event) {
            event.stopImmediatePropagation();
            me.onSpeakClick.call(me);
        });
    },

    onStarClick: function () {

    },

    onSpeakClick: function () {
        Speech.play(this.sourceText, this.sourceLanguage);
    },

    showTooltip: function (rect) {

        this.rect = rect;

        tootipTopHover = 10;

        if (!this.arrow) {
            //Create the new arrow
            var arrowColor = $('.vocabbi-tooltip-a', this.element).css('background-color') + " transparent";
            this.arrow = $('<div\>').addClass('vocabbi_element vocabbi-tooltip-down')
            this.arrow.css('border-color', arrowColor);
        }

        this.element.parent().append(this.arrow);

        this.setContent();

        this.setPosition();

        this.element.show();
        this.arrow.show();
    },

    addEventListener: function (event, callback) {
        this[event] = callback;
    },


    hideToolTip: function () {
        //remove tooltip
        if (this.element)
            this.element.hide();

        //remove arrow
        if (this.arrow)
            this.arrow.hide();
    },

    setContent : function (sourceText, sourceLanguage, targetText, targetLanguage, fontSize) {

        var me = this;

        this.sourceText = sourceText;

        this.sourceLanguage = sourceLanguage;

        //set language direction
        if (LanguageCodes.isRTL(targetLanguage)) {
            $('.vocabbi-tooltip-b', this.element).css('direction', 'rtl');
        }
        else {
            $('.vocabbi-tooltip-b', this.element).css('direction', '');
        }

        if (sourceLanguage == 'en' && sourceText != '') {
            Speech.loadSpeechFile(sourceText, 'en');
            $('.vocabbi-speaker', this.element).show();
        }
        else {
            $('.vocabbi-speaker', this.element).hide();
        }

        text = targetText || '&nbsp';
        var content = text != '&nbsp' ? '<span style="font-size:' + fontSize + 'px;" class="vocabbi_element vocabbi_content_ref">' + text + '</span>' : '<span style="font-size:' + fontSize + 'px;">' + text + '</span>';

        var rectWidth = this.rect.width;

        var tooltipWidth;

        if (rectWidth > 300) {
            var tooltipWidth = rectWidth + $('.vocabbi-tooltip-a').outerWidth() + $('.vocabbi-tooltip-c').outerWidth();

            if (tooltipWidth > $(document).width()) {
                tooltipWidth = $(document).width();
            }
        }
        else {
            var contentElement = $(content).hide();

            $(document.body).append(contentElement);

            tooltipWidth = contentElement.outerWidth() + 5 + $('.vocabbi-tooltip-a').outerWidth() + $('.vocabbi-tooltip-c').outerWidth();

            contentElement.remove();
        }

        this.element.css('width', tooltipWidth + 'px');



        //set the content into the tooltip
        $('.vocabbi-tooltip-b', this.element).html(content);
        $('.vocabbi_content_ref').mouseup(function () {
            //prevent event propogation.
            event.stopImmediatePropagation();

            if (me['textSelect']) {
                me['textSelect'].call(me, sourceText, sourceLanguage);
            }
        });

    },

    setPosition: function () {
        //set the tooltip position

        var rect = this.rect;
        var arrow = this.arrow;

        var delta = (this.element.outerWidth() - this.rect.width) / 2;

        var tooltipLeft;

        var shiftLeft = $(document).width() - (rect.left - delta + this.element.outerWidth());


        if (shiftLeft < 0) { //tooltip is shifting out of left window boundries
            tooltipLeft = rect.left - delta + shiftLeft;
        }
        else {
            tooltipLeft = rect.left - delta;
        }

        if (tooltipLeft < 0)
            tooltipLeft = 0;

        this.element.css('left', tooltipLeft + 'px');

        var tooltipTop = rect.top - this.element.outerHeight() - arrow.outerHeight() - tootipTopHover;

        if (tooltipTop < 0) {
            tooltipTop = rect.top + $(document).scrollTop() + rect.height + arrow.outerHeight() + tootipTopHover;
        }
        else {
            tooltipTop += $(document).scrollTop();
        }

        this.element.css('top', tooltipTop + 'px');

        //set the arrow position

        var arrowLeft = rect.left + (rect.width / 2) - (arrow.outerWidth() / 2);
        var arrowTop;


        if (this.element.position().top < rect.top + $(document).scrollTop()) {
            arrow.attr('class', 'vocabbi_element vocabbi-tooltip-down');
            arrowTop = rect.top + $(document).scrollTop() - arrow.outerHeight() - tootipTopHover;

        }
        else {
            arrow.attr('class', 'vocabbi_element vocabbi-tooltip-up');
            arrowTop = rect.top + $(document).scrollTop() + rect.height + tootipTopHover;
        }

        arrow.css('left', arrowLeft + 'px');
        arrow.css('top', arrowTop + 'px');
    },

    setBackgroundColor: function (color) {
        $('.vocabbi-tooltip-a').css('background-color', color);
        $('.vocabbi-tooltip-b').css('background-color', color);
        $('.vocabbi-tooltip-c').css('background-color', color);
        this.arrow.css('border-color', color + ' transparent');
    }
});