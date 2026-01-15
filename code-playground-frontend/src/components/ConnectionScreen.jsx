const ConnectionScreen = ({ username, setUsername }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center p-8">
    <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center max-w-md w-full">
      <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
        CodePlayground 🚀
      </h1>
      <p className="text-gray-300 mb-6">Generating room...</p>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-400"
        placeholder="Your name (optional)"
      />
    </div>
  </div>
);

export default ConnectionScreen;
