export interface Answer {
  word: string,
  logit: number,
  position: number
  revealed?: boolean
}