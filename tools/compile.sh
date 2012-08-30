#!/bin/sh

src=../src
cntr=$src/controllers
mdl=$src/models
rcs=$src/resources

java -jar compiler.jar --js $rcs/jquery-1.7.1.min.js $rcs/jquerymx-1.0.custom.min.js $rcs/jquery.lang.js $rcs/jquery.lang.openajax.js $rcs/jquery.lang.rsplit.js $rcs/jquery.md5.js $rcs/jquery.unescape.js $rcs/xregexp.js $rcs/xregexp-unicode.js $rcs/speech.js $rcs/settings_proxy.js $rcs/google_dictionary.js $cntr/colorpicker_controller.js $cntr/preferences_controller.js $cntr/vocabbi_document_controller.js $cntr/vocabbi_tooltip_controller.js $cntr/wrapper_controller.js $mdl/translate.js $mdl/key_codes.js $mdl/language_codes.js $mdl/omnibox.js $mdl/settings.js $mdl/tooltip.js $mdl/user.js  $rcs/tag.js   --js_output_file $src/vocabbi.js