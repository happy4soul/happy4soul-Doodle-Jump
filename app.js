document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid")
  const doodler = document.createElement("div")
  let doodlerLeftSpace = 50
  let startPoint = 150
  let doodlerBottomSpace = startPoint
  let isGameOver = false;
  let platformCount = 5
  let platforms = []
  let upTimerId
  let downTimerId
  let isJumping = true
  let isGoingLeft = false
  let isGoingRight = false
  let leftTimerId
  let rightTimerId
  let score = 0

  function createDoodler() {
    grid.appendChild(doodler)
    doodler.classList.add("doodler")
    doodlerLeftSpace = platforms[0].left
    doodler.style.left = doodlerLeftSpace + "px"
    doodler.style.bottom = doodlerBottomSpace + "px"
  }

  class Platform {
    constructor(newPlatBottom) {
      this.bottom = newPlatBottom
      this.left = Math.random() * 315 //gridwidth - platformwidth
      this.visual = document.createElement("div")

      const visual = this.visual
      visual.classList.add("platform")
      visual.style.left = this.left + "px"
      visual.style.bottom = this.bottom + "px"
      grid.appendChild(visual)
    }
  }

  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
      let platGap = 600 / platformCount
      let newPlatBottom = 100 + i * platGap
      let newPlatform = new Platform(newPlatBottom)
      platforms.push(newPlatform)
      console.log(platforms)
    }
  }

  function movePlatforms() {
    if (doodlerBottomSpace > 200) { //we want the platforms to move only when the doodler is above a certain position, because, when the doodler reaches above, the platforms at the bottom, need to move up
      platforms.forEach(platform => {
        platform.bottom -= 4
        let visual = platform.visual
        visual.style.bottom = platform.bottom + "px"

        if (platform.bottom < 10) {
          let firstPlatform = platforms[0].visual
          firstPlatform.classList.remove("platform")
          platforms.shift()
          score++
          console.log(platforms)
          let newPlatform = new Platform(600)
          platforms.push(newPlatform)
        }
      })
    }
  }

  function jump() {
    clearInterval(downTimerId)
    isJumping = true
    upTimerId = setInterval(function() {
      doodlerBottomSpace += 20
      doodler.style.bottom = doodlerBottomSpace + "px"
      if (doodlerBottomSpace > startPoint + 200) {
        fall()
      }
    }, 30)
  }

  function fall() {
    clearInterval(upTimerId)
    isJumping = false
    downTimerId = setInterval(function() {
      doodlerBottomSpace -= 5
      doodler.style.bottom = doodlerBottomSpace + "px"
      if (doodlerBottomSpace <= 0) {
        gameOver()
      }
      platforms.forEach(platform => {
        if (
          (doodlerBottomSpace >= platform.bottom) &&
          (doodlerBottomSpace <= (platform.bottom + 15)) && //"+15" is mentioned because the height of the platform is 15 units
          ((doodlerLeftSpace + 60) >= platform.left) && // "+60" is mentioned because the width of the doodler is 60. if the sum of the doodler width and the leftspace is > platform left(i.e. platform starting), then only the doodler can land on the platform
          (doodlerLeftSpace <= (platform.left + 85)) && // "85" is mentioned because the total width of the platform is 85 units. if the doodler left space is smaller than the platformleft+85(which is the total length of the platform), then only the doodler will land on the platform
          !isJumping
        ) {
          console.log("landed")
          startPoint = doodlerBottomSpace
          jump()
        }
      })

    }, 30)
  }

  function gameOver() {
    console.log("Game Over")
    isGameOver = true
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild)
    }
    grid.innerHTML = score
    clearInterval(upTimerId)
    clearInterval(downTimerId)
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
  }

  function control(e) {
    if (e.key === "ArrowLeft") {
      moveLeft()
    } else if (e.key === "ArrowRight") {
      moveRight()
    } else if (e.key === "ArrowUp") {
      moveStraight()
    }
  }

  function moveLeft() {
    if (isGoingRight) {
      clearInterval(rightTimerId)
      isGoingRight = false
    }
    isGoingLeft = true
    clearInterval(rightTimerId)
    leftTimerId = setInterval(function() {
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 5
        doodler.style.left = doodlerLeftSpace + "px"
      } else moveRight()

    }, 20)
  }

  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId)
      isGoingLeft = false
    }
    isGoingRight = true
    clearInterval(leftTimerId)
    rightTimerId = setInterval(function() {
      if (doodlerLeftSpace <= 340) {
        doodlerLeftSpace += 5
        doodler.style.left = doodlerLeftSpace + "px"
      } else moveLeft()
    }, 20)
  }

  function moveStraight() {
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
    isGoingLeft = false
    isGoingRight = false

  }

  function start() {
    if (!isGameOver) {
      createPlatforms()
      createDoodler()
      setInterval(movePlatforms, 30)
      jump()
      document.addEventListener("keyup", control)
    }
  }
  //attach to starting button
  function startingButton() {
    document.querySelector(".start-game").addEventListener("click", start)

  }
  startingButton()

})
