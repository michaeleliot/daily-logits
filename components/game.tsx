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

  const winner = answers.filter(answer => answer.revealed).length === 5
  const loser = !guessCount

  useEffect(() => {
    if (winner || loser) {
      setTimeout(() => setShowCompleteDialog(true), 1500)
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

  const submit = useCallback(() => {
    if (input ) {
      // inputRef.current.blur()

      const cleanedInputText = input.trim().toLowerCase()
      
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
    }
  }, [])

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
        <><div>Daily Logits</div>
        <div>{question}</div>
        <Input ref={inputRef} value={input} disabled={loser || winner} onChange={(e) => setInput(e.target.value.replace(/[^a-zA-Z]/g, ''))} onKeyDown={(e) => {
          console.log(e.key)
          if (e.key === 'Enter' || e.key === "return") submit()
        }} className={`sm:w-1/5 ${wrongAnimation ? "animate-horizontal-shaking" : ""}`}></Input>
        <div className="flex flex-row gap-3">
          Misses:
          {
            Array.from(Array(defaultNumGuesses)).map((_, i) => <div className={`${i >= guessCount ? "animate-shrink fill-mode-forwards" : ""}`} key={i}>O</div>)
          }
        </div>
        <Answers answers={answers} hasLost={loser} />
        {/* <div className="h-80 px-10 w-full flex flex-col mt-5 items-center">
          <div className="flex justify-between items-center mb-4 gap-1">
            {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((key) => (
              <button disabled={winner || loser} onClick={() => {
                console.log("didn't click")
                setInput(input => input + key)
                }} key={key} className="bg-gray-500 text-white font-bold text-lg min-w-8 py-2 px-2 rounded-md hover:bg-gray-600 focus:outline-none">
                {key}
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center mb-4 gap-1">
            {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((key) => (
              <button disabled={winner || loser} onClick={() => setInput(input => input + key)} key={key} className="bg-gray-500 text-white font-bold text-lg min-w-8 py-2 px-2 rounded-md hover:bg-gray-600 focus:outline-none">
              {key}
            </button>
            ))}
          </div>
          <div className="flex justify-between items-center gap-1">
            {["enter", "Z", "X", "C", "V", "B", "N", "M", "<="].map(
              (key) => (
              <button disabled={winner || loser} onClick={() => {
                if (key == "enter") {
                  submit()
                } else if (key == "<=") {
                  setInput(input =>input.slice(0,-1))
                } else {
                  setInput(input => input + key)
                }
                }} key={key} className="bg-gray-500 text-white font-bold text-lg min-w-8 py-2 px-2 rounded-md hover:bg-gray-600 focus:outline-none">
                {key}
              </button>
              )
            )}
          </div>
        </div> */}
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