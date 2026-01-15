import Editor from "@monaco-editor/react";
const codeEditor = ({ activeTab, code, onCodeChange }) => (
  <Editor
    height="600px"
    language={activeTab}
    theme="vs-dark"
    value={code[activeTab]}
    onChange={(newCode) => onCodeChange(newCode)}
    options={{
      minimap: { enabled: false },
      fontSize: 14,
      wordWrap: "on",
      scrollBeyondLastLine: false,
    }}
  />
);
export default codeEditor;
