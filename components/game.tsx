"use client"

import Answers from "@/components/answers";
import { Input } from "@/components/ui/input";
import { Answer } from "@/lib/type";
import useLocalStorage from "@/lib/useLocalStorage";
import { useCallback, useEffect, useRef, useState } from "react";
import { DialogIntro } from "./dialog-intro";
import { DialogComplete } from "./dialog-complete";

const lastPlayedDateKey = "lastPlayedDate"

const defaultNumGuesses = 3

export default function Game({question, defaultAnswers}: {question: string, defaultAnswers: Answer[]}) {
  const [guessCount, setGuessCount] = useLocalStorage("guesses", defaultNumGuesses)
  const [answers, setAnswers] = useLocalStorage("answers", defaultAnswers)
  const [wrongAnimation, setPlayWrongAnimation] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null);

  const loser = !guessCount
  const winner = answers.filter(answer => answer.revealed).length === 5 && !loser

  useEffect(() => {
    if (winner || loser) {
      let failures = 0
      const answersWithFailures: Answer[] = answers.map(answer => {
        if (!answer.revealed) {
          return {...answer, failReveal: ++failures}
        }
        return answer
      })
      setAnswers(answersWithFailures)
      setTimeout(() => setShowCompleteDialog(true), 3000)
    }
  }, [winner, loser, setShowCompleteDialog])

  useEffect(() => {
    const lastPlayed = window.localStorage.getItem(lastPlayedDateKey);
    if (!lastPlayed || getTimeDifference(new Date(new Date().toDateString())).days >= 7) {
      setShowDialog(true)
    }
    if (!lastPlayed || lastPlayed != new Date().toDateString()) {
      setGuessCount(defaultNumGuesses)
      setAnswers(answers)
      window.localStorage.setItem(lastPlayedDateKey, new Date().toDateString())
    }
    setIsLoading(false)
  }, [setGuessCount, setAnswers, answers]);

  useEffect(() => {
    if (wrongAnimation) {
      setTimeout(() => {
        setInput("")
        setPlayWrongAnimation(false)
      }, 3000)
    }
  }, [wrongAnimation])

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center">
      {
        (winner || loser) && showCompleteDialog && <DialogComplete isWinner={winner} answers={answers} open={true} close={() => setShowCompleteDialog(false)}/>
      }
      {
        showDialog && <DialogIntro open={showDialog} close={() => setShowDialog(false)}/>
      }
      {
        isLoading ?
        <div>Loading...</div> :
        <><div className="flex flex-row items-center gap-2">
          <div>
            Daily Logits
          </div>
          <button onClick={() => setShowDialog(true)} className="flex items-center justify-center h-3 w-3 outline outline-1 outline-slate-400 text-slate-400 rounded-full text-xs">
            ?
          </button>
        </div>
        <div>{question}</div>
        <Input ref={inputRef} value={input} disabled={loser || winner} onChange={(e) => setInput(e.target.value.replace(/[^a-zA-Z]/g, ''))} onKeyDown={(e) => {
          //@ts-ignore
          const inputText = e.target.value
          if (e.key === 'Enter' && inputText && inputRef.current) {
            inputRef.current.blur()
            const cleanedInputText = inputText.trim().toLowerCase()
            
            const lemmatize = require( 'wink-lemmatizer' );
      
            const answersObject: {[key: string]: Answer} = {}
            answers.forEach((answer, i) => {
              answersObject[answer.word] = {...answer}
              answersObject[lemmatize.adjective(answer.word)] = {...answer}
              answersObject[lemmatize.noun(answer.word)] = {...answer}
              answersObject[lemmatize.verb(answer.word)] = {...answer}
            })
      
            const answer = answersObject[cleanedInputText] || answersObject[lemmatize.adjective(cleanedInputText)] || answersObject[lemmatize.verb(cleanedInputText)] || answersObject[lemmatize.noun(cleanedInputText)] 
      
            if (!answer) {
              setGuessCount(guessCount - 1)
              setPlayWrongAnimation(true)
            } else {
              const clone = [...answers]
              clone[answer.position] = {revealed: true, ...answer}
              setAnswers(clone)
            }

            setInput("")
            inputRef.current.focus()
          }
        }} className={`sm:w-1/5 ${wrongAnimation ? "animate-horizontal-shaking" : ""}`}></Input>
        <div className="flex flex-row gap-3">
          {
            Array.from(Array(defaultNumGuesses)).map((_, i) => <div className={`${i >= guessCount ? "animate-shrink fill-mode-forwards" : ""}`} key={i}>O</div>)
          }
        </div>
        <Answers answers={answers} />
      </>
      }
    </div>
      
  );
}


function getTimeDifference(date: Date) {
  // Check if date is a valid Date object
  if (!(date instanceof Date)) {
    throw new Error('Invalid date object provided');
  }

  const now = new Date();
  const millisecondsDiff = now.getTime() - date.getTime();

  // Convert milliseconds to seconds, minutes, hours, etc.
  const seconds = Math.floor(millisecondsDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Return an object with the time difference components
  return {
    milliseconds: millisecondsDiff,
    seconds,
    minutes,
    hours,
    days,
  };
}