const LivePreview = ({ code }) => {
  const generatePreviewHtml = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head><style>${code.css}</style></head>
      <body>${code.html}<script>${code.js}</script></body>
      </html>
    `;
  };

  return (
    <iframe
      srcDoc={generatePreviewHtml()}
      className="w-full h-[500px] bg-white border-2 border-gray-300 rounded-xl shadow-2xl"
      sandbox="allow-scripts allow-same-origin"
    />
  );
};

export default LivePreview;
