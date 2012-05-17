$.Model("Translate",
{
    init: function () {
    },

    resultStatus: { OK: 200 },

    getTranslation: function (text, source_language, target_language, callback) {
        chrome.extension.sendRequest({
            op: "getTranslation",
            text: text,
            source_language: source_language,
            target_language: target_language
        },
        function (result) {
            callback.call(this, result);
        });
    },

    detectLanguage: function (text, callback) {
        chrome.extension.sendRequest({
            op: "detectLanguage",
            text: text
        },
        function (result) {
            callback.call(this, result.value);
        });
    },

    generateRequest: function (text, sourceLanguage, targetLanguage) {
        return 'https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=' + sourceLanguage + '&tl=' + targetLanguage + '&q=' + text;
    }
},
{

})