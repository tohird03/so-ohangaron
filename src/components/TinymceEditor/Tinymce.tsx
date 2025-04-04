import React from 'react';
import {Editor} from '@tinymce/tinymce-react';
import {
  tinymceApiKey,
  tinymceContentStyle,
  tinymcePlugins,
  tinymceToolbars,
} from './constants';

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

type CallbackFunction = (imageUrl: string, meta: {title: string}) => void;
type FilePickerCallback = (
  callback: CallbackFunction,
  value: any,
  meta: Record<string, any>
) => void;

export const Tinymce = ({onChange, value}: EditorProps) => {
  const handleFilePickerCallback: FilePickerCallback = (
    callback,
    value,
    meta
  ) => {
    if (meta.filetype === 'image') {
      const input: HTMLInputElement = document.createElement('input');

      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');

      input.onchange = function() {
        const file = input.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = function() {
          const formData = new FormData();

          formData.append('files', file);
          formData.append('fileFolder', 'posts/images/');

          // BU YERDA FILE UPLOAD QILISH UCHUN APIga SO'ROV JO'NATIlADI
        };
      };
      input.click();
    }
  };

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <Editor
      onEditorChange={handleEditorChange}
      value={value}
      apiKey={tinymceApiKey}
      init={{
        height: 400,
        plugins: tinymcePlugins,
        toolbar: tinymceToolbars,
        image_advtab: false,
        file_picker_types: 'image',
        content_style: tinymceContentStyle,
        contextmenu_never_use_native: true,
        contextmenu: false,
        file_picker_callback: handleFilePickerCallback,
      }}
    />
  );
};
