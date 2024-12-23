const TURN = document.querySelector(".turn")
const GROUP = document.querySelector(".groupe")
document.title = "Billard By Stan.co - VS"

const VsState = {
    "fault" : false,
    "empochedBalls" : [],
    "nb_pleines" : 0,
    "nb_vides" : 0,
    "groupe" : {},
    "timeToFinishBlack" : {
        "1" : false,
        "2" : false
    },
    "turn" : 1
}


// Création de la balle blanche
let w = new (class extends Ball{
    constructor(x, y, color){
        super(x, y, color, 0)
        this.state = "CREATED"
    }

    move(_ = false){
        super.move(_)

        if (a.isFixed() && this.state == "MOVING"){
            this.state = "WAITING"
            EndTurn()
        }
    }
})(25, 50, "blanche")

// Ajout des balles
a.push(w)
for(i = 0; i < 5; i++){
    for(j = 0; j <= i; j++){
        if (i % 2 == 0 && j == i / 2)
            a.push(new Ball(55 + (Ball.width * i), 50, (i <= 2 ? "pleine" : "vide"), i == 0 ? 1 : i == 2 ? 5 : 13))
        else
            if (j <= Math.floor(i / 2))
                a.push(new Ball(55 + (Ball.width * i), 50 - ((Ball.height / 2) * (j + 1)) - (i == 3 ? (Ball.height / 2) * j : 0) - (i % 2 == 0 ? (Ball.height / 2) * (j + 1) : 0), (i == 4 || (i == 3 && j == 1)) ? "vide" : "pleine", i == 1 ? 3 : i == 2 ? 6 : i == 3 ? j == 0 ? 9 : 10 : i == 4 ? j == 0 ? 14 : 15 : 0))
            else
                a.push(new Ball(55 + (Ball.width * i), 50 + ((Ball.height / 2) * (j - Math.floor(i / 2))) + (i == 3 ? (Ball.height / 2) * (j - Math.floor(i / 2) - 1) : 0) + (i % 2 == 0 ? (Ball.height / 2) * (j - Math.floor(i / 2)) : 0), (i == 1 || i == 4) ? "vide" : (i == 3 && j == 2) ? "noire" : "pleine", i == 1 ? 2 : i == 2 ? 4 : i == 3 ? j == 2 ? 8 : 7 : i == 4 ? j == 3 ? 12 : 11 : 0))
    }
}


document.addEventListener('mousedown', (e)=>{
    if (a[0].vx != 0) return
    
    const intensity = Clamp(getLength(direction[0], direction[1]), ValueExtrm[0], ValueExtrm[1])
    if (!VsState["fault"]){
        a[0].speed(-direction[0] * intensity / (45 * getLength(direction[0], direction[1])), direction[1] * intensity / (45 * getLength(direction[0], direction[1])))
        a[0].state = "MOVING"
        a[0].visual.children[0].style.display = "none"
    }
    else {
        VsState["fault"] = false
        a[0].x = Clamp(((e.clientX - rect.left) * 100 / rect.width), 7, 90)
        a[0].y = Clamp(((e.clientY - rect.top) * 100 / rect.height), 15, 80)
        a[0].position()
    }
})

