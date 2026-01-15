const LivePreview = ({ html, css, js }) => {
  const generatePreviewHtml = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head><style>${css}</style></head>
      <body>${html}<script>${js}</script></body>
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
