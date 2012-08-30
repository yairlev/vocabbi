$.Class.extend('Speech',
{
    loadSpeechFile: function (text, language, callback) {
        Speech.text = text;
        if (!Speech.audioElement) {
            Speech.audioElement = document.createElement('audio');
        }
        //        $(Speech.audioElement).bind('progress', function () {
        //            if (Speech.audioElement.buffered.end(0) == Speech.audioElement.duration) {
        //                callback.call(this);
        //            }
        //        });
        Speech.audioElement.setAttribute('src', Speech.composeUrl(text, language));
        Speech.audioElement.load();
    },

    play: function (text, language) {
        Speech.text = text;

        if (!Speech.audioElement) {
            Speech.audioElement = document.createElement('audio');
        }

        Speech.audioElement.setAttribute('src', Speech.composeUrl(text, language));
        Speech.audioElement.play();
    },

    composeUrl: function (text, language) {
        return 'http://api.microsofttranslator.com/V2/http.svc/Speak?oncomplete=Speech.onSpeechComplete&appId=3AFAC12D1A7C674242EE37C45BD5E3293DDF4A74&text=' + text + "&language=" + language;
    }
},
{

});