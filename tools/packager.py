import base64
from contextlib import closing
import getopt
import os
import re
import shutil
import sys
from zipfile import ZipFile, ZIP_DEFLATED

__author__ = 'Yair Levinson'

FILES = ['resources/jquery-1.7.1.min.js', 'resources/jquerymx-1.0.custom.min.js', 'resources/jquery.lang.js',
         'resources/jquery.lang.openajax.js', 'resources/jquery.lang.rsplit.js', 'resources/jquery.md5.js',
         'resources/jquery.unescape.js','resources/xregexp.js', 'resources/xregexp-unicode.js', 'resources/speech.js',
         'resources/settings_proxy.js', 'controllers/colorpicker_controller.js', 'controllers/preferences_controller.js',
         'controllers/vocabbi_document_controller.js', 'controllers/vocabbi_tooltip_controller.js', 'controllers/wrapper_controller.js',
         'models/translate.js', 'models/key_codes.js', 'models/language_codes.js' ,'models/omnibox.js',
         'models/settings.js', 'models/tooltip.js', 'models/user.js', 'resources/background.js', 'resources/tag.js']

def main(argv):

    try:
        opts, args = getopt.getopt(argv, "d:v:")
    except getopt.GetoptError as err:
        print (err)
        sys.exit(2)
        
    for o, a in opts:
        if o == "-v":
            version = a
        elif o == "-d":
            srcRoot = a

    outputJSName = 'vocabbi.js'

    targetFolderName = 'vocabi_{0}_{1}'.format(version, base64.urlsafe_b64encode(os.urandom(3)))

    #copy all files from source-dir to target-dir
    shutil.copytree(srcRoot, targetFolderName, ignore=shutil.ignore_patterns('.idea', 'workspace.xml'))
    
    #concatanate the srcRoot to all files
    files = map(lambda f: os.path.join(targetFolderName, f) ,FILES)

    #generate the command string
    command = 'java -jar compiler.jar --js {0} --js_output_file {1}'.format( ' '.join(files),  os.path.join(targetFolderName, outputJSName))

    #run command
    os.system(command)

    versionPattern = '"version"\s*:.+?,'
    jsPattern = '"js":.+?\]'

    input = open(os.path.join(targetFolderName, 'manifest.json'))

    inputText = input.read()

    input.close()

    text = re.sub(versionPattern, '"version":"{0}",'.format(version) , inputText)

    text = re.sub(jsPattern, '"js": [ "{0}" ]'.format(outputJSName) , text, flags=re.DOTALL)

    output = open(os.path.join(targetFolderName, 'manifest.json'), 'w')

    output.write(text)

    output.close()

    zipdir(targetFolderName, 'vocabi_{0}.zip'.format(version))

    shutil.rmtree(targetFolderName)

def zipdir(basedir, archivename):
    assert os.path.isdir(basedir)
    with closing(ZipFile(archivename, "w", ZIP_DEFLATED)) as z:
        for root, dirs, files in os.walk(basedir):
            #NOTE: ignore empty directories
            for fn in files:
                absfn = os.path.join(root, fn)
                zfn = absfn[len(basedir)+len(os.sep):] #XXX: relative path
                z.write(absfn, zfn)


if __name__ == "__main__":
    main(sys.argv[1:])
  