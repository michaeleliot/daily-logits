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
  const [gameState, setGameState] = useLocalStorage("gameState", {answers: defaultAnswers, winner: false, loser: false, guessCount: defaultNumGuesses, alreadyPlayedToday: false, revealedAnswers: false, lastPlayedDateString: ""})
  const [showDialog, setShowDialog] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [hasShownCompleteDialogue, setHasShowCompleteDialogue] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  console.log(gameState)

  useEffect(() => {  
    if (gameState.loser || gameState.winner) {
      setHasShowCompleteDialogue(true)
      if (!gameState.revealedAnswers) {
        let failures = 0
        const answersWithFailures: Answer[] = gameState.answers.map(answer => {
          if (!answer.revealed) {
            return {...answer, failReveal: ++failures}
          }
          return answer
        })
        setGameState({...gameState, answers: answersWithFailures, revealedAnswers: true})
        setTimeout(() => {
          setShowCompleteDialog(true)
          setGameState({...gameState, alreadyPlayedToday: true})
        }, 3000)
      } else if (!hasShownCompleteDialogue) {
        setTimeout(() => {
          setShowCompleteDialog(true)
          setGameState({...gameState, alreadyPlayedToday: true})
        }, 1000)
      }
    }
  }, [gameState, hasShownCompleteDialogue, setGameState])

  useEffect(() => {
    if (!isLoading) {
      if (!gameState.lastPlayedDateString || getTimeDifference(new Date(new Date().toDateString())).days >= 7) {
        setShowDialog(true)
      }
      if (!gameState.lastPlayedDateString || gameState.lastPlayedDateString != new Date().toDateString()) {
        setGameState({
          ...gameState,
          guessCount: defaultNumGuesses,
          answers: defaultAnswers,
          alreadyPlayedToday: false,
          loser: false,
          winner: false,
          revealedAnswers: false,
          lastPlayedDateString: new Date().toDateString()
        })
      }
    }
    setIsLoading(false)
  }, [gameState, setGameState, defaultAnswers, isLoading]);


  const checkAnswer = useCallback((inputText: string) => {
    const cleanedInputText = inputText.trim().toLowerCase()
    const lemmatize = require( 'wink-lemmatizer' );

    const answersObject: {[key: string]: Answer} = {}
    gameState.answers.forEach((answer, i) => {
      answersObject[answer.word] = {...answer}
      answersObject[lemmatize.adjective(answer.word)] = {...answer}
      answersObject[lemmatize.noun(answer.word)] = {...answer}
      answersObject[lemmatize.verb(answer.word)] = {...answer}
    })

    const answer = answersObject[cleanedInputText] || answersObject[lemmatize.adjective(cleanedInputText)] || answersObject[lemmatize.verb(cleanedInputText)] || answersObject[lemmatize.noun(cleanedInputText)] 

    if (!answer) {
      const newGuessCount = gameState.guessCount - 1
      setGameState({...gameState, guessCount: newGuessCount, loser: newGuessCount <= 0})
      return false
    } else {
      const clone = [...gameState.answers]
      clone[answer.position] = {revealed: true, ...answer}
      const isWinner = clone.filter(answer => answer.revealed).length == 5 && !gameState.loser
      setGameState({...gameState, answers: clone, winner: isWinner})
      return true
    }
  }, [gameState, setGameState])

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center">
      {
        (gameState.winner || gameState.loser) && showCompleteDialog && <DialogComplete isWinner={gameState.winner} answers={gameState.answers} open={true} close={() => setShowCompleteDialog(false)}/>
      }
      {
        isLoading ?
        <div>Loading...</div> :
        <div className="w-full h-full flex flex-col gap-4 items-center transition-all animate-fadeIn">
          <GameHeader showDialog={showDialog} setShowDialog={setShowDialog}/>
          <div>{question}</div>
          <GuessInput checkAnswer={checkAnswer} disabled={gameState.loser || gameState.winner}/>
          <div className="flex flex-row gap-3">
            {
              Array.from(Array(defaultNumGuesses)).map((_, i) => <div className={`${i >= gameState.guessCount ? "animate-shrink fill-mode-forwards" : ""}`} key={i}>O</div>)
            }
          </div>
          <Answers answers={gameState.answers} alreadyPlayed={!!gameState.alreadyPlayedToday} />
        </div>
      }
    </div>
  );
}