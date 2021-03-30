define(function (require, exports, module) {
    "use strict";
    
    var EditorManager = brackets.getModule("editor/EditorManager");
    
    $("html").on("mousedown", function (e) {
        var editor = EditorManager.getActiveEditor(),
            language = editor.document.getLanguage().getName().toLowerCase(),
            cm = editor._codeMirror,
            matchTags;
        
        if ((e.ctrlKey || e.metaKey) && $.inArray(language, ["html", "php", "xml"]) > -1) {
            matchTags = CodeMirror.findMatchingTag(cm, cm.getCursor());
            
            if (matchTags && matchTags.open && matchTags.close) {
                cm.setSelection(matchTags.open.from, matchTags.close.to);
            }
        }
    });
});