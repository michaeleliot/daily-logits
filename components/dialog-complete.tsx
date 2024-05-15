import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Answer } from "@/lib/type"
import { useState } from "react"

export function DialogComplete({open, close, isWinner, answers}: {open: boolean, close: () => void, isWinner: boolean, answers: Answer[]}) {
  const emojiString = answers.map(answer => !answer.failReveal ? "🧠" : "🤖").join(" ")
  const [isCopied, setIsCopied] = useState(false)
  return (
    <Dialog open={open}>
      <DialogContent closeFn={close} className="flex flex-col items-center w-3/4 sm:max-w-[425px]">
        <div>
          {isWinner ? "Good Job!" : "Better luck tomorrow!"}
        </div>
        {
          <div>
            {emojiString}
          </div>
        }
        <DialogFooter  onClick={() => console.log("footer clicked")}>
          <Button onClick={() => {
            setIsCopied(true)
            navigator.clipboard.writeText(emojiString)
          }} type="button" variant="secondary">
            <div className={`${isCopied ? "animate-vertical-shaking" : ""}`}>{isCopied ? "Copied to Clipboard!" : "Share Your Results"}</div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
