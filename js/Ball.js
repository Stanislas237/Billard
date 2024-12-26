const game = document.querySelector(".table"), value = document.querySelector(".value"), ValueExtrm = [10, 100], TIME = document.querySelector(".timer")
let whiteBall, Waiting = false, IsOnSolo = false, isMouseDown = false, rect = game.getBoundingClientRect(), direction

// Detect Os Type
const userAgent = navigator.userAgent
let OSTYPE = "PC"

if (/Android/i.test(userAgent) || /iPhone|iPad|iPod/i.test(userAgent)) {
    OSTYPE = "Android"
}
// End Detect Os Type

function getLength(x, y){
    return Math.sqrt((x * x) + (y * y))
}

function Clamp(a, b, c){
    return a < b ? b : a > c ? c : a
}

function addElementToWhiteBall(name){
    const newDiv = document.createElement("div")
    name.forEach(c => {
        const div = document.createElement("div")
        div.classList.add(c)
        newDiv.appendChild(div)
    })
    return newDiv
}

class Ball{
    
    static width = 2
    static height = 4
    static frottement = 0.02

    constructor(x, y, color, number = 0){
        this.visual = document.createElement("div")
        this.visual.classList.add("ball", color)
        if (color === "blanche"){
            whiteBall = this
            this.whiteBall = true
            this.firstBallTouched = null
            this.visual.appendChild(addElementToWhiteBall(["raquette", "line"]))
        }
        else{
            this.visual.innerHTML = number
        }
        game.appendChild(this.visual)

        this.x = x
        this.y = y
        this.vx = 0
        this.vy = 0
        this.mass = 1

        this.position()
    }
    position(){
        this.visual.style.left = this.x + "%"
        this.visual.style.top = this.y + "%"
        this.center = [this.x + (Ball.width / 2), this.y + (Ball.height / 2)]
    }
    move(collision = false){
        this.x += this.vx
        this.y -= this.vy
        
        if (!collision){
            if (getLength(this.vx, this.vy) < 0.01)
                this.speed(0, 0)
            else
                this.speed(this.vx * (1 - Ball.frottement), this.vy * (1 - Ball.frottement))
            this.Collisions()
        }
        this.position()
    }
    speed(x, y){
        this.vx = x
        this.vy = y
    }
    touched(ball){
        return (Math.abs(ball.center[0] - this.center[0]) < Ball.width && Math.abs(ball.center[1] - this.center[1]) < Ball.height)
    }
    Collisions(){
        // Walls Up and Down
        if (this.x < 5.3 && this.vx < 0){
            this.vx *= -1
        }
        if (this.x > 93.3 && this.vx > 0){
            this.vx *= -1
        }
        if (this.y < 13.5 && this.vy > 0){
            this.vy *= -1
        }
        if (this.y > 84 && this.vy < 0){
            this.vy *= -1
        }
        
        a.forEach(ball =>{
            if (ball !== this && this.touched(ball)){
                this.resolveCollision(this, ball)
                if (this.whiteBall)
                    if (this.firstBallTouched == null){
                        this.firstBallTouched = ball
                        // alert("ajout de " + this.firstBallTouched.visual.classList)
                    }
                if (ball.whiteBall)
                    if (ball.firstBallTouched == null){
                        ball.firstBallTouched = this
                        // alert("ajout de " + ball.firstBallTouched.visual.classList)
                    }
            }
        })

        if (this.empoche()){
            empoche(this.visual)
            if (!this.whiteBall){
                game.removeChild(this.visual)
                a.splice(a.indexOf(this), 1)
                console.log(a)
            }
        }
    }
    empoche(){
        if (this.x < 6.3)
            if (this.y < 13.5 || this.y > 84)
                return true
        if (this.x > 48 && this.x < 51)
            if (this.y < 13.5 || this.y > 84)
                return true            
        if (this.x > 92)
            if (this.y < 13.5 || this.y > 84)
                return true
        return false
    }
    resolveCollision(ball1, ball2) {
        const dx = ball2.center[0] - ball1.center[0]
        const dy = ball2.center[1] - ball1.center[1]
        
        // Angle de collision
        const sin = dy / getLength(dx, dy)
        const cos = dx / getLength(dx, dy)

        const depth = [Ball.width - Math.abs(dx), Ball.height - Math.abs(dy)]
        ball1.x -= depth[0] * cos
        ball1.y -= depth[1] * sin
        ball2.x += depth[0] * cos
        ball2.y += depth[1] * sin

        // Vitesses avant collision
        const v1 = { x: ball1.vx * cos + ball1.vy * sin, y: ball1.vy * cos - ball1.vx * sin }
        const v2 = { x: ball2.vx * cos + ball2.vy * sin, y: ball2.vy * cos - ball2.vx * sin }

        // Échange des vitesses en x
        let vxTemp = v1.x
        v1.x = v2.x
        v2.x = vxTemp

        // Conversion des vitesses après collision
        ball1.vx = v1.x * cos - v1.y * sin
        ball1.vy = v1.y * cos + v1.x * sin
        ball2.vx = v2.x * cos - v2.y * sin
        ball2.vy = v2.y * cos + v2.x * sin

        if (ball1.whiteBall){
            // alert("1 : " + dx + "   " + dy)
            let temp = getLength(ball2.vx, ball2.vy) / getLength(dx, dy)
            ball2.vx = dx * temp
            ball2.vy = -dy * temp
        } else if (ball2.whiteBall){
            // alert("2 : " + dx + "   " + dy)
            let temp = getLength(ball1.vx, ball1.vy) / getLength(dx, dy)
            ball1.vx = -dx * temp
            ball1.vy = dy * temp
        }
        ball1.move(true)
        ball2.move(true)        
    }
}


