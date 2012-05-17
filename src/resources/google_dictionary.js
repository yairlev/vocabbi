/// <reference path="../models/language_codes.js" />

$.Class("GoogleDictionary",
{
    sourceLanguages: {
        get: function (language) {
            for (var i = 0; i < GoogleDictionary.sourceLanguagesArr.length; i++) {
                if (GoogleDictionary.sourceLanguagesArr[i][language] != undefined) {
                    return {
                        targetLanguages: {
                            contains: function (targetLanguage) {
                                for (var j = 0; j < GoogleDictionary.sourceLanguagesArr[i][language].length; j++) {
                                    if (GoogleDictionary.sourceLanguagesArr[i][language][j] == targetLanguage) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                        }
                    }
                }
            }
            return null;
        }
    },

    sourceLanguagesArr: [{ 'ar': ['en'] }, { 'bn': ['en'] }, { 'bg': ['en'] }, { 'zh-CN': ['zh-CN', 'en'] }, { 'zh-TW': ['zh-TW', 'en'] }, { 'hr': ['en'] }, { 'cs': ['cs', 'en'] },
        { 'nl': ['nl'] }, { 'en': ['ar', 'bn', 'bg', 'zh--CN', 'zh-TW', 'en', 'hr', 'cs', 'nl', 'fi', 'fr', 'de', 'el', 'gu', 'iw', 'hi', 'it', 'kn', 'ko', 'ml', 'mr', 'pt', 'ru', 'sr', 'sk', 'es', 'ta', 'te', 'th'] },
        { 'fi': 'en' }, { 'fr': ['fr', 'en'] }, { 'de': ['de', 'en'] }, { 'el': ['en'] }, { 'gu': ['en'] }, { 'iw': ['en'] },
        { 'hi': ['en'] }, { 'it': ['it', 'en'] }, { 'kn': ['en'] }, { 'ko': ['ko', 'en'] }, { 'ml': ['en'] }, { 'mr': ['en'] }, { 'pt': ['pt', 'en'] },
        { 'ru': ['ru', 'en'] }, { 'sr': ['en'] }, { 'sk': ['sk'] }, { 'es': ['es', 'en'] }, { 'ta': ['en'] }, { 'te': ['en'] }, { 'th': ['en']}],

    generateRequest: function (text, sourceLanguage, targetLanguage) {
        return "http://www.google.com/dictionary?langpair=" + sourceLanguage + "|" + targetLanguage + "&q=" + text + "&hl=" + sourceLanguage + "&aq=f";
    }
},
{
    init: function () {

    }

})
