import Editor from "@monaco-editor/react";
const CodeEditor = ({ activeTab, code, onCodeChange }) => {
  const handleChange = (value) => {
    console.log(`Monaco ${activeTab} change:`, value?.substring(0, 50));
    onCodeChange(activeTab, value);
  };
  return (
    <Editor
      height="600px"
      language={activeTab}
      theme="vs-dark"
      value={code[activeTab] || ""}
      onChange={handleChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
};

export default CodeEditor;
