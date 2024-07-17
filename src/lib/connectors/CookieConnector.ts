import {v4 as uuid} from "uuid";
import { ConnectorInterface } from "./connectorInterface";
import {Pomodoro} from "../components/pomodoro/data/pomodoro";
import {System} from "../system";
import { ACTIVE_POMODORO, eraseCookie, getCookie, setCookie, SYSTEM } from "../util";
import Digimon from "../components/digimon/data/digimon";
import { getRandomBabyIDigimon } from "../requestHandler";


export class Connector implements ConnectorInterface {

    async savePomodoro(data: Pomodoro) : Promise<System | null>{
        return this.getSystem().then(async res => {
            let response: System | null = null
            if(data){
                let id = data.id
                if(res && data.pomodoro){
                    response = structuredClone(res)
                    if (response){
                        if(!id){
                            id = uuid()
                            for(let index = 0; index < response.pomodoros.length; index++){
                                if (response.pomodoros[index] && data.pomodoro.active) {
                                    this.deactivatePomodoro(response.pomodoros[index])
                                }
                            }
                            data.id = id
                        }
                        else {
                            for(let index = 0; index < response.pomodoros.length; index++){
            
                                if(response.pomodoros[index] && response.pomodoros[index].id == id){
                                    response.pomodoros.splice(index, 1)
                                }
                                
                                if (response.pomodoros[index] && response.pomodoros[index].id != id && data.pomodoro.active) {
                                    this.deactivatePomodoro(response.pomodoros[index])
                                }
                            }
                        }
                        response.pomodoros.push({ id: id, pomodoro: data.pomodoro})
                    }
                }
            }
            eraseCookie(SYSTEM)
            eraseCookie(ACTIVE_POMODORO)
            setCookie(SYSTEM, JSON.stringify(response), 0)
            setCookie(ACTIVE_POMODORO, JSON.stringify(data), 0)
            return response;
        })
        
        
    }

    deactivatePomodoro(pomodoro: Pomodoro) {
        pomodoro.pomodoro.active = false
        pomodoro.pomodoro.paused = true
        pomodoro.pomodoro.currentTimeInMs = 0
    }
    
    async getSystem() : Promise<System | null> {        
        return new Promise(async (resolve) => {
            let pomodoroSystem: string | null =  getCookie(SYSTEM)
            if(pomodoroSystem ){
                resolve(Object.assign(new System(), JSON.parse(pomodoroSystem)))
            }
            else {
                
                // 45 minutes: 2700000
                // 5 minutes: 900000
                resolve(await getRandomBabyIDigimon().then(res => {
                    let sys: System = new System()
                    sys.username = "default"
                    let digimon: Digimon = new Digimon()
                    digimon.name = res.name
                    sys.digimon = digimon
                    sys.digimonDictionary = [sys.digimon]
                    let initialPomodoro: Pomodoro = Object.assign(new Pomodoro(), {
                        "id": "default",
                        "pomodoro": {
                            "title": "default",
                            "active": true,
                            "paused": true,
                            "finished": false,
                            "pomodoroTimeInMs": 1000,
                            "currentTimeInMs": 0,
                            "startTimeInEpoch": 0,
                            "lastRegisteredTimeInEpoch": 0,
                            "resting": {
                                "finished": false,
                                "paused": true,
                                "restingTimeInMs": 2000,
                                "currentTimeInMs": 0,
                                "startTimeInEpoch": 0,
                                "lastRegisteredTimeInEpoch": 0
                            },
                            "dificulty": "easy"
                        }
                    })
                    sys.pomodoros = [initialPomodoro]
                    return sys
                }).then(res => {
                    setCookie(SYSTEM, JSON.stringify(res), 0)
                    setCookie(ACTIVE_POMODORO, JSON.stringify(res.pomodoros[0]), 0)
                    return res
                }))
            }
        })
        
    }
    async setActivePomodoro(id: string) : Promise<System | null>{
        return this.getPomodoroById(id).then(async data => {
            if (data) {
                data.pomodoro.active = true
                return this.savePomodoro(data)
            }
            return this.getSystem()
        })
    }
    
    async startPomodoro(pomodoroId: string) : Promise<System | null>{
        return this.getPomodoroById(pomodoroId).then(async data => {
            if (data){
                data.pomodoro.active = true
                data.pomodoro.paused = false
                data.pomodoro.finished = false
                data.pomodoro.startTimeInEpoch = Date.now()
                data.pomodoro.lastRegisteredTimeInEpoch = data.pomodoro.startTimeInEpoch
                if (data.pomodoro.resting) {
                    data.pomodoro.currentTimeInMs = 0
                    data.pomodoro.resting.startTimeInEpoch = Date.now()
                    data.pomodoro.resting.lastRegisteredTimeInEpoch = data.pomodoro.startTimeInEpoch
                }
                return this.savePomodoro(data)
            }
            return this.getSystem()
        })
    }

    async startPomodoroResting(pomodoroId: string) : Promise<System | null>{
        return this.getPomodoroById(pomodoroId).then(async data => {
            if (data){
                if (data.pomodoro.resting) {
                    data.pomodoro.resting.paused = false
                    data.pomodoro.resting.finished = false
                    data.pomodoro.resting.currentTimeInMs = 0
                    data.pomodoro.resting.startTimeInEpoch = Date.now()
                    data.pomodoro.resting.lastRegisteredTimeInEpoch = data.pomodoro.resting.startTimeInEpoch
                }
                return this.savePomodoro(data)
            }
            return this.getSystem()
        })
    }
    
    async pausePomodoro(pomodoroId: string) : Promise<System | null>{
        return this.getPomodoroById(pomodoroId).then(async data => {
            if (data){
                data.pomodoro.paused = true
                return this.savePomodoro(data)
            }
            return this.getSystem()
        })
    }

