import { useRouter } from "next/router"
import { useState } from "react";
import Button from "./Button"
import SettingsPopup from "./Popup";


export default function SideBar() {
  const router = useRouter();

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="flex flex-col justify-start items-center w-[6.5rem] h-full border-r-2 pt-3 border-aluminum bg-slate relative flex-shrink-0 sm:w-[17%]">
      <Button
        text="Dashboard"
        route="/dashboard"
        className={router.pathname === '/dashboard' ? 'bg-white border-2' : ''}>
      </Button>
      <Button
        text="Documents"
        route="/documents"
        className={router.pathname === '/documents' ? 'bg-white border-2' : ''}>
      </Button>
      <div className="absolute bottom-0 flex flex-col w-full h-[8rem] justify-center items-center border-t-2 border-aluminum">
        <button className="w-[90%] h-[2.3rem] rounded-md mb-1 hover:bg-shell" onClick={() => setIsPopupOpen(true)}>
          Settings
        </button>
        <Button 
          text="Logout"
          route="/"
          className={router.pathname === '/' ? 'bg-white border-2' : ''}>
        </Button>
      </div>
      <SettingsPopup isOpen={isPopupOpen} closePopup={() => setIsPopupOpen(false)} />
    </div>
  )
}