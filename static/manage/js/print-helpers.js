var PrintHelpers = (function(){
    
    this.insertTag = function(btn, event){
        event.preventDefault();
        tinymce.activeEditor.execCommand('mceInsertContent', false, btn);
    };
    
    this.initTinymce = function($textarea){
        // fix for old templates :(
        $textarea.val($textarea.val().replace('data-mce-style', 'data-deleted'));

        tinymce.PluginManager.requireLangPack('lineheight', manage_lang);
        var mce = tinymce.init({
            language: manage_lang,
            branding: false,
            elementpath: false,
            menubar: false,
            height: 400,
            target: $textarea[0],
            file_browser_callback: function (field_name, url, type, win) {
                if (type == 'image'){
                    $('#my_form input').click();
                }
            },
            plugins: [
                'advlist autolink lists link image charmap preview anchor',
                'searchreplace visualblocks visualchars code',
                'insertdatetime nonbreaking save table contextmenu directionality',
                'template paste textcolor colorpicker textpattern imagetools lineheight'
            ],
            lineheight_formats: "1 1.1 1.2 1.3 1.4 1.5 1.6 1.7 1.8 1.9 2 2.1 2.2 2.3 2.4 2.5",
            toolbar1: 'undo redo | styleselect | bold italic underline | fontselect | forecolor backcolor | alignleft aligncenter alignright | bullist numlist | lineheightselect | table | image | fontsizeselect | code |'
        });
        $textarea.data('mce', mce);
        return mce;
    };
    
    return this;
})();