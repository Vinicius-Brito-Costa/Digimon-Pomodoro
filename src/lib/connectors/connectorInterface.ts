import {Pomodoro} from "../components/pomodoro/data/pomodoro";
import {System} from "../system";

export interface ConnectorInterface {
    savePomodoro(params:Pomodoro) : Promise<System | null>
    getSystem() : Promise<System | null>
    setActivePomodoro(id: string) : Promise<System | null>
    startPomodoro(pomodoroId: string) : Promise<System | null>
    startPomodoroResting(pomodoroId: string) : Promise<System | null>
    pausePomodoro(pomodoroId: string) : Promise<System | null>
    pausePomodoroResting(pomodoroId: string) : Promise<System | null>
    unpausePomodoro(pomodoroId: string) : Promise<System | null>
    unpausePomodoroResting(pomodoroId: string) : Promise<System | null>
    resetPomodoro(pomodoroId: string) : Promise<System | null>
    resetPomodoroResting(pomodoroId: string) : Promise<System | null>
    updateTimer(pomodoroId: string) : Promise<System | null>
    updateRestingTimer(pomodoroId: string) : Promise<System | null>
    setRestingState(pomodoroId: string) : Promise<System | null>
    getPomodoroById(id: string) : Promise<Pomodoro | null>
    getActivePomodoro() : Pomodoro | null
    deletePomodoro(id: string) : Promise<System | null>
    saveSystem(data: System) : void
}