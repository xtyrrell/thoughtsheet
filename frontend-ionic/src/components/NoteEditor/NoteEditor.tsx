import styled from "@emotion/styled";
import Editor from "react-simple-code-editor";

import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import "prism-solarized-dark/prism-solarizeddark.css";

const NoteEditor = styled(MarkdownEditor)`
  border: 2px solid #d8d8d8 !important;
  font-family: "Fira Code", "Courier New", Courier, monospace;
  width: 100%;
  height: 100%;
  min-height: 10ch;

  * {
    ::selection {
      background-color: #d8d8d8 !important;
    }
  }
`;

function MarkdownEditor({ value, onChange, ...otherProps }) {
  const language = "markdown";

  return (
    <Editor
      value={value}
      onValueChange={onChange}
      padding={10}
      highlight={(c) => Prism.highlight(c, Prism.languages[language], language)}
      {...otherProps}
    />
  );
}

export default NoteEditor;
