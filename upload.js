function handleFileSelect(evt) {

        var files = evt.target.files; // FileList object;
        
        $('.modal-show').modal({
            closable: false,
            onVisible: function () {
                $(".modal-show").modal("refresh");
            }
        }).modal('show');

        $('.modal-show .content').html(
                '<div class="ui active progress">' +
                '<div class="bar">' +
                '<div class="progress"></div>' +
                '</div>' +
                '<div class="label">Upload de arquivos</div>' +
                '</div>'
                );

        $('.ui.progress').progress({
            total: files.length,
            text: {
                active  : 'Upload {value} de {total} arquivos',
                success : '{total} upload de arquivos!'
            }
        });
        
        // files is a FileList of File objects. List some properties.
        for (var i = 0, f; f = files[i]; i++) {
            
            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }
            var reader = new FileReader();
            // Closure to capture the file information.
            reader.onload = (function (v) {
                return function (e) {


                    $.ajax({
                        type: 'POST',
                        url: access.getURL() + 'malotevirtual/drive/upload',
                        data: {file: e.target.result, name: escape(v.name), type: v.type || 'n/a', size: v.size},
                        dataType: 'json',
                        beforeSend: function (xhr) {
                            
                        },
                        success: function (e) {
                            table.ajax.reload();
                            $('.ui.progress').progress('increment');
                        }
                    });
                };
            })(f);
            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    }

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('files').addEventListener('change', handleFileSelect, false);
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
