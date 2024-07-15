export interface Resting {
    paused: boolean,
    finished: boolean,
    restingTimeInMs: number,
    currentTimeInMs: number
    startTimeInEpoch: number
    lastRegisteredTimeInEpoch: number
}