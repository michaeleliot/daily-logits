## Overview
Play the game yourself [here](https://daily-logits.vercel.app/)!

Daily logits is a word guessing game, where you have to guess what word the AI thinks belongs in the blank. Think madlibs meets family feud. Your scored both on number correct, and on logits which is the amount of weight given to the likelihood of a word in that spot.

<img width="389" alt="Screenshot 2024-05-18 at 9 32 46 PM" src="https://github.com/michaeleliot/daily-logits/assets/15314517/f98c6daa-262c-436d-9ad7-9ef2b4cc9488">

<img width="418" alt="Screenshot 2024-05-18 at 9 33 00 PM" src="https://github.com/michaeleliot/daily-logits/assets/15314517/8a3d6575-0d97-4fb6-8e94-1634ea3ae1d5">


## Technical Discussion
Daily logits is a Next.js app. It leverages Transformers.js for creating the games, and for picking the answers. The actual answer checking is done locally.


## Running Locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
