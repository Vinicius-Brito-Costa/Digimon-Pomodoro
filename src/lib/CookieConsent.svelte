
<script lang="ts">
  import { onMount } from "svelte";
    import { getCookie, setCookie } from "./util";
    const COOKIE_CONSENT = "cookie_consent"

    let cookieConsent: boolean

    onMount(() => {
        cookieConsent = acceptedCookies()
    })
    function acceptedCookies() : boolean {
        let consent: string | null = getCookie(COOKIE_CONSENT)
        if (consent){
            return true
        }
        return false
    }

    function setConsentCookies() {
        setCookie(COOKIE_CONSENT, "true", 0)
    }
</script>
<style>
    .cookie-consent-container {
        font-family: "Digimon World";
        flex: 1;
        height: 50%;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .button-container {
        display: flex;
        padding-top: 10px;
    }
    .button-container button{
        font-family: "Digimon World";
        background-color: var(--background-dark-color);
        color: var(--font-title-highlight-color);
        font-size: 20px;
        margin: 5px;
        padding: 5px 10px;
    }
    .container-border {
        flex: 1;
        border-radius: var(--border-radius-w1920);
        background-color: var(--border-light-color-2);
        border: solid var(--border-width-minor-w1920) var(--stats-font-border-color);
        padding: var(--border-padding-w1920);
        display: flex;
        max-width: calc(90% - 6px);
    }
    .container {
        border-radius: var(--border-radius-w1920);
        color: var(--stats-font-color);
        background-color: var(--background-dark-color);
        border: solid var(--border-width-minor-w1920) var(--stats-font-border-color);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: var(--font-size-title-w1920);
        color: var(--font-title-highlight-color);
        text-align: center;
    }
    .container h1 {
        margin: 0;
        padding: 10px 0;
        font-size: var(--font-size-title-w1920);
    }
    @media (max-width: 1070px) {
        .cookie-consent-container{
            display: flex;
            justify-content: center;
        }
        .container-border {
            border-radius: var(--border-radius-w1070);
            background-color: var(--border-light-color-2);
            border: solid var(--border-width-minor-w1070) var(--stats-font-border-color);
            padding: var(--border-padding-w1070);
            max-width: calc(90% - 22px);
        }
        .container {
            width: 100%;
            border-radius: var(--border-radius-w1070);
            border: solid var(--border-width-minor-w1070) var(--stats-font-border-color);
            font-size: var(--font-size-title-w1070);
        }
        .container h1 {
            font-size: var(--font-size-title-w1070);
        }
    }
</style>
{#key cookieConsent}
    {#if cookieConsent}
        <slot/>
    {:else}
        <div class="cookie-consent-container">
            <div class="container-border">
                <div class="container">
                    <h1>
                        This website uses cookies in order to function correctly, those cookies only store information about the app usage and will not be sent not any external server.
                    </h1>
                    <h1>Please accept cookies.</h1>
                </div>
            </div>
            <div class="button-container">
                <button on:click={() => {
                    setConsentCookies()
                    cookieConsent = acceptedCookies()
                }}>Yes, I accept Cookies</button>
                <button on:click={() => alert("Please accept the Cookies!")}>No</button>
            </div>
        </div>
    {/if}
{/key}
