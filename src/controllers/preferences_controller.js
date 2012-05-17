$.Controller.extend('Preferences',
/* @Static */
{

},

/* @Prototype */
{
    init: function () {
        var me = this;
        this.tooltipColor = Settings.get_tooltipColor();
        this.colorPicker = $('.color_picker').color_picker(this.tooltipColor).controller();
        this.colorPicker.addEventListener("select", function (color) {
            me.tooltipColor = color;
            me.colorPicker.hide();
            $('.current_color_container').css('background-color', color);
            //me.tooltipController.setBackgroundColor(color);
            Settings.set_tooltipColor(me.tooltipColor);
        });

        //get the language pairs
        this._add_language_pairs(Settings.get_language_pairs());

        this.default_language = Settings.get_default_language();

        $('#default_lang').val(this.default_language);

        $('#default_lang').change(function() {
            Settings.set_default_language($(this).val());
            //me.default_language = $(this).val();
        });

        $('.key_codes').val(Settings.get_keyCode());

        $('.key_codes').change(function() {
            Settings.set_keyCode($(this).val());
        });

        $('.font_size').val(Settings.get_fontSize());

        $('.font_size').change(function() {
            Settings.set_fontSize($(this).val());
        });

        $('.current_color_container').css('background-color', Settings.get_tooltipColor());
        $('.color_container').click(function () { event.stopImmediatePropagation(); me.colorPicker.toggle(); });

        $(document.body).click(function () { me.colorPicker.hide(); });
    },

    ready: function () {
        var me = this;
        var rootPath = chrome.extension.getURL("/");
        var viewUrl = chrome.extension.getURL('views/vocabbi_tooltip/tooltip');
        var params = { text: null, background_color: Settings.get_tooltipColor(), root_path: rootPath }
        this.tooltip = $($.View(viewUrl, params)).hide();
        $(document.body).append(this.tooltip);
        /*this.tooltipController = this.tooltip.vocabbi_tooltip().controller();
        this.tooltipController.addEventListener('textSelect', function (text, language) {
            var requestUrl = createRequestUrl(text, language);
            //open the google dictionary in a new tab.
            window.open(requestUrl);
        });*/

        $('#add_language_pair').click(function () {
            var source_lang = $('#source_lang').val();
            var target_lang = $('#target_lang').val();
            me._add_language_pairs([{ 'src': source_lang, 'target': target_lang}]);
        });

        //    window.setTimeout(function () { me.setTooltipContent(Settings.get_language()); }, 100);


        //    $('.languages').change(function () {
        //        me.setTooltipContent();
        //    });

        //    $('.font_size').change(function () {
        //        me.setTooltipContent();
        //    });
    },

    setTooltipContent: function () {
        var me = this;
        var rect = $('.sample_text')[0].getBoundingClientRect();
        console.log('rect- ' + rect.left + ' ' + rect.top);
        var text = $('.sample_text').text();
        var fontSize = $('.font_size').val();
        var language = $('.languages').val();

        google.language.translate(text, 'en', language,
            function (result) {
                me.tooltipController.showTooltip(rect);
                me.tooltipController.setContent(text, 'en', result.translation, language, fontSize);
                me.tooltipController.setPosition();
            }
        );
    },

    _add_language_pairs: function (language_pairs) {
        var me = this;

        var language_pairs_model = [];

        //update the source language select box. Remove the languages that were added.
        $.each(language_pairs,
            function (index, item) {
                var srcLang = LanguageCodes.getName(item.src);
                var targetLang = LanguageCodes.getName(item.target);
                language_pairs_model.push({ 'src': item.src, 'target': item.target, 'src_name': srcLang, 'target_name': targetLang });

                $.each($('#source_lang option'), function (index, elem) {
                    if ($(elem).val() == item.src)
                        $(elem).hide();
                });

            });

        //show the language pairs
        for (var language_pair in language_pairs_model) {
            var elem = $('.language_pairs').append('//views/preferences/language_pair.ejs', { 'pair': language_pairs_model[language_pair] })

            //set the remove event handler
            elem.find('.remove').click(function (e) {
                var pair = e.target.attributes['pair'].value.split('_');
                me.language_pairs = $.grep(me.language_pairs, function (elem, index) {
                    return (pair[0] != elem.src && pair[1] != elem.target);
                });

                $(e.target).parent('div').remove();

                $('#source_lang option[value=' + pair[0] + ']').show();

                $.each($("#source_lang option"), function (index, elem) {

                    if ($(elem).css('display') != 'none') {
                        $('#source_lang').val($(elem).val());
                        return false;
                    }
                });

                Settings.set_language_pairs(me.language_pairs);
            });
        }

        if (language_pairs && language_pairs.length > 0) {
            $.each($("#source_lang option"), function (index, elem) {
                if ($(elem).css('display') != 'none') {
                    $('#source_lang').val($(elem).val());
                    return false;
                }
            });

        }
        else {
            $('#source_lang').val('en');
            $('#target_lang').val('es');
        }

        //$('#source_lang').val($("#source_lang option:visible:first").val());

        if (!this.language_pairs) {
            this.language_pairs = language_pairs;
        }
        else {
            $.merge(this.language_pairs, language_pairs);
        }

        Settings.set_language_pairs(this.language_pairs);
    }

    /*".save click": function (el, ev) {

        Settings.set_default_language(this.default_language);

        Settings.set_language_pairs(this.language_pairs);

        Settings.set_tooltipColor(this.tooltipColor);

        var keyCode = $('.key_codes option:selected').val();
        Settings.set_keyCode(keyCode);

        var fontSize = $('.font_size option:selected').val();
        Settings.set_fontSize(fontSize);

        $('.save_message').css('left', ($(document).width() / 2 - $('.save_message').outerWidth() / 2) + 'px');
        $('.save_message').show(0, function () { window.setTimeout("$('.save_message').hide()", 5000); });

    },*/

    /*".cancel click": function () {
        chrome.tabs.getSelected(null, function (tab) { chrome.tabs.remove(tab.id); });
    }*/
});


