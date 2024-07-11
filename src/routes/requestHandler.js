import exp from "constants"

const DIGIMON_API_BASE_PATH = "https://digi-api.com/api/v1"
const ENDPOINTS = {
    DIGIMON: "/digimon"
}

export function getDigimonByName(name){
    return fetch(DIGIMON_API_BASE_PATH + ENDPOINTS.DIGIMON + "/" + name).then(res => res.json())
}