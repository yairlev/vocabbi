$.Class("SettingsProxy",
{
    
},
{
    init: function()
    {
        var me = this;

        chrome.extension.sendRequest(
                {
                    op: "getSettings"
                },
                function (settings) {
                    me.key_code = settings.key_code;
                    me.tooltip_color = settings.tooltip_color;
                    me.default_language = settings.default_language;
                    me.language_pairs = settings.language_pairs;
                    me.mouse_button = settings.mouse_button;
                    me.font_size = settings.font_size;
                }
           );

        chrome.extension.onRequest.addListener(
            function (request, sender, sendResponse) {
                if (request['op'] == 'settingsUpdate')
                {
                    console.log('received - ' + request['key']);
                    me[request['key']] = request['value'];
                }
        });
    }

})
