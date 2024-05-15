import { promises as fs } from 'fs';
import { Answer } from './type';
import { DataArray, pipeline } from '@xenova/transformers';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function getTodaysGame() {
  const today = new Date()
  return getGameForDate(today)
}

const VOLUME_PATH = `/app/data` 

async function getGameForDate(date: Date): Promise<{question: string, answers: Answer[]}> {
  const formattedDate = getFormattedDate(date)
  const file = await fs.readFile(process.cwd() + `${VOLUME_PATH}/${formattedDate}.json`, 'utf8')
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

async function generateQuestion(topic: string) {
  const input = {
    prompt: `You are an assistant generating sentences for a word guessing game. You will create a short sentence that contains one word replaced with the text [MASK] on the topic of ${topic}, that human players will then attempt to guess the removed word. Do not reference anything specific in the sentence as it should allow for multiple correct responses. Reply with only the sentence. Do not reply with anything besides the sentence.`,
    max_new_tokens: 250,
    temperature: 0.9
  };
  const outputTokens = await replicate.run("meta/llama-2-70b-chat", {input}) as string[]
  return outputTokens.join("")
}

function replaceMaskWithUnderscores(questionWithMask: string) {
  const splitQuestion = questionWithMask.split(" ")
  const maskIndex = splitQuestion.findIndex(word => word == "[MASK]")
  splitQuestion[maskIndex] = "_____"
  return splitQuestion.join(" ")
}

async function createGameFromQuestion(questionWithMask: string, date: Date) {
  const questionWithUnderscores = replaceMaskWithUnderscores(questionWithMask)
  
  const unmasker = await pipeline('fill-mask', 'Xenova/bert-base-cased');
  const outputs = await unmasker(questionWithMask, { topk: 10 }) as TransformersFillMaskOutput[];

  const lemmatize = require( 'wink-lemmatizer' );
  const lemmaObj: {[key: string]: boolean} = {}
  const dedupedOutputs = outputs.filter(answer => {
    const lemmaAlreadySeen = lemmaObj[lemmatize.adjective(answer.token_str)] || lemmaObj[lemmatize.noun(answer.token_str)] || lemmaObj[lemmatize.verb(answer.token_str)]
    lemmaObj[lemmatize.adjective(answer.token_str)] = true
    lemmaObj[lemmatize.noun(answer.token_str)] = true
    lemmaObj[lemmatize.verb(answer.token_str)] = true
    return !lemmaAlreadySeen
  }).slice(0, 5)

  const answers: Answer[] = dedupedOutputs.map((output, i) => ({
    word: output.token_str,
    logit: +output.score.toFixed(3),
    position: i
  }))

  const formattedDate = getFormattedDate(date)

  const data = JSON.stringify({
    question: questionWithUnderscores,
    answers,
  })

  const giveFileCreatePermissions = {mode: 0o755}

  fs.writeFile(process.cwd() + `${VOLUME_PATH}/${formattedDate}.json`, data, giveFileCreatePermissions)
}

async function checkIfGameExists(date: Date) {
  try {
    const formattedDate = getFormattedDate(date)
    await fs.readFile(process.cwd() + `${VOLUME_PATH}/${formattedDate}.json`)
    console.log("got here")
    return true
  } catch (e) {
    console.log("false")
    return false
  }
}

async function getTopic() {
  const content = await fs.readFile(process.cwd() + `${VOLUME_PATH}/topics.json`, "utf8")
  const topicArr = JSON.parse(content) as string[]
  const topic = topicArr.shift()
  if (!topic) {
    throw Error("No topics remaining")
  }
  fs.writeFile(process.cwd() + `${VOLUME_PATH}/topics.json`, JSON.stringify(topicArr))
  return topic
}

export async function generateGameForTomorrow() {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const gameExists = await checkIfGameExists(tomorrow)
    if (!gameExists) {
      const topic = await getTopic()
      const text = await generateQuestion(topic)
      await createGameFromQuestion(text, tomorrow)
    } else {
      console.log("Game already exists")
    }
  } catch(e) {
    console.log(e)
  }
}

// async function similarity(foo: string, bar: string) {

//   const extractor = await pipeline('feature-extraction', 'Xenova/bert-base-uncased', { revision: 'default' });
//   const foutput = await extractor(foo);
//   const boutput = await extractor(bar);
//   const sim = cosineSimilarity(foutput.data, boutput.data)
//   return sim
// }

// function cosineSimilarity(vectorA: DataArray, vectorB: DataArray) {
//   // Check if vectors have the same length
//   if (vectorA.length !== vectorB.length) {
//     throw new Error("Vectors must have the same length");
//   }

//   // Calculate dot product
//   let dotProduct = 0;
//   for (let i = 0; i < vectorA.length; i++) {
//     dotProduct += vectorA[i] * vectorB[i];
//   }

//   // Calculate magnitude of each vector
//   //@ts-ignore
//   let magnitudeA = Math.sqrt(vectorA.reduce((acc, value) => acc + value * value, 0));
//   //@ts-ignore
//   let magnitudeB = Math.sqrt(vectorB.reduce((acc, value) => acc + value * value, 0));

//   // Avoid division by zero
//   if (magnitudeA === 0 || magnitudeB === 0) {
//     return 0;
//   }

//   // Cosine similarity formula
//   return dotProduct / (magnitudeA * magnitudeB);
// }
