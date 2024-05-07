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

export function DialogIntro({open, close}: {open: boolean, close: () => void}) {
  return (
    <Dialog open={open}>
      <DialogContent closeFn={close} className="wsm:max-w-[425px]">
        <div className="bolder text-3xl">
          How To Play
        </div>
        <div className="bolder text-xl">
          Guess what AI thinks the hidden word is!
        </div>
        <ul className="pl-10">
          <li className="list-disc">Only one word (no hyphens, punctuation, or spaces)</li>
          <li className="list-disc">You have three incorrect answers before game over</li>
          <li className="list-disc">Guess the 5 likeliest answers to win!</li>
          <li className="list-disc">Answers will show in order of logit, or likelihood score. Higher number = AI thinks more likely</li>
        </ul> 
        <div>
          <div className="bolder text-xl">Example</div>
          <div>The meaning of life is ___</div>
          <div>AI Answers: Survival, Love, Purpose</div>
        </div>
        <div className="text-xs text-slate-500">
          A daily game by <a target="_blank" className="underline" href="https://twitter.com/MichaelEliot">Michael Eliot</a>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={close} type="button" variant="secondary">
              I am ready!
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
