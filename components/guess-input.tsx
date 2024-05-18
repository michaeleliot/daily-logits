"use client"

import { Input } from "@/components/ui/input";
import { RefObject, useCallback, useRef, useState, KeyboardEvent, useEffect } from "react";

export default function GuessInput({checkAnswer, disabled}: {checkAnswer: (text: string) => boolean, disabled: boolean}) {
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null);
  const [wrongAnimation, setPlayWrongAnimation] = useState(false)

  const inputOnKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>, inputRef: RefObject<HTMLInputElement>) => {
    //@ts-ignore
    const inputText = e.target.value
    if (e.key === 'Enter' && inputText && inputRef.current) {
      const wasRight = checkAnswer(inputText)
      if (!wasRight) {
        setPlayWrongAnimation(true)
      }
      setInput("")
      const isMobile = window.innerWidth < 640;
      if (isMobile) inputRef.current.blur()
    }
    e.stopPropagation()
  }, [checkAnswer])

  useEffect(() => {
    if (wrongAnimation) {
      setTimeout(() => {
        setPlayWrongAnimation(false)
      }, 1000)
    }
  }, [wrongAnimation])

  return (
      <Input
        placeholder="type your guess here"
        ref={inputRef}
        value={input}
        disabled={disabled}
        onChange={(e) => setInput(e.target.value.replace(/[^a-zA-Z]/g, ''))}
        onKeyDown={(e) => inputOnKeyDown(e, inputRef)}
        className={`sm:w-1/5 ${wrongAnimation ? "animate-horizontal-shaking" : ""}`}
      />
  );
}
