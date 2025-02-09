import { useUser } from "@auth0/nextjs-auth0/client";
import TestButton from "@/components/TestButton";

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    <div className="flex flex-row justify-center items-center w-full h-screen">
      <div className="flex flex-col justify-center items-center w-3/4 h-3/4 bg-red-200">
        <div className="font-extrabold text-[3rem] sm:text-[10rem]">
          Finalysis
        </div>
        <button className="font-medium text-[0.8rem] bg-white rounded-3xl border-4 border-slate hover:bg-slate p-4 mt-5 sm:text-[1.5rem]">
        {user ? (
          <a href="/api/auth/login" className="text-2xl font-bold h-full w-full py-4 px-6">Login</a>
        ) : (
          <a href="/api/auth/logout" className="text-2xl font-bold h-full w-full py-4 px-6">Login</a>
        )}
        </button>
      </div>
    </div>
  );
}
