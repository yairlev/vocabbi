if  "%1"==""  goto  noparameter
e:
cd /d %0\..
mkdir vocabbi_"%1"
mkdir vocabbi_"%1"\controllers
mkdir vocabbi_"%1"\models
mkdir vocabbi_"%1"\resources

java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js controllers\colorpicker_controller.js --js_output_file vocabbi_"%1"\controllers\colorpicker_controller.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js controllers\preferences_controller.js --js_output_file vocabbi_"%1"\controllers\preferences_controller.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js controllers\vocabbi_document_controller.js --js_output_file vocabbi_"%1"\controllers\vocabbi_document_controller.js 
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js controllers\vocabbi_tooltip_controller.js --js_output_file vocabbi_"%1"\controllers\vocabbi_tooltip_controller.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js controllers\wrapper_controller.js  --js_output_file vocabbi_"%1"\controllers\wrapper_controller.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js models\google_translate.js --js_output_file vocabbi_"%1"\models\google_translate.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js models\key_codes.js --js_output_file vocabbi_"%1"\models\key_codes.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js models\language_codes.js --js_output_file vocabbi_"%1"\models\language_codes.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js models\omnibox.js --js_output_file vocabbi_"%1"\models\omnibox.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js models\settings.js --js_output_file vocabbi_"%1"\models\settings.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js models\tooltip.js --js_output_file vocabbi_"%1"\models\tooltip.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js models\user.js --js_output_file vocabbi_"%1"\models\user.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\background.js --js_output_file vocabbi_"%1"\resources\background.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\google_dictionary.js --js_output_file vocabbi_"%1"\resources\google_dictionary.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\jquery.class.js --js_output_file vocabbi_"%1"\resources\jquery.class.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\jquery.controller.js --js_output_file vocabbi_"%1"\resources\jquery.controller.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\jquery.controller.view.js --js_output_file vocabbi_"%1"\resources\jquery.controller.view.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\jquery.dom.js --js_output_file vocabbi_"%1"\resources\jquery.dom.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\jquery.event.js --js_output_file vocabbi_"%1"\resources\jquery.event.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\jquery.event.destroyed.js --js_output_file vocabbi_"%1"\resources\jquery.event.destroyed.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\jquery.lang.js --js_output_file vocabbi_"%1"\resources\jquery.lang.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\jquery.lang.openajax.js --js_output_file vocabbi_"%1"\resources\jquery.lang.openajax.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\jquery.lang.rsplit.js --js_output_file vocabbi_"%1"\resources\jquery.lang.rsplit.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\jquery.md5.js --js_output_file vocabbi_"%1"\resources\jquery.md5.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\jquery.model.js --js_output_file vocabbi_"%1"\resources\jquery.model.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\jquery.unescape.js --js_output_file vocabbi_"%1"\resources\jquery.unescape.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\jquery.view.ejs.js --js_output_file vocabbi_"%1"\resources\jquery.view.ejs.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\jquery.view.js --js_output_file vocabbi_"%1"\resources\jquery.view.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\settings_proxy.js --js_output_file vocabbi_"%1"\resources\settings_proxy.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\speech.js --js_output_file vocabbi_"%1"\resources\speech.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\tag.js --js_output_file vocabbi_"%1"\resources\tag.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\xregexp-unicode.js --js_output_file vocabbi_"%1"\resources\xregexp-unicode.js
java -jar "E:\Downloads\Closure Compiler\compiler.jar" --js resources\xregexp.js --js_output_file vocabbi_"%1"\resources\xregexp.js

copy /y resources\jquery-1.6.1.min.js vocabbi_"%1"\resources\jquery-1.6.1.min.js
copy /y resources\google_jsapi.js vocabbi_"%1"\resources\google_jsapi.js
copy /y resources\jquerymx-1.0.custom.min.js vocabbi_"%1"\resources\jquerymx-1.0.custom.min.js

copy *.html vocabbi_"%1"
copy *.htm vocabbi_"%1"
copy manifest.json vocabbi_"%1"
xcopy /s /i /y style vocabbi_"%1"\style
xcopy /s /i /y images vocabbi_"%1"\images
xcopy /s /i /y views vocabbi_"%1"\views

cd vocabbi_"%1"

..\VersionChanger.exe "manifest.json" "%1"

wzzip -rp vocabbi_"%1".zip *.*

PAUSE
goto exit

:noparameter
echo please supply a release version
PAUSE

:exit