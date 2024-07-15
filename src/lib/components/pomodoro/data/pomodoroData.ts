import {Resting} from "./resting"

export interface PomodoroData {
    title: string | null
    active: boolean
    paused: boolean
    finished: boolean
    pomodoroTimeInMs: number
    currentTimeInMs: number
    startTimeInEpoch: number
    lastRegisteredTimeInEpoch: number
    resting: Resting
    dificulty: string
}