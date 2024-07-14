import {v4 as uuid} from "uuid";
import { ConnectorInterface } from "./connectorInterface";
import type {Pomodoro} from "../pomodoro/pomodoro";
import type {System} from "../system";
import { ACTIVE_POMODORO, eraseCookie, getCookie, setCookie, SYSTEM } from "../util";


export class Connector implements ConnectorInterface {

    savePomodoro(data: Pomodoro) : System | null{
        let pomodoroSystem = this.getSystem()
        if(data){
            let id = data.id
            if(pomodoroSystem && data.pomodoro){
                if(!id){
                    id = uuid()
                    for(let index = 0; index < pomodoroSystem.pomodoros.length; index++){
                        if (pomodoroSystem.pomodoros[index] && data.pomodoro.active) {
                            this.deactivatePomodoro(pomodoroSystem.pomodoros[index])
                        }
                    }
                    data.id = id
                }
                else {
                    for(let index = 0; index < pomodoroSystem.pomodoros.length; index++){
    
                        if(pomodoroSystem.pomodoros[index] && pomodoroSystem.pomodoros[index].id == id){
                            pomodoroSystem.pomodoros.splice(index, 1)
                        }
                        
                        if (pomodoroSystem.pomodoros[index] && pomodoroSystem.pomodoros[index].id != id && data.pomodoro.active) {
                            this.deactivatePomodoro(pomodoroSystem.pomodoros[index])
                        }
                    }
                }
                pomodoroSystem.pomodoros.push({ id: id, pomodoro: data.pomodoro})
            }
        }
        eraseCookie(SYSTEM)
        eraseCookie(ACTIVE_POMODORO)
        setCookie(SYSTEM, JSON.stringify(pomodoroSystem), 0)
        setCookie(ACTIVE_POMODORO, JSON.stringify(data), 0)
        return pomodoroSystem
    }

    deactivatePomodoro(pomodoro: Pomodoro) {
        pomodoro.pomodoro.active = false
        pomodoro.pomodoro.paused = true
        pomodoro.pomodoro.currentTimeInMs = 0
    }
    
    getSystem() : System | null {
        let pomodoroSystem: string | null =  getCookie(SYSTEM)
        let response: System | null
        if(pomodoroSystem){
            response = JSON.parse(pomodoroSystem) as System
        }
        else {
            response = {
                username: "Default",
                pomodoros: []
            }
            setCookie(SYSTEM, JSON.stringify(response), 0)
        }
        return response
    }
    setActivePomodoro(id: string) : System | null{
        let data = this.getPomodoroById(id)
        if (data) {
            data.pomodoro.active = true
            return this.savePomodoro(data)
        }
        return this.getSystem()
    }
    
    startPomodoro(pomodoroId: string) : System | null{
        let data = this.getPomodoroById(pomodoroId)
        if (data){
            data.pomodoro.active = true
            data.pomodoro.paused = false
            data.pomodoro.finished = false
            data.pomodoro.startTimeInEpoch = Date.now()
            data.pomodoro.lastRegisteredTimeInEpoch = data.pomodoro.startTimeInEpoch
            return this.savePomodoro(data)
        }
        return this.getSystem()
    }
    
    pausePomodoro(pomodoroId: string) : System | null{
        let data = this.getPomodoroById(pomodoroId)
        if (data){
            data.pomodoro.paused = true
            return this.savePomodoro(data)
        }
        return this.getSystem()
    }
    
    unpausePomodoro(pomodoroId: string) : System | null{
        let data = this.getPomodoroById(pomodoroId)
        if (data){
            data.pomodoro.paused = false
            data.pomodoro.startTimeInEpoch = Date.now()
            data.pomodoro.lastRegisteredTimeInEpoch = data.pomodoro.startTimeInEpoch
            return this.savePomodoro(data)
        }
        return this.getSystem()
    }
    
    resetPomodoro(pomodoroId: string) : System | null{
        let data = this.getPomodoroById(pomodoroId)
        if (data){
            data.pomodoro.paused = true
            data.pomodoro.finished = false
            data.pomodoro.currentTimeInMs = 0
            data.pomodoro.startTimeInEpoch = Date.now()
            data.pomodoro.lastRegisteredTimeInEpoch = data.pomodoro.startTimeInEpoch
            return this.savePomodoro(data)
        }
        return this.getSystem()
    }
    
    updateTimer(pomodoroId: string) : System | null{
        let data = this.getPomodoroById(pomodoroId)
        if (data) {
            if(!data.pomodoro.paused && !data.pomodoro.finished){
                data.pomodoro.currentTimeInMs += Math.floor((Date.now() - data.pomodoro.lastRegisteredTimeInEpoch))
                data.pomodoro.lastRegisteredTimeInEpoch = Date.now()
                if(data.pomodoro.pomodoroTimeInMs <= data.pomodoro.currentTimeInMs){
                    data.pomodoro.paused = true
                    data.pomodoro.finished = true
                    data.pomodoro.currentTimeInMs = data.pomodoro.pomodoroTimeInMs
                }
                return this.savePomodoro(data)
            }
        }
    
        return this.getSystem()
    }
    
    getPomodoroById(id: string) : Pomodoro | null{
        let response: Pomodoro | null = null
        let system = this.getSystem()
        if(system) {
            for(let index = 0; index < system.pomodoros.length; index++) {
                if(system.pomodoros[index] && system.pomodoros[index].id == id){
                    response = system.pomodoros[index]
                }
            }
        }
        return response
    }
    
    getActivePomodoro() : Pomodoro | null{
        let pomodoro: string | null =  getCookie(ACTIVE_POMODORO)
        let response: Pomodoro | null = null
        if(pomodoro){
            response = JSON.parse(pomodoro) as Pomodoro
        }
        
        return response
    }
    
    deletePomodoro(id: string): System | null{
        let system = this.getSystem()
        if(system) {
            for(let index = 0; index < system.pomodoros.length; index++) {
                if(system.pomodoros[index] 
                    && system.pomodoros[index].id == id){
                        system.pomodoros.splice(index, 1)
                        this.saveSystem(system)
                }
            }
        }
    
        return system
    }
    
    saveSystem(data: System) : void{
        setCookie(SYSTEM, JSON.stringify(data), 0)
    }
}
