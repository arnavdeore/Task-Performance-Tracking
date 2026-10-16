import { createThoughtLib } from './thoughts.js'

/** One shared instance: the thought strip and the calendar both read the Hindu calendar from it. */
export const thoughtLib = createThoughtLib()
