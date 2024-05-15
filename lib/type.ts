export interface Answer {
  word: string,
  logit: number,
  position: number,
  failReveal?: number,
  revealed?: boolean
}