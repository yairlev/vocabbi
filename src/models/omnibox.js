$.Class("Omnibox",
{
},
{
    init: function () {
        var self = this;

        chrome.omnibox.onInputStarted.addListener(this.onInputStarted);
        chrome.omnibox.onInputEntered.addListener(function(text) { self.onInputEntered.call(self, text); });
        chrome.omnibox.onInputChanged.addListener(function(text, suggest) { self.onInputChanged.call(self, text, suggest); });
        //chrome.omnibox.onInputCancelled.addListener(this.onInputCancelled);
    },

    onInputEntered: function (text) {
        var gotoGoogleDictionary = function (tabId, sourceLanguage, text) {
            var sourceLanguageObj = GoogleDictionary.sourceLanguages.get(sourceLanguage);

            var targetLanguage = 'en';

            if (sourceLanguageObj) {
                if (sourceLanguageObj.targetLanguages.contains(Settings.get_default_language())) {
                    targetLanguage = Settings.get_default_language();
                }
            }
            var url = 'https://www.google.com/search?defl=' + sourceLanguage + '&hl=' + targetLanguage + '&q=' + text + '&tbo=1&tbs=dfn:1';
            chrome.tabs.update(tabId, { url: url });
        }

        var match = text.match(/\{\{(.+)\}\}/);

        if (match && match[1]) {
            var word = text.replace(/\{\{(.+)\}\}/, '');
            gotoGoogleDictionary(Omnibox.selectedTabId, match[1], word);
        } else {
            gotoGoogleDictionary(Omnibox.selectedTabId, Omnibox.textLanguage, text);
        }
    },

    onInputChanged: function (text, suggest) {
        if (text != "") {
            this.getTranslation(text, 'auto', 'en',
                function (result) {
                    if (result.success) {
                        var language = result.source_language;
                        console.log('detected language: ' + language);

                        Omnibox.textLanguage = language;

                        var suggestions = [];

                        chrome.omnibox.setDefaultSuggestion({ description: 'Search for the word <match>' + text + ' (' + LanguageCodes[language] + ')</match> in Google Dictionary' });

                        if (language && Omnibox.pageLanguage && LanguageCodes[language] != LanguageCodes[Omnibox.pageLanguage]) {
                            suggestions.push({ content: text + "{{" + Omnibox.pageLanguage + "}}", description: 'Search for the word <match>' + text + ' (' + LanguageCodes[Omnibox.pageLanguage] + ')</match> in Google Dictionary' })
                            suggest(suggestions);
                        }
                    }
                }
            );
        }
    },

    onInputStarted: function () {
        chrome.tabs.getSelected(null, function (tab) {
            Omnibox.selectedTabId = tab.id;

            chrome.tabs.detectLanguage(tab.id, function (language) {
                console.log('page language: ' + language);

                Omnibox.pageLanguage = language;
            });
        });
    },

    onInputCancelled: function () {
        /*
        Omnibox.selectedTabId = null;
        console.log(Omnibox.selectedTabId);
        Omnibox.pageLanguage = null;
        */
    },

    getTranslation: function (text, source_language, target_language, callback) {
        $.ajax({
            url: 'https://clients5.google.com/translate_a/t',
            data: 'client=dict-chrome-ex&sl=' + source_language + '&tl=' + target_language + '&q=' + text,
            type: 'GET',
            complete: function(jqXHR, textStatus) {
                var result = {};

                if (jqXHR.responseText) {
                    var json = $.parseJSON(jqXHR.responseText);
                    result.success = true;
                    result.translation = json.sentences[0].trans;
                    result.source_language = json.src;
                } else {
                    result.success = false;
                }

                callback(result);
            }
        });
    }
})