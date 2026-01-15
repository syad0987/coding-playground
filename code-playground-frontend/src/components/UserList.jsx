const UserList = ({ users, currentUserId }) => (
  <>
    <h3 className="text-xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
      👥 Users ({users.length})
    </h3>
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
            {user.username.slice(0, 2).toUpperCase()}
          </div>
          <span className="font-medium text-gray-200">{user.username}</span>
          {user.id === currentUserId && (
            <span className="text-xs bg-green-500 px-2 py-1 rounded-full">
              You
            </span>
          )}
        </div>
      ))}
    </div>
  </>
);

export default UserList;
