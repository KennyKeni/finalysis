import SideBar from "./SideBar";
import TopBar from "./TopBar";


export default function Layout( {children} ) {

  return (
    <div className="flex flex-col w-full h-screen">
      <TopBar></TopBar>
      <div className="flex flex-row w-full h-full bg-slate">
        <SideBar></SideBar>
        <main className="w-full h-full">
          {children}
        </main>
      </div>
    </div>
  )
}