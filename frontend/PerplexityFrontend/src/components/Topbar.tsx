import { useState } from "react";

export default function Topbar({username , logout} : {username : string , logout : () => void }) {

  const [loadModal , setLoadModal] = useState(false);

  const loadingModal = () =>{
    setLoadModal(!loadModal);
  }

  return (
    <div>
      <div className="scroll-smooth flex w-full items-center justify-between border-b border-solid border-gray-200 bg-white px-6 py-6">
        <h1 className="text-2xl font-semibold select-none cursor-default">
          <span className="font-bold">"Purr"</span>Plexity
        </h1>
        <p className="text-right mr-4 cursor-pointer select-none" onClick={loadingModal}>Hi , {username == undefined || username == ""  ? "Guest" : username}</p>
      </div>
      <div className="relative w-full flex justify-end">
        {loadModal && (
          <div
            className="absolute top-2 select-none right-2 rounded-md shadow-md border p-4 w-60 text-center bg-white cursor-pointer"
            onClick={logout}
          >
            SignOut
          </div>
        )}
      </div>
    </div>
  );
}
