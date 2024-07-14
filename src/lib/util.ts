export function formatTime(time: number) : string{
    let totalSeconds: number = parseInt(String(Math.floor(time / 1000)), 10);
    let totalMinutes: number = parseInt(String(Math.floor(totalSeconds / 60)), 10);
    return `${String(totalMinutes).padStart(2, "0")}:${String(totalSeconds - (totalMinutes * 60)).padStart(2, "0")}`
}

export function formatTimeSeparated(time: number) : string[]{
    let totalSeconds: number = parseInt(String(Math.floor(time / 1000)), 10);
    let totalMinutes: number = parseInt(String(Math.floor(totalSeconds / 60)), 10);
    return [String(totalMinutes).padStart(2, "0"), String(totalSeconds - (totalMinutes * 60)).padStart(2, "0")]
}

// COOKIES

export const SYSTEM: string = "system"
export const ACTIVE_POMODORO: string = "active_pomodoro"
// https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
export function setCookie(name: string, value: string, days: number) {
    var expires = "";
    if (days > 0) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
export function getCookie(name) : string | null{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
export function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}