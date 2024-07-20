
const DIGIMON_API_BASE_PATH = "https://digi-api.com"
const PNG_EXT = ".png"
const ENDPOINTS = {
    DIGIMON: "/api/v1/digimon",
    IMAGE: "/images/digimon/w"
}

export function getDigimonByName(name){
    return fetch(DIGIMON_API_BASE_PATH + ENDPOINTS.DIGIMON + "/" + name).then(res => res.json())
}

export function buildDigimonImageURLByName(name){
    return DIGIMON_API_BASE_PATH + ENDPOINTS.IMAGE + "/" + name.replaceAll(" ", "_") + PNG_EXT
}

function getDigimonList(query){
    let url = DIGIMON_API_BASE_PATH + ENDPOINTS.DIGIMON + query
    return fetch(url).then(res => res.json())
}

async function getAllBabyIDigimon(){
    let baseQuery = "?level=Baby%20I"
    return getDigimonList(baseQuery).then(queryResult => {
        if (queryResult){
            return getDigimonList(baseQuery + "&pageSize=" + queryResult["pageable"]["totalElements"]).then(res => {
                return res
            })
        }
        return null
    })
    
}

export async function getRandomBabyIDigimon() {
    return getAllBabyIDigimon().then(res => {
        if (res) {
            let digimon = res["content"][Math.floor(Math.random() * res["content"].length) + 1]
            return digimon
        }
    
        return null
    })
    
}

export async function getRandomEvolution(digimonName) {
    return getDigimonByName(digimonName).then(async current => {
        
        if(current) {
            // If digimon reaches Ultimate level, we need to reset it to the baby form
            // We will keep an 10% chance of acquiring another Ultimate level digimon
            if (current.levels.find(level => level.level.toLowerCase()=="ultimate") != undefined && Math.random() <= 0.9){
                return await getRandomBabyIDigimon().then(res => res.name)
            }
            return current["nextEvolutions"][Math.floor(Math.random() * current["nextEvolutions"].length)]["digimon"]
        }
        return current
    })
}