    async pausePomodoroResting(pomodoroId: string) : Promise<System | null>{
        return this.getPomodoroById(pomodoroId).then(async data => {
            if (data){
                data.pomodoro.resting.paused = true
                return this.savePomodoro(data)
            }
            return this.getSystem()
        })
    }
    
    async unpausePomodoro(pomodoroId: string) : Promise<System | null>{
        return this.getPomodoroById(pomodoroId).then(async data => {
            if (data){
                data.pomodoro.paused = false
                data.pomodoro.startTimeInEpoch = Date.now()
                data.pomodoro.lastRegisteredTimeInEpoch = data.pomodoro.startTimeInEpoch
                return this.savePomodoro(data)
            }
            return this.getSystem()
        })
    }

    async unpausePomodoroResting(pomodoroId: string) : Promise<System | null>{
        return this.getPomodoroById(pomodoroId).then(async data => {
            if (data){
                data.pomodoro.resting.paused = false
                data.pomodoro.resting.startTimeInEpoch = Date.now()
                data.pomodoro.resting.lastRegisteredTimeInEpoch = data.pomodoro.startTimeInEpoch
                return this.savePomodoro(data)
            }
            return this.getSystem()
        })
    }
    
    async resetPomodoro(pomodoroId: string) : Promise<System | null>{
        return this.getPomodoroById(pomodoroId).then(async data => {
            if (data){
                data.pomodoro.paused = true
                data.pomodoro.finished = false
                data.pomodoro.currentTimeInMs = 0
                data.pomodoro.startTimeInEpoch = Date.now()
                data.pomodoro.lastRegisteredTimeInEpoch = data.pomodoro.startTimeInEpoch
                data.pomodoro.resting.currentTimeInMs = 0
                data.pomodoro.resting.lastRegisteredTimeInEpoch = 0
                data.pomodoro.resting.startTimeInEpoch = Date.now()
                data.pomodoro.resting.lastRegisteredTimeInEpoch = data.pomodoro.startTimeInEpoch
                return this.savePomodoro(data)
            }
            return this.getSystem()
        })
    }

    async resetPomodoroResting(pomodoroId: string) : Promise<System | null>{
        return this.getPomodoroById(pomodoroId).then(async data => {
            if (data){
                data.pomodoro.resting.currentTimeInMs = 0
                data.pomodoro.resting.lastRegisteredTimeInEpoch = 0
                data.pomodoro.resting.startTimeInEpoch = Date.now()
                data.pomodoro.resting.lastRegisteredTimeInEpoch = data.pomodoro.resting.startTimeInEpoch
                return this.savePomodoro(data)
            }
            return this.getSystem()
        })
    }
    
    async updateTimer(pomodoroId: string) : Promise<System | null>{
        return this.getPomodoroById(pomodoroId).then(async data => {
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
        })
    }

    async updateRestingTimer(pomodoroId: string) : Promise<System | null>{
        return this.getPomodoroById(pomodoroId).then(async data => {
            if (data) {
                if(data.pomodoro.resting && !data.pomodoro.resting.paused && !data.pomodoro.resting.finished){
                    data.pomodoro.resting.currentTimeInMs += Math.floor((Date.now() - data.pomodoro.resting.lastRegisteredTimeInEpoch))
                    data.pomodoro.resting.lastRegisteredTimeInEpoch = Date.now()
                    if(data.pomodoro.resting.restingTimeInMs <= data.pomodoro.resting.currentTimeInMs){
                        data.pomodoro.resting.paused = true
                        data.pomodoro.resting.finished = true
                        data.pomodoro.resting.currentTimeInMs = data.pomodoro.resting.restingTimeInMs
                    }
                    return this.savePomodoro(data)
                }
            }
        
            return this.getSystem()
        })
    }
    
    async getPomodoroById(id: string) : Promise<Pomodoro | null>{
        return this.getSystem().then(system => {
            let response: Pomodoro | null = null
            let sys: System | null = null
            if(system) {
                sys = structuredClone(system)
                if(sys){
                    for(let index = 0; index < sys.pomodoros.length; index++) {
                        if(sys.pomodoros[index] && sys.pomodoros[index].id == id){
                            response = sys.pomodoros[index]
                        }
                    }
                }
            }
            return response
        })
    }
    
    getActivePomodoro() : Pomodoro | null{
        let pomodoro: string | null =  getCookie(ACTIVE_POMODORO)
        let response: Pomodoro | null = null
        if(pomodoro){
            response = JSON.parse(pomodoro) as Pomodoro
        }
        
        return response
    }

    async setRestingState(pomodoroId: string) : Promise<System | null> {
        return this.getPomodoroById(pomodoroId).then(async data => {
            if (data) {
                if(data.pomodoro.resting){
                    data.pomodoro.finished = true
                    data.pomodoro.resting.paused = true
                    data.pomodoro.resting.finished = false
                    data.pomodoro.resting.currentTimeInMs = 0
                    return this.savePomodoro(data)
                }
            }
        
            return this.getSystem()
        })
    }
    
    async deletePomodoro(id: string) : Promise<System | null>{
        return this.getSystem().then(async res => {
            if(res) {
                for(let index = 0; index < res.pomodoros.length; index++) {
                    if(res.pomodoros[index] 
                        && res.pomodoros[index].id == id){
                            res.pomodoros.splice(index, 1)
                            this.saveSystem(res)
                    }
                }
            }
            return res
        })
    }
    
    saveSystem(data: System) : void{
        setCookie(SYSTEM, JSON.stringify(data), 0)
    }
}

