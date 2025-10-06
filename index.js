const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const gravity = 0.5
class Player {
    constructor(){
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }

        this.width = 30
        this.height = 30
        this.isOnPlatform = null
        this.relativeY = 0
    }

    draw(){
        c.fillStyle = 'black'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
        // this.position.y += this.velocity.y
        // this.position.x += this.velocity.x

        // if(this.position.y + this.height + this.velocity.y <= canvas.height)
        //     this.velocity.y += gravity
        // else this.velocity.y = 0
        if (this.isOnPlatform) {
            const p = this.isOnPlatform
            this.position.y = p.position.y - this.height + this.relativeY
        } else {
            this.position.y += this.velocity.y
            if (this.position.y + this.height < canvas.height)
                this.velocity.y += gravity
            else this.velocity.y = 0
        }

        this.position.x += this.velocity.x
    }
}

class Platform {
    constructor({x, y}) {
        this.position = {
            x,
            y
        }

        this.width = 200
        this.height = 20
    }
    
    draw(){
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Obstacle {
    constructor({x, y}) {
        this.position = {
            x,
            y
        }

        this.width = 100
        this.height = 20
    }
    
    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

function init(){
    player = new Player()
    platforms = [new Platform({x:200, y:400}), new Platform({x:500, y:300}), new Platform({x:0, y:580}), new Platform({x:200, y:580}), new Platform({x:400, y:580})]
    obstacles = [new Obstacle({x:200, y:200}), new Obstacle({x:400, y:200})]
}

let player = new Player()
let platforms = [new Platform({x:200, y:400}), new Platform({x:500, y:300}), new Platform({x:0, y:580}), new Platform({x:200, y:580}), new Platform({x:400, y:580})]
let obstacles = [new Obstacle({x:200, y:200}), new Obstacle({x:400, y:200})]

let keys = {
    right:{
        pressed: false
    },
    left:{
        pressed: false
    }
}

function animate(){
    requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width,canvas.height)
    player.update()
    platforms.forEach(platform => {
        platform.draw()
    })
    obstacles.forEach(obstacle => {
        obstacle.draw()
    })


    if(keys.right.pressed && player.position.x < 500){
        player.velocity.x = 5
    } else if(keys.left.pressed && player.position.x > 100){
        player.velocity.x = -5
    } else {
        player.velocity.x = 0

        if(keys.right.pressed){
            platforms.forEach(platform => {
            platform.position.x -= 5
            })
            obstacles.forEach(obstacle => {
            obstacle.position.x -= 5
            })
            
        } else if(keys.left.pressed){
            platforms.forEach(platform => {
            platform.position.x += 5
            })
            obstacles.forEach(obstacle => {
            obstacle.position.x += 5
            })
        }
    }

    let standingPlatform = null
    platforms.forEach(platform => {
        const onTopOfPlatform =
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width

        if (onTopOfPlatform) {
            player.velocity.y = 0
            player.position.y = platform.position.y - player.height
            standingPlatform = platform
        }
    })

    // 플랫폼 위에 있는 경우 추적
    if (standingPlatform) {
        // 새로 올라탐
        if (player.isOnPlatform !== standingPlatform) {
            player.isOnPlatform = standingPlatform
            player.relativeY = 0 // 플랫폼과의 상대 높이 저장
        }
    } else {
        player.isOnPlatform = null
    }
    obstacles.forEach(obstacle => {
    const collided =
        player.position.x < obstacle.position.x + obstacle.width &&
        player.position.x + player.width > obstacle.position.x &&
        player.position.y < obstacle.position.y + obstacle.height &&
        player.position.y + player.height > obstacle.position.y

    if (collided) {
        init()
    }
})
}

animate()

addEventListener('keydown', ({keyCode}) => {
    //console.log(keyCode)
    switch(keyCode){
        case 65:
        case 37:
            //console.log('left')
            keys.left.pressed = true
            break
        case 83:
        case 40:
            //console.log('down')
            break
        case 68:
        case 39:
            //console.log('right')
            keys.right.pressed = true
            break
        case 87:
        case 38:
            //console.log('up')
            if(player.velocity.y == 0){
                player.velocity.y -= 15
            }
            
            break 
    }
})

addEventListener('keyup', ({keyCode}) => {
    //console.log(keyCode)
    switch(keyCode){
        case 65:
        case 37:
            //console.log('left')
            keys.left.pressed = false
            break
        case 83:
        case 40:
            //console.log('down')
            break
        case 68:
        case 39:
            //console.log('right')
            keys.right.pressed = false
            break
        case 87:
        case 38:
            //console.log('up')
            break 
    }
})

// addEventListener('wheel', (event) => {
//     const scale = event.deltaY < 0 ? 1.1 : 0.9
//     const minSize = 20
//     const maxSize = 500

//     ;[...platforms, ...obstacles].forEach(obj => {
//         const oldWidth = obj.width
//         const oldHeight = obj.height

//         // 최소/최대 제한 확인
//         if (
//             (scale > 1 && (oldWidth >= maxSize || oldHeight >= maxSize)) ||
//             (scale < 1 && (oldWidth <= minSize || oldHeight <= minSize))
//         ) return

//         const newWidth = Math.min(maxSize, Math.max(minSize, oldWidth * scale))
//         const newHeight = Math.min(maxSize, Math.max(minSize, oldHeight * scale))

//         const centerX = obj.position.x + oldWidth / 2
//         const centerY = obj.position.y + oldHeight / 2

//         obj.width = newWidth
//         obj.height = newHeight
//         obj.position.x = centerX - newWidth / 2
//         obj.position.y = centerY - newHeight / 2

//         if (player.isOnPlatform === obj) {
//             player.position.y = obj.position.y - player.height + player.relativeY
//         }
//     })
// })

const zoomSlider = document.getElementById('zoomSlider')
let lastZoom = 1 // 이전 확대 비율 저장 (비교용)

zoomSlider.addEventListener('input', (event) => {
    const zoomValue = Number(event.target.value) / 100 // 100 → 1.0배 기준
    const scale = zoomValue / lastZoom // 변화 비율 계산
    lastZoom = zoomValue // 현재 비율 저장

    const minSize = 20
    const maxSize = 500

    ;[...platforms, ...obstacles].forEach(obj => {
        const oldWidth = obj.width
        const oldHeight = obj.height

        // 새 크기 계산
        const newWidth = Math.min(maxSize, Math.max(minSize, oldWidth * scale))
        const newHeight = Math.min(maxSize, Math.max(minSize, oldHeight * scale))

        // 중심(anchor) 유지
        const centerX = obj.position.x + oldWidth / 2
        const centerY = obj.position.y + oldHeight / 2

        obj.width = newWidth
        obj.height = newHeight
        obj.position.x = centerX - newWidth / 2
        obj.position.y = centerY - newHeight / 2

        // 플레이어가 플랫폼 위에 있다면 보정
        if (player.isOnPlatform === obj) {
            player.position.y = obj.position.y - player.height + player.relativeY
        }
    })
})