import {Pomodoro} from "../pomodoro/pomodoro";
import {System} from "../system";

export interface ConnectorInterface {
    savePomodoro(params:Pomodoro) : System | null
    getSystem() : System | null
    setActivePomodoro(id: string) : System | null
    startPomodoro(pomodoroId: string) : System | null
    pausePomodoro(pomodoroId: string) : System | null
    unpausePomodoro(pomodoroId: string) : System | null
    resetPomodoro(pomodoroId: string) : System | null
    updateTimer(pomodoroId: string) : System | null
    getPomodoroById(id: string) : Pomodoro | null
    getActivePomodoro() : Pomodoro | null
    deletePomodoro(id: string) : System | null
    saveSystem(data: System) : void
}