const DATA = {
    "1": {
        "list" : [[40, 70, "blanche"], [20, 30, "pleine"]],
        "timer" : 60
    },
    "2": {
        "list" : [[55, 70, "blanche"], [40, 40, "pleine"], [70, 35, "pleine"], [50, 80, "pleine"]],
        "timer" : 110
    },
    "3": {
        "list" : [[20, 84, "blanche"], [70, 55, "pleine"], [20, 75, "pleine"], [70, 20, "pleine"], [90, 20, "pleine"], [40, 45, "pleine"]],
        "timer" : 200
    },
    "4": {
        "list" : [[20, 20, "blanche"], [30, 30, "pleine"], [20, 82, "pleine"], [55, 20, "pleine"], [60, 77, "pleine"], [40, 75, "pleine"], [50, 55, "pleine"], [90, 50, "pleine"], [80, 27, "pleine"], [70, 82, "pleine"]],
        "timer" : 250
    },
    "5": {
        "list" : [[10, 70, "blanche"], [30, 30, "pleine"], [15, 82, "pleine"], [20, 57, "pleine"], [60, 77, "pleine"], [50, 85, "pleine"], [30, 25, "pleine"], [90, 50, "pleine"], [25, 27, "pleine"], [40, 82, "pleine"], [35, 77, "pleine"], [70, 67, "pleine"], [20, 22, "pleine"]],
        "timer" : 270
    },
    "6": {
        "list" : [[70, 80, "blanche"], [70, 30, "pleine"], [75, 82, "pleine"], [50, 27, "pleine"], [60, 17, "pleine"], [20, 80, "pleine"], [20, 65, "pleine"], [40, 75, "pleine"], [45, 80, "pleine"], [40, 82, "pleine"], [50, 17, "pleine"], [50, 67, "pleine"], [30, 52, "pleine"], [50, 90, "pleine"], [90, 50, "pleine"]],
        "timer" : 290
    },
    // "7": {
    //     "list" : [[50, 50, "blanche"], [70, 30, "pleine"], [75, 82, "pleine"], [50, 27, "pleine"], [60, 17, "pleine"], [20, 80, "pleine"], [20, 65, "pleine"], [40, 75, "pleine"], [45, 80, "pleine"], [40, 82, "pleine"], [50, 17, "pleine"], [50, 67, "pleine"], [30, 52, "pleine"], [50, 90, "pleine"], [90, 50, "pleine"]],
    //     "timer" : 290
    // },
}

if (!localStorage.hasOwnProperty("MAXLEVEL"))
    localStorage.setItem("MAXLEVEL", 1)
const MAXLEVEL = +localStorage.getItem("MAXLEVEL")
const currentLevel = parseInt(window.location.href.split('?')[1])

document.title = "Billard By Stan.co - Level " + currentLevel
if (isNaN(currentLevel) || currentLevel > MAXLEVEL)
    window.location.href = "./../index.html"

IsOnSolo = true
let positionningWhiteBall = false
let timer = DATA[currentLevel.toString()]["timer"]
DATA[currentLevel.toString()]["list"].forEach(e => a.push(new Ball(e[0], e[1], e[2])))

function OnMouseDown(e){
    if (e.button === 0){
        if (a[0].vx != 0) return
        const intensity = Clamp(getLength(direction[0], direction[1]), ValueExtrm[0], ValueExtrm[1])
        a[0].speed(-direction[0] * intensity / (45 * getLength(direction[0], direction[1])), direction[1] * intensity / (45 * getLength(direction[0], direction[1])))
        a[0].visual.children[0].style.display = "none"
    }
}

function empoche(_){
    if (_.classList.contains("blanche")) return
    if (a.length == 2){
        if (currentLevel == MAXLEVEL) localStorage.setItem("MAXLEVEL", currentLevel + 1)
        alert("Vous avez gagné !")
        window.location.href = "./levels.html"
    }
}