//////////////////////////////// GAME //////////////////////////////////////////////
// Vérifier que toutes les balles sont fixes
const a = new (class extends Array{
    isFixed(){
        return !a.some(i => getLength(i.vx, i.vy) != 0)
    }
})

if (OSTYPE == "PC"){
    document.addEventListener('mousemove', OnMouseMove)
    document.addEventListener("DOMContentLoaded", () => document.addEventListener('mousedown', OnMouseDown))
}else{
    document.addEventListener('mousemove', OnMouseMoveOnMobile)
    document.addEventListener('mousedown', (e) =>{
        if (e.button === 0){
            isMouseDown = true
            OnMouseMove(e)
        }
    })
    document.addEventListener("DOMContentLoaded", () => document.addEventListener('mouseup', (e) =>{
        if (e.button === 0 && isMouseDown){
            isMouseDown = false
            OnMouseDown(e)
        }
    }))    
}

function OnMouseMoveOnMobile(e){
    if (isMouseDown) OnMouseMove(e)
}

function OnMouseMove(e){
    const whiteBallElement = whiteBall.visual
    const whiteBallRect = whiteBallElement.getClientRects()[0]
    const whiteBallPos = [whiteBallRect.left + (whiteBallRect.width / 2), whiteBallRect.top + (whiteBallRect.height / 2)]
    
    rect = game.getBoundingClientRect()

    direction = [whiteBall.center[0] - ((e.clientX - rect.left) * 100 / rect.width), whiteBall.center[1] - ((e.clientY - rect.top) * 100 / rect.height)]
    
    const angle = Math.atan2(whiteBallPos[1] - e.clientY, whiteBallPos[0] - e.clientX)
    whiteBallElement.children[0].style.transform = `rotate(${angle}rad)`
    whiteBallElement.children[0].children[0].style.transform = `translateX(30%)`
    whiteBallElement.children[0].children[1].style.transform = `translateX(-100%)`
    value.style.height = Clamp(getLength(direction[0], direction[1]), ValueExtrm[0], ValueExtrm[1]) + '%'
}

let Playing = setInterval(() => {
    a.forEach(b => {    
        b.move()
    })
    if (IsOnSolo)
        if (timer >= 0){
            TIME.textContent = parseInt(timer -= 0.01)
            if (a.isFixed())
                a[0].visual.children[0].style.display = "flex"
        }
        else
            EndGame()
}, 10)

function EndGame(){
    clearInterval(Playing)
    Playing = null

    if (OSTYPE == "PC")
        document.removeEventListener("mousemove", OnMouseMove)
    else
        document.removeEventListener("mousemove", OnMouseMoveOnMobile)

    if (IsOnSolo){
        alert("Vous avez perdu !")
        window.location.href = "./levels.html"
    }
}
