<script lang="ts">
    import type { ConnectorInterface } from "../lib/connectors/connectorInterface";
    import { Connector } from "../lib/connectors/CookieConnector"
    import type { Pomodoro } from "../lib/pomodoro/pomodoro";
  import { ACTIVE_POMODORO, setCookie } from "../lib/util";
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
                paused: false,
                finished: false,
                pomodoroTimeInMs: (Number(data.get("minutes")) * 60 * 1000) + (Number(data.get("seconds")) * 1000), 
                currentTimeInMs: 0,
                startTimeInEpoch: 0,
                lastRegisteredTimeInEpoch: 0,
                recurring: {
                    times: 3,
                    intervalInMs: 2500 // resting time
                },
                dificulty: "easy" // Used to define the quantity of points gained
            }
        }
        //setActivePomodoro(pomodoro)
        callback(connector.savePomodoro(pomodoro))
        setActivePomodoro(connector.getActivePomodoro())
    }

    function setActivePomodoro(pomodoro: Pomodoro){
        setCookie(ACTIVE_POMODORO, JSON.stringify(pomodoro), 0)
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