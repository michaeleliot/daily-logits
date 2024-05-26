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
  const score = answers.reduce((sum, answer) => sum + (answer.failReveal ? 0 : answer.logit), 0)
  const total = answers.reduce((sum, answer) => sum + (answer.logit), 0)
  const emojiString = answers.map(answer => !answer.failReveal ? "🧠" : "🤖").join(" ")

  const [isCopied, setIsCopied] = useState(false)
  return (
    <Dialog open={open}>
      <DialogContent closeFn={close} className="flex flex-col items-center w-3/4 sm:max-w-[425px]">
        <div>
          {score > total / 2 ? `Good Job! You got ${((score/total) * 100).toPrecision(3) + "%"}!` : "Better luck tomorrow!"}
        </div>
        {
          <div>
            {emojiString}
          </div>
        }
        <DialogFooter>
          <Button onClick={() => {
            setIsCopied(true)
            navigator.clipboard.writeText("Daily Logits" + ` ${new Date().getMonth() + 1}/${new Date().getDate()}: ` + emojiString)
          }} type="button" variant="secondary">
            <div className={`${isCopied ? "animate-vertical-shaking" : ""}`}>{isCopied ? "Copied to Clipboard!" : "Share Your Results"}</div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
