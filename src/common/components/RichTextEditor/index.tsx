import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import { htmlToMarkdown, markdownToHtml } from './MdParser';

interface RichTextEditorProps {
  initialValue?: string;
  onChange?: (html: string) => void;
  isMarkdown?: boolean;
}

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike', 'blockquote', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  ['clean'],
];

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'color',
];

const modules = {
  markdownOptions: {},
};

function convertOutput(data: string, isMarkdown: boolean = false) {
  if (isMarkdown) {
    return htmlToMarkdown(data);
  }
  return data;
}

function convertInput(data: string, isMarkdown: boolean = false) {
  if (isMarkdown) {
    return markdownToHtml(data);
  }
  return data;
}

const RichTextEditor: React.FC<RichTextEditorProps> = (prop) => {
  const [editorHtml, setEditorHtml] = useState<string>(
    prop.initialValue ? convertInput(prop.initialValue, prop.isMarkdown ?? false) : '',
  );

  const handleEditorChange = (html: string) => {
    setEditorHtml(convertOutput(html, prop.isMarkdown ?? false));
    prop.onChange?.(html);
  };

  return (
    <div>
      <ReactQuill
        value={editorHtml}
        onChange={handleEditorChange}
        formats={formats}
        modules={{
          toolbar: {
            container: TOOLBAR_OPTIONS,
          },
        }}
      />
    </div>
  );
};

export default RichTextEditor;
