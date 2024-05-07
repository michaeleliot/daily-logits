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

export function DialogDemo({open, close}: {open: boolean, close: () => void}) {
  return (
    <Dialog open={open}>
      <DialogContent closeFn={close} className="sm:max-w-[425px]">
        <div>
          Daily logits is a word guessing game, where you attempt to guess what an AI thinks should go in the blank. See if you know what is most likely!
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
