const EditorTabs = ({ activeTab, setActiveTab }) => {
  <div className="bg-gray-900/50 border border-gray-600 rounded-xl mb-6 overflow-hidden flex">
    {["html", "css", "js"].map((tab) => {
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-8 py-3 text-sm font-medium transition-all flex-1 ${
          activeTab === tab
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
            : "text-gray-400 hover:text-white hover:bg-gray-700/50"
        }`}
      >
        {tab.toUpperCase()}
      </button>;
    })}
  </div>;
};

export default EditorTabs;
