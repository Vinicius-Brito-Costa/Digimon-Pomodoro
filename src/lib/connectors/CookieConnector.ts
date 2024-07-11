import {v4 as uuid} from "uuid";
import { ConnectorInterface } from "./connectorInterface";
import type {Pomodoro} from "../pomodoro/pomodoro";
import type {System} from "../system";


export class Connector implements ConnectorInterface {
    SYSTEM: string = "system"
    savePomodoro(data: Pomodoro) : System | null{
        let pomodoroSystem = this.getSystem()
        if(data){
            let id = data.id
            if(pomodoroSystem && data.pomodoro){
                if(!id){
                    id = uuid()
                    for(let index = 0; index < pomodoroSystem.pomodoros.length; index++){
                        if (pomodoroSystem.pomodoros[index] && data.pomodoro.active) {
                            pomodoroSystem.pomodoros[index].pomodoro.active = false
                        }
                    }
                }
                else {
                    for(let index = 0; index < pomodoroSystem.pomodoros.length; index++){
    
                        if(pomodoroSystem.pomodoros[index] && pomodoroSystem.pomodoros[index].id == id){
                            pomodoroSystem.pomodoros.splice(index, 1)
                        }
                        else if (pomodoroSystem.pomodoros[index] && data.pomodoro.active) {
                            pomodoroSystem.pomodoros[index].pomodoro.active = false
                        }
                    }
                }
                pomodoroSystem.pomodoros.push({ id: id, pomodoro: data.pomodoro})
            }
        }
        this.eraseCookie(this.SYSTEM)
        this.setCookie(this.SYSTEM, JSON.stringify(pomodoroSystem), 0)
        return pomodoroSystem
    }
    
    getSystem() : System | null {
        let pomodoroSystem: string | null =  this.getCookie(this.SYSTEM)
        let response: System | null
        if(pomodoroSystem){
            response = JSON.parse(pomodoroSystem) as System
        }
        else {
            response = {
                username: "Default",
                pomodoros: []
            }
            this.setCookie(this.SYSTEM, JSON.stringify(response), 0)
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
        let response: Pomodoro | null = null
        let system = this.getSystem()
        if(system) {
            for(let index = 0; index < system.pomodoros.length; index++) {
                if(system.pomodoros[index] 
                    && system.pomodoros[index].pomodoro
                    && system.pomodoros[index].pomodoro.active){
                        response = system.pomodoros[index]
                }
            }
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
        this.setCookie(this.SYSTEM, JSON.stringify(data), 0)
    }
    
    
    // https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
    setCookie(name: string, value: string, days: number) {
        var expires = "";
        if (days > 0) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    getCookie(name) : string | null{
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    eraseCookie(name) {   
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}

