import {Pomodoro} from "../components/pomodoro/data/pomodoro";
import {System} from "../system";

export interface ConnectorInterface {
    savePomodoro(params:Pomodoro) : System | null
    getSystem() : System | null
    setActivePomodoro(id: string) : System | null
    startPomodoro(pomodoroId: string) : System | null
    startPomodoroResting(pomodoroId: string) : System | null
    pausePomodoro(pomodoroId: string) : System | null
    pausePomodoroResting(pomodoroId: string) : System | null
    unpausePomodoro(pomodoroId: string) : System | null
    unpausePomodoroResting(pomodoroId: string) : System | null
    resetPomodoro(pomodoroId: string) : System | null
    resetPomodoroResting(pomodoroId: string) : System | null
    updateTimer(pomodoroId: string) : System | null
    updateRestingTimer(pomodoroId: string) : System | null
    setRestingState(pomodoroId: string) : System | null
    getPomodoroById(id: string) : Pomodoro | null
    getActivePomodoro() : Pomodoro | null
    deletePomodoro(id: string) : System | null
    saveSystem(data: System) : void
}