"use client"

import Answers from "@/components/answers";
import { Input } from "@/components/ui/input";
import { Answer } from "@/lib/type";
import useLocalStorage from "@/lib/useLocalStorage";
import { useEffect, useState } from "react";
import { DialogDemo } from "./dialog";

const lastPlayedDateKey = "lastPlayedDate"

const defaultNumGuesses = 3

export default function Game({question, defaultAnswers}: {question: string, defaultAnswers: Answer[]}) {
  const [guessCount, setGuessCount] = useLocalStorage("guesses", defaultNumGuesses)
  const [answers, setAnswers] = useLocalStorage("answers", defaultAnswers)
  const [wrongAnimation, setPlayWrongAnimation] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  const winner = answers.filter(answer => answer.revealed).length === 5
  const loser = !guessCount

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
  }, [setGuessCount, setAnswers, answers]);

  useEffect(() => {
    if (wrongAnimation) {
      setTimeout(() => setPlayWrongAnimation(false), 3000)
    }
  })

  return (
    <>
      {
        showDialog && <DialogDemo open={showDialog} close={() => setShowDialog(false)}/>
      }
      <div>{guessCount ? winner ? "You win! Play Again tomorrow!" : question : "Try Again Tomorrow!"}</div>
      <Input disabled={loser || winner} onKeyDown={(e) => {
          if (e.key === 'Enter') {
            // @ts-ignore
            const inputText: string = e.target.value

            const cleanedInputText = inputText.trim().toLowerCase()

            const answersObject: {[key: string]: Answer} = {}
            answers.forEach((answer, i) => answersObject[answer.word] = {...answer})
            const answer = answersObject[cleanedInputText]

            if (!answer) {
              setGuessCount(guessCount - 1)
              setPlayWrongAnimation(true)
            } else {
              const clone = [...answers]
              clone[answer.position] = {revealed: true, ...answer}
              setAnswers(clone)
            }
          }
      }} className={`w-1/5 ${wrongAnimation ? "animate-horizontal-shaking" : ""}`} placeholder={"Enter your guess here!"}></Input>
      <div className="flex flex-row gap-3">
        Misses:
        {
          Array.from(Array(defaultNumGuesses)).map((_, i) => <div className={`${i >= guessCount ? "animate-shrink fill-mode-forwards" : ""}`} key={i}>O</div>)
        }
      </div>
      <Answers answers={answers} hasLost={loser} />
    </>
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