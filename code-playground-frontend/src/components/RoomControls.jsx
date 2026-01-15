const RoomControls = ({ roomId, onNewRoom }) => {
  const copyRoomLink = () => {
    navigator.clipboard.writeText(`${window.location.href}#${roomId}`);
    alert("Room link copied! Share with friends 🚀");
  };

  return (
    <div className="flex items-center gap-3">
      <input
        value={roomId}
        readOnly
        className="bg-gray-800 px-4 py-2 rounded-xl border border-gray-600 w-64 font-mono"
      />
      <button
        onClick={copyRoomLink}
        className="bg-gradient-to-r from-green-500 to-blue-600 px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
      >
        📋 Copy Link
      </button>
      <button
        onClick={onNewRoom}
        className="bg-purple-600 px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
      >
        🔄 New Room
      </button>
    </div>
  );
};

export default RoomControls;
