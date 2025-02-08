import { useUser } from "@auth0/nextjs-auth0/client";
import TestButton from "@/components/TestButton";

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    <div style={{ backgroundColor: "#282c34", height: "100vh", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {user ? (
        <div>
          Welcome {user.name} or {user.nickname} <a href="/api/auth/logout">Logout</a>
          <TestButton/>
        </div>
      ) : (
        <div className="bg-blue-300 rounded-md shadow-xl flex h-fit y-fit">
          <a href="/api/auth/login" className="text-2xl font-bold h-full w-full py-4 px-6">Login</a>
        </div>
      )}
    </div>
  );
}
