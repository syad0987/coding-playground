import { useAuth } from "../hooks/useAuth";
export default function AuthStatus() {
  const { user, login, logout, loading } = useAuth();
  if (loading) {
    return <span className="text-gray-300">Checking auth...</span>;
  }
  return (
    <div className="flex items-center gap-4 mt-2">
      {user ? (
        <div className="flex items-center gap-2">
          <img
            src={user.photoURL}
            className="w-8 h-8 rounded-full"
            alt={user.displayName}
          />
          <span className="text-white font-semibold">{user.displayName}</span>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={login}
          className=" px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login with Google
        </button>
      )}
    </div>
  );
}
