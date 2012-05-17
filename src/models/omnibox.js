$.Class("Omnibox",
{

},
{
    init: function () {
        chrome.omnibox.onInputStarted.addListener(this.onInputStarted);
        chrome.omnibox.onInputEntered.addListener(this.onInputEntered);
        chrome.omnibox.onInputChanged.addListener(this.onInputChanged);
        chrome.omnibox.onInputCancelled.addListener(this.onInputCancelled);
    },

    onInputEntered: function (text) {

        var gotoGoogleDictionary = function (tabId, sourceLanguage, text) {
            var sourceLanguageObj = GoogleDictionary.sourceLanguages.get(sourceLanguage);
            //set default target language to english
            var targetLanguage = 'en';
            if (sourceLanguageObj) {
                if (sourceLanguageObj.targetLanguages.contains(Settings.get_language())) {
                    targetLanguage = Settings.get_language();
                }
            }
            var url = 'https://www.google.com/search?defl=' + sourceLanguage + '&hl=' + targetLanguage + '&q=' + text + '&tbo=1&tbs=dfn:1';
            chrome.tabs.update(tabId, { url: url });
        }

        var match = text.match(/\{\{(.+)\}\}/);

        if (match && match[1]) {
            var word = text.replace(/\{\{(.+)\}\}/, '');
            gotoGoogleDictionary(Omnibox.selectedTabId, match[1], word);
        }
        else {
            gotoGoogleDictionary(Omnibox.selectedTabId, Omnibox.textLanguage, text);

        }
    },

    onInputChanged: function (text, suggest) {
        if (text != "") {
            google.language.detect(text, function (result) {

                Omnibox.textLanguage = result.language;

                console.log(result.language);

                var suggestions = [];

                chrome.omnibox.setDefaultSuggestion({ description: 'Search for the word <match>' + text + ' (' + LanguageCodes[result.language] + ')</match> in Google Dictionary' });

                if (LanguageCodes[result.language] != LanguageCodes[Omnibox.pageLanguage]) {
                    suggestions.push({ content: text + "{{" + Omnibox.pageLanguage + "}}", description: 'Search for the word <match>' + text + ' (' + LanguageCodes[Omnibox.pageLanguage] + ')</match> in Google Dictionary' })
                    suggest(suggestions);
                }
            });
        }
    },

    onInputStarted: function () {
        chrome.tabs.getSelected(null, function (tab) {

            Omnibox.selectedTabId = tab.id;

            chrome.tabs.detectLanguage(tab.id, function (language) {
                //chrome.omnibox.setDefaultSuggestion({ "description": "Search for a word definition (" + language + ") in Google Dictionary" });    
                Omnibox.pageLanguage = language;
            });
        });
    },

    onInputCancelled: function () {
        //Omnibox.selectedTabId = null;
        //console.log(Omnibox.selectedTabId);
        //Omnibox.pageLanguage = null;
    }
})