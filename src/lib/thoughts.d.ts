export type Thought = { slot: number; text: string; src: string; id: string }

export type Panchang = {
  tithi: string
  paksha: string
  tithiName: string
  month: string
  samvat: number
  vara: string
  festival: string
  [key: string]: unknown
}

export type ThoughtLib = {
  thoughtAt(ms: number): Thought
  panchang(ms: number): Panchang
  approxCount(): number
}

export function createThoughtLib(): ThoughtLib
