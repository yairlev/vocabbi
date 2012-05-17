$.Class("Settings",
{
    tooltipDefaultColor: "#2B78E4",
    defaultLanguagePair: [{ src: "en", target: "en"}],
    defaultMouseButton: 2,
    defaultFontSize: 14,

    get_keyCode: function () {
        return localStorage["keyCode"] || KeyCodes.CTRL;
    },

    set_keyCode: function (value) {
        localStorage["keyCode"] = value;
        Settings._onUpdate({ key: "key_code", value: value });
    },

    get_tooltipColor: function () {
        return localStorage["tooltipColor"] || Settings.tooltipDefaultColor;
    },

    set_tooltipColor: function (value) {
        localStorage["tooltipColor"] = value;
        Settings._onUpdate({ key: "tooltip_color", value: value });
    },

    get_fontSize: function () {
        return localStorage["font_size"] || Settings.defaultFontSize;
    },

    set_fontSize: function (value) {
        localStorage["font_size"] = value;
        Settings._onUpdate({ key: "font_size", value: value });
    },

    get_language_pairs: function () {
        //if (localStorage["language_pairs"]) {
            return JSON.parse(localStorage["language_pairs"]) || [];
        //}
        //else {
            //return Settings.defaultLanguagePair;
        //}

    },

    get_default_language: function () {
        return localStorage["default_language"] || LanguageCodes.getCode(LanguageCodes.en);
    },

    set_default_language: function (languageCode) {
        localStorage["default_language"] = languageCode;
        Settings._onUpdate({ key: "default_language", value: languageCode });
    },

    set_language_pairs: function (language_pairs) {
        localStorage["language_pairs"] = JSON.stringify(language_pairs);
        Settings._onUpdate({ key: "language", value: language_pairs });
    },

    get_mouse_button: function () {
        return localStorage["mouse_button"] || Settings.defaultMouseButton;
    },

    get_settings: function () {
        return {
            'key_code': this.get_keyCode(),
            'default_language' : this.get_default_language(),
            'language_pairs': this.get_language_pairs(),
            'tooltip_color': this.get_tooltipColor(),
            'font_size': this.get_fontSize(),
            'mouse_button': this.get_mouse_button()
        }
    },

    _onUpdate: function (data) {
        data['op'] = 'settingsUpdate';
        chrome.windows.getAll(null, function (windows) {
            for (var win in windows) {
                //get all tabs in the current window
                chrome.tabs.getAllInWindow(windows[win].id, function callback(tabs) {
                    for (var tab in tabs) {
                        //send settings updates to all open tabs in the current window
                        console.log(data['key']);
                        chrome.tabs.sendRequest(tabs[tab].id, data);
                    }
                });
            }
        });
    }
},
{

})
