$(function () {
    var $tinymce = $('textarea.tinymce');

    $('#print').click(function () {
        window.print();
    });

    if ($tinymce.length > 0) {
        PrintHelpers.initTinymce($tinymce);
    }


    $('#lang_change').change(function () {
        window.location = $(this).parent().attr('action') + '?' + $(this).parent().serialize();
    });

    $('#saveRedactor').prop('disabled', true);
    $('#editRedactor').click(function () {
        $(this).prop('disabled', true);
        $('#redactor').hide();
        $('#paper_f').hide();
        $('#print_template').show();
        $('#print-size').removeClass('hidden');
        $('#saveRedactor').prop('disabled', false);
        $('#print').prop('disabled', true);
        $('#template-variables').removeClass('hidden');
        $('#edit-cancel').removeClass('hidden');
        $('#printer_preview').addClass('hidden');
        if ($('#print-size').length) {
            var $content = $(tinymce.activeEditor.getContent());
            var tbl = $("table", $content).add($content.filter('table')).first();
            if (tbl.length === 1) {
                var w = tbl.css('width');
                var h = tbl.css('height');
                if (w.indexOf('mm') !== -1) {
                    $('#p-width').val(+w.replace('mm', ''));
                } else if (w.indexOf('cm') !== -1) {
                    $('#p-width').val(+w.replace('cm', '') * 10);
                } else {
                    $('#p-width').val(Math.round(+w.replace('px', '') * 0.264583333333) + 1);
                }
                if (h.indexOf('mm') !== -1) {
                    $('#p-height').val(+h.replace('mm', ''));
                } else if (h.indexOf('cm') !== -1) {
                    $('#p-height').val(+h.replace('cm', '') * 10);
                } else {
                    $('#p-height').val(Math.round(+h.replace('px', '') * 0.264583333333) + 1);
                }
                tinymce.activeEditor.setContent($content.prop('outerHTML'));
            } else {
                $('#print-size').remove();
            }
        }
    });

    $('#saveRedactor').click(function () {
        var _this = this,
            content = tinyMCE.activeEditor.getContent({format: 'raw'});
        $(_this).prop('disabled', true);
        // save content if you need

        $.ajax({
            type: 'POST',
            url: window.location.search + '&ajax=editor',
            data: {html: content},
            cache: false,
            success: function (msg) {
                if (msg) {
                    if (msg['state'] == false && msg['msg']) {
                        alert(msg['msg']);
                    }
                    if (msg['state'] == true) {
                        // destroy editor
                        //$('#redactor').destroy();
                        window.location.reload();
                    }
                }
                $(_this).prop('disabled', false);
                $('#print').prop('disabled', false);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.responseText, 1);
            }
        });
    });
    $('#restore').click(function () {
        var _this = this;
        if (confirm(L.restore_confirm)) {
            $(_this).prop('disabled', true);
            // save content if you need
            $.ajax({
                type: 'POST',
                url: window.location.search + '&ajax=restore',
                data: {html: $('#print_template').html()},
                cache: false,
                success: function (msg) {
                    if (msg) {
                        if (msg['state'] == false && msg['msg']) {
                            alert(msg['msg']);
                        }
                        if (msg['state'] == true) {
                            window.location.reload();
                        }
                    }
                    $(_this).prop('disabled', false);
                    $('#print').prop('disabled', false);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(xhr.responseText, 1);
                }
            });
        }
    });

    $('#sticker,#a4').click(function () {
        var type = $(this).attr('id');
        $('#redactor').removeClass('format-a4 format-sticker').addClass('format-' + type);
        $('#paper_format').text($(this).text());
        $('#redactor>*').css('page-break-before', '').css('page-break-after', '');
    });

    //3.794
    $('#p-width').bind('keyup mouseup change input', function (e) {
        var $content = $(tinymce.activeEditor.getContent());
        $('table', $content).add($content.filter('table')).first().css('width', (+$(this).val()) + 'mm');
        tinymce.activeEditor.setContent($content.prop('outerHTML'));
    });

    $('#p-height').bind('keyup mouseup change input', function (e) {
        var $content = $(tinymce.activeEditor.getContent());
        $('table', $content).add($content.filter('table')).first().css('height', (+$(this).val()) + 'mm');
        tinymce.activeEditor.setContent($content.prop('outerHTML'));
    });

});