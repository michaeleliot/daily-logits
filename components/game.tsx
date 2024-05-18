"use client"

import Answers from "@/components/answers";
import { Input } from "@/components/ui/input";
import { Answer } from "@/lib/type";
import useLocalStorage from "@/lib/useLocalStorage";
import { Ref, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { DialogIntro } from "./dialog-intro";
import { DialogComplete } from "./dialog-complete";
import GuessInput from "./guess-input";
import GameHeader from "./game-header";
import { getTimeDifference } from "@/lib/utils";
import { pipeline } from "@xenova/transformers";

const lastPlayedDateKey = "lastPlayedDate"

const defaultNumGuesses = 3

export default function Game({question, defaultAnswers}: {question: string, defaultAnswers: Answer[]}) {
  const [guessCount, setGuessCount] = useLocalStorage("guesses", defaultNumGuesses)
  const [answers, setAnswers] = useLocalStorage("answers", defaultAnswers)
  const [showDialog, setShowDialog] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
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
      setAnswers(defaultAnswers)
      window.localStorage.setItem(lastPlayedDateKey, new Date().toDateString())
    }
    setIsLoading(false)
  }, [setGuessCount, setAnswers, answers, defaultAnswers]);


  const checkAnswer = useCallback((inputText: string) => {
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
      return false
    } else {
      const clone = [...answers]
      clone[answer.position] = {revealed: true, ...answer}
      setAnswers(clone)
      return true
    }
  }, [answers, guessCount, setAnswers, setGuessCount])

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center">
      {
        (winner || loser) && showCompleteDialog && <DialogComplete isWinner={winner} answers={answers} open={true} close={() => setShowCompleteDialog(false)}/>
      }
      {
        isLoading ?
        <div>Loading...</div> :
        <>
          <GameHeader showDialog={showDialog} setShowDialog={setShowDialog}/>
          <div>{question}</div>
          <GuessInput checkAnswer={checkAnswer} disabled={loser || winner}/>
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