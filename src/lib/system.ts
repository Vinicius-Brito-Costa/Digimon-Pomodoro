import Digimon from "./components/digimon/data/digimon"
import {Pomodoro} from "./components/pomodoro/data/pomodoro"

export class System {
    username: string
    digimon: Digimon
    digimonDictionary: Digimon[]
    pomodoros: Pomodoro[]
}