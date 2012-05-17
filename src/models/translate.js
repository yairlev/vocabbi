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
            callback.call(this, result.value);
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
        return "http://translate.google.com/?sl=" + sourceLanguage + "&tl=" + targetLanguage + "&text=" + text;
    }
},
{

})