function EndTurn(){
    a[0].visual.children[0].style.display = "flex"

    let changeTurn = true

    // Toucher de la balle blanche
    if (a[0].firstBallTouched == null){
        alert("Faute! La balle blanche doit toucher au moins une balle sur la table avant de s'arrêter")
        alert(`J${3 - VsState["turn"]} peut positionner la balle où il veut`)
        VsState["fault"] = true
    }
    else if (a[0].firstBallTouched.visual.classList.contains("noire") && !VsState["timeToFinishBlack"][VsState["turn"]]){
        alert(`Faute! J${VsState["turn"]} a touché la balle noire en premier`)
        alert(`J${3 - VsState["turn"]} peut positionner la balle où il veut`)
        VsState["fault"] = true
    }
    else if (VsState["groupe"].hasOwnProperty("pleine"))
        if (!a[0].firstBallTouched.visual.classList.contains(VsState["groupe"][VsState["turn"]]) && !a[0].firstBallTouched.visual.classList.contains("noire")){
            alert(`Faute! J${VsState["turn"]} a touché la balle adverse en premier`)
            alert(`J${3 - VsState["turn"]} peut positionner la balle où il veut`)
            VsState["fault"] = true
        }
        
    // Empoche des balles
    VsState["empochedBalls"].forEach(b => {
        if (b.classList.contains("blanche")){
            VsState["fault"] = true
        } else if (b.classList.contains("noire")){
            TURN.style.color = 'red'
            if (VsState["timeToFinishBlack"][VsState["turn"]]){
                alert(`J${VsState["turn"]} a gagné la partie`)
                TURN.textContent = `J${VsState["turn"]} WON !`
            }
            else{
                alert(`Faute! J${VsState["turn"]} a empoché la balle noire et perd donc la partie`)
                alert(`J${3 - VsState["turn"]} a gagné la partie`)
                TURN.textContent = `J${3 - VsState["turn"]} WON !`
            }
            EndGame()
        } else{
            // Création des groupes par joueur
            setGroups(b.classList.contains("pleine"))

            // Empocher la ablle adverse
            if (!b.classList.contains(VsState["groupe"][VsState["turn"]])){
                alert(`Faute! J${VsState["turn"]} a empoché la balle adverse`)
                alert(`J${3 - VsState["turn"]} peut positionner la balle où il veut`)
                VsState["fault"] = true
            } else if (!VsState["fault"]){
                changeTurn = false
                alert(`J${VsState["turn"]} a empoché une de ses balles. Il peut rejouer`)
            }
        }
    })

    // Vider le tableau de balles empochées
    VsState["empochedBalls"] = []
    a[0].firstBallTouched = null
    
    if ((VsState["fault"] || changeTurn) && Playing) nextTurn()
    else changeTurn = true
}

function nextTurn(){
    VsState["turn"] = 3 - VsState["turn"]
    TURN.textContent = "J" + VsState["turn"]
}

function empoche(element){
    VsState["empochedBalls"].push(element)
    if (element.classList.contains("blanche")){
        alert(`Faute! J${VsState["turn"]} a empoché la balle blanche`)
        alert(`J${3 - VsState["turn"]} peut positionner la balle où il veut`)
        a[0].x = Clamp(a[0].x, 7, 90)
        a[0].y = Clamp(a[0].y, 15, 80)
        a[0].speed(0, 0)
    }
}

function setGroups(test){
    // Définition des groupes
    if (VsState["nb_pleines"] + VsState["nb_vides"] == 0){
        VsState["groupe"][test ? "pleine" : "vide"] = VsState["turn"]
        VsState["groupe"][test ? "vide" : "pleine"] = 3 - VsState["turn"]
        VsState["groupe"][VsState["turn"]] = test ? "pleine" : "vide"
        VsState["groupe"][3 - VsState["turn"]] = test ? "vide" : "pleine"
    }

    // Incrémentation des balles empochées
    if (test)
        VsState["nb_pleines"] ++
    else
        VsState["nb_vides"] ++

    // Débloquage de la balle noire
    if (VsState["nb_pleines"] == 7 && !VsState["timeToFinishBlack"][VsState["groupe"]["pleine"]]){
        VsState["timeToFinishBlack"][VsState["groupe"]["pleine"]] = true
        alert(`J${VsState["groupe"]["pleine"]} peut désormais empocher la balle noire`)
    }
    else if (VsState["nb_vides"] == 7 && !VsState["timeToFinishBlack"][VsState["groupe"]["vide"]]){
        VsState["timeToFinishBlack"][VsState["groupe"]["vide"]] = true
        alert(`J${VsState["groupe"]["vide"]} peut désormais empocher la balle noire`)
    }

    // Affichage des groupes
    GROUP.innerHTML = `J${VsState["groupe"]["pleine"]} : Balles pleines<br><b>${VsState["nb_pleines"]}</b><br>J${VsState["groupe"]["vide"]} : Balles vides<br><b>${VsState["nb_vides"]}</b>`
}
