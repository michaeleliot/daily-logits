import { promises as fs } from 'fs';
import { Answer } from './type';
// import { Queue } from "quirrel/next-app"
// import { pipeline } from '@xenova/transformers';

import Replicate from "replicate";
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function getTodaysGame() {
  const today = new Date()
  return getGameForDate(today)
}

async function getGameForDate(date: Date): Promise<{question: string, answers: Answer[]}> {
  const formattedDate = getFormattedDate(date)
  const file = await fs.readFile(process.cwd() + `/app/data/${formattedDate}.json`, 'utf8')
  const json = JSON.parse(file)
  return json
}

export function getFormattedDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if necessary
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if necessary
  const year = date.getFullYear();

  const formattedDate = `${month}_${day}_${year}`;
  return formattedDate
}

interface TransformersFillMaskOutput {
  token_str: string,
  score: number,
}

async function generateText() {
  const input = {
    prompt: "You are an assistant generating sentences for a word guessing game. You will create a short sentence that contains one word replaced with the text [MASK], that human players will then attempt to guess the removed word. Do not reference anything specific in the sentence as it should allow for multiple correct responses. Reply with only the sentence. Do not reply with anything besides the sentence.",
    max_new_tokens: 250
  };

  const foo = await replicate.run("meta/llama-2-70b-chat", {input}) as string[]
}

function replaceMaskWithUnderscores(questionWithMask: string) {
  const splitQuestion = questionWithMask.split(" ")
  const maskIndex = splitQuestion.findIndex(word => word == "[MASK]")
  splitQuestion[maskIndex] = "_____"
  return splitQuestion.join(" ")
}

// async function createGameDataForTomorrow(questionWithMask: string) {
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);

//   const questionWithUnderscores = replaceMaskWithUnderscores(questionWithMask)
  
//   const unmasker = await pipeline('fill-mask', 'Xenova/bert-base-cased');
//   const outputs = await unmasker(questionWithMask) as TransformersFillMaskOutput[];

//   const answers: Answer[] = outputs.map((output, i) => ({
//     word: output.token_str,
//     logit: output.score,
//     position: i
//   }))

//   const formattedDate = getFormattedDate(tomorrow)

//   const data = JSON.stringify({
//     question: questionWithUnderscores,
//     answers
//   })

//   fs.writeFile(process.cwd() + `/app/data/${formattedDate}.json`, data)
// }

// createGameDataForTomorrow("The [MASK] was a sight to behold in the evening.")