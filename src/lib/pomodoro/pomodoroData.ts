import {Recurring} from "./recurring"

export interface PomodoroData {
    title: string | null
    active: boolean
    paused: boolean
    finished: boolean
    pomodoroTimeInMs: number
    currentTimeInMs: number
    startTimeInEpoch: number
    lastRegisteredTimeInEpoch: number
    recurring: Recurring
    dificulty: string
}