"use client"

import { DialogIntro } from "./dialog-intro";

const lastPlayedDateKey = "lastPlayedDate"

export default function GameHeader({showDialog, setShowDialog}: {showDialog: boolean, setShowDialog: (input: boolean) => void}) {

  return (
    <div className="flex flex-row items-center gap-2">
      <div>
        Daily Logits
      </div>
      <button onClick={() => setShowDialog(true)} className="flex items-center justify-center h-3 w-3 outline outline-1 outline-slate-400 text-slate-400 rounded-full text-xs">
        ?
      </button>
      {
        showDialog && <DialogIntro open={showDialog} close={() => setShowDialog(false)}/>
      }
    </div>      
  );
}
