<script lang="ts">
    import type { ConnectorInterface } from "../../connectors/connectorInterface";
    import { Connector } from "../../connectors/CookieConnector"
    import {Pomodoro} from "./data/pomodoro";
    import { ACTIVE_POMODORO, setCookie } from "../../util";
    export let callback: Function
    const connector: ConnectorInterface = new Connector()

    

    function generateData(event){
        event.preventDefault()
        let data = new FormData(event.target)
        let pomodoro: Pomodoro = {
            id: undefined,
            pomodoro: {
                title: String(data.get("title")),
                active: true,
                paused: true,
                finished: false,
                pomodoroTimeInMs: (Number(data.get("minutes")) * 60 * 1000) + (Number(data.get("seconds")) * 1000), 
                currentTimeInMs: 0,
                startTimeInEpoch: 0,
                lastRegisteredTimeInEpoch: 0,
                resting: {
                  restingTimeInMs: 0,
                  currentTimeInMs: 0,
                  startTimeInEpoch: 0,
                  lastRegisteredTimeInEpoch: 0,
                  paused: false,
                  finished: false
                },
                dificulty: "easy" // Used to define the quantity of points gained
            }
        }
        //setActivePomodoro(pomodoro)
        callback(connector.savePomodoro(pomodoro))
        setActivePomodoro(connector.getActivePomodoro())
    }

    function setActivePomodoro(pomodoro: Pomodoro){
        setCookie(ACTIVE_POMODORO, JSON.stringify(pomodoro), 400)
    }
</script>

<div>
    <form on:submit={(data) => generateData(data)} id="pomodoro-form">
        <div class="input-combo">
            <label for="title">Title</label>
            <input type="text" name="title"/>
        </div>
        <div class="input-combo">
            <label for="minutes">Minutes</label>
            <input type="number" name="minutes" min="0"/>
        </div>
        <div class="input-combo">
            <label for="seconds">Seconds</label>
            <input type="number" name="seconds" min="1"/>
        </div>
        <button type="submit">Submit</button>
    </form>
</div>