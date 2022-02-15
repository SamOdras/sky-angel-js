import { useEffect, useCallback, useRef } from "react";
import cloudImg from "../assets/cloud-1.png";
import aircraft from "../assets/aircraft.png";
import parachute from "../assets/parachute.png";
import star from "../assets/star.png";
import bird from "../assets/bird.png";

let lastTime;
let speedScale;
let SPEED_SCALE_INSCRASE = 0.0001;
let prevTimer;
let gameStatus = "";
let timer;
let score;
let bestScore = 0;
let bestTimer = 0;
let isPaused = false;

let MOVE_SPEED = 0.45;
const GRAVITY = 0.0015;

let rightVelocity = MOVE_SPEED;
let upVelocity = MOVE_SPEED;
let downVelocity = MOVE_SPEED;
let leftVelocity = MOVE_SPEED;
let key = "";

let timeout;
const count = () => {
  timeout = setTimeout(() => {
    key = "";
  }, 200);
};


const getCustomProperty = (elem, prop) => {
  return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
};
const setCustomProperty = (elem, prop, value) => {
  elem.style.setProperty(prop, `${value}px`);
};
const incrementCustomProperty = (elem, prop, inc) => {
  setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc);
};

const Game = (props) => {
  const { setTime, setScore, setIsPlaying, postData } = props;
  const cloud01 = useRef();
  const cloud02 = useRef();
  const cloud03 = useRef();
  const star01 = useRef();
  const parachute01 = useRef();
  const plane01 = useRef();
  const bird01 = useRef();
  const bird02 = useRef();
  const bird03 = useRef();
  const timer01 = useRef();
  const score01 = useRef();
  const overlayTitle = useRef();
  const overlay01 = useRef();
  const overlaySubtitle = useRef();

  // GET HIT BOX
  const getStarRect = () => {
    return star01.current.getBoundingClientRect();
  };
  const getParachuteRect = () => {
    return parachute01.current.getBoundingClientRect();
  };
  const getPlaneRect = () => {
    return plane01.current.getBoundingClientRect();
  };
  const getBirdsRect = () => {
    let b1 = bird01.current;
    let b2 = bird02.current;
    let b3 = bird03.current;
    return [
      b1.getBoundingClientRect(),
      b2.getBoundingClientRect(),
      b3.getBoundingClientRect()
    ];
  };

  // REACTION IF OBJECT GET HIT
  const checkHitParachute = () => {
    const plane = getPlaneRect();
    const parachute = getParachuteRect();
    return isCollision(parachute, plane);
  };
  const checkHitStar = () => {
    const star = getStarRect();
    const plane = getPlaneRect();
    return isCollision(star, plane);
  };
  const checkLose = () => {
    const planeRect = getPlaneRect();
    return getBirdsRect().some(rect => isCollision(rect, planeRect));
  };
  const isCollision = (rect1, rect2) => {
    return (
      rect1.left < rect2.right &&
      rect1.top < rect2.bottom &&
      rect1.right > rect2.left &&
      rect1.bottom > rect2.top
    );
  };
  const handleLose = () => {
    setTimeout(() => {
      document.addEventListener("keydown", handleStart, { once: true });
      overlay01.current.style.display = "block";
      overlayTitle.current.textContent = "Game Over!";
      overlaySubtitle.current.textContent = `Total Score is ${score}`;
      if(score > bestScore) bestScore = score
      if(timer > bestTimer) bestTimer = timer;
      setTime(bestTimer)
      setScore(bestScore)
      setIsPlaying(false)
      postData(bestScore, bestTimer)
      gameStatus = "";
    }, 100);
  };
  const pause = () => {
    const ctrl = e => {
      let code = e.code;
      if (code !== "Space" || gameStatus === "") {
        gameStatus = "paused";
        return;
      }
      isPaused = !isPaused;
      if (!isPaused) {
        setIsPlaying(true);
        window.requestAnimationFrame(update);
      } else {
        setIsPlaying(false)
      }
    };
    document.addEventListener("keydown", ctrl);
  };

  // INITIAL SETUP
  const setupBird = () => {
    let b1 = bird01.current;
    let b2 = bird02.current;
    let b3 = bird03.current;

    setCustomProperty(b1, "top", Math.random() * 300);
    setCustomProperty(b2, "top", Math.random() * 300);
    setCustomProperty(b3, "top", Math.random() * 300);
    setCustomProperty(b1, "left", 1200);
    setCustomProperty(b2, "left", 800);
    setCustomProperty(b3, "left", 400);
  };
  const setupParachute = () => {
    setCustomProperty(parachute01.current, "top", -900);
    setCustomProperty(parachute01.current, "right", Math.random() * 900);
  };
  const setupStar = () => {
    setCustomProperty(star01.current, "top", -300);
    setCustomProperty(star01.current, "left", Math.random() * 900);
  };
  const setupCloud = () => {
    setCustomProperty(cloud01.current, "left", 0);
    setCustomProperty(cloud02.current, "left", 600);
    setCustomProperty(cloud03.current, "left", 1200);
  };
  const setupPlane = () => {
    const planeController = e => {
      clearTimeout(timeout);
      let code = e.code;
      if (code === "ArrowRight") {
        rightVelocity = MOVE_SPEED;
        key = code;
      } else if (code === "ArrowUp") {
        key = code;
        upVelocity = MOVE_SPEED;
      } else if (code === "ArrowDown") {
        key = code;
        downVelocity = MOVE_SPEED;
      } else if (code === "ArrowLeft") {
        key = code;
        leftVelocity = MOVE_SPEED;
      }
      count();
    };
    const removeKey = e => {
      key = "";
      rightVelocity = null;
      upVelocity = null;
      downVelocity = null;
    };
    document.removeEventListener("keydown", planeController);
    document.addEventListener("keydown", planeController);
    document.addEventListener("keyup", removeKey);
    document.removeEventListener("keyup", removeKey);
  };

  // CONTROLLER
  const updateScore = () => {
    score += 1;
    timer += 1;
    score01.current.textContent = `Score: ${score}`;
    setupStar();
  };
  const updateAddTimer = () => {
    timer += 10;
    timer01.current.textContent = `Fuel: ${Math.floor(timer)}`;
    setupParachute();
  };
  const updateTimer = (delta, count) => {
    timer = count;
    timer -= delta * 0.001;
    if (timer <= 0) return true;
    timer01.current.textContent = `Fuel: ${Math.floor(timer)}`;
    return false;
  };
  const updatePlane = delta => {
    const item = plane01.current;
    if (key === "ArrowRight" && getCustomProperty(item, "right") >= 0) {
      incrementCustomProperty(item, "left", rightVelocity * delta);
      rightVelocity -= GRAVITY * delta;
    } else if (key === "ArrowLeft" && getCustomProperty(item, "left") >= 0) {
      incrementCustomProperty(item, "left", leftVelocity * delta * -1);
      leftVelocity -= GRAVITY * delta;
    } else if (key === "ArrowUp" && getCustomProperty(item, "top") >= 0) {
      incrementCustomProperty(item, "bottom", upVelocity * delta);
      upVelocity -= GRAVITY * delta;
    } else if (key === "ArrowDown" && getCustomProperty(item, "bottom") >= 0) {
      incrementCustomProperty(item, "bottom", downVelocity * delta * -1);
      downVelocity -= GRAVITY * delta;
    }
  };
  const updateParachute = delta => {
    let item = parachute01.current;
    let SPEED = 0.07;
    incrementCustomProperty(item, "top", delta * SPEED * 1);
    if (getCustomProperty(item, "top") >= 400) {
      incrementCustomProperty(item, "top", -800);
      setCustomProperty(item, "right", Math.random() * 900);
    }
  };
  const updateStar = delta => {
    let item = star01.current;
    let SPEED = 0.07;
    incrementCustomProperty(item, "top", delta * SPEED * 1);
    if (getCustomProperty(item, "top") >= 400) {
      incrementCustomProperty(item, "top", -800);
      setCustomProperty(star01.current, "left", Math.random() * 900);
    }
  };
  const updateCloud = (delta, speedScale) => {
    let SPEED = 0.05;
    let item1 = cloud01.current;
    let item2 = cloud02.current;
    let item3 = cloud03.current;
    incrementCustomProperty(item1, "left", delta * speedScale * SPEED * -1);
    incrementCustomProperty(item2, "left", delta * speedScale * SPEED * -1);
    incrementCustomProperty(item3, "left", delta * speedScale * SPEED * -1);

    if (getCustomProperty(item1, "left") <= -400) {
      incrementCustomProperty(item1, "left", 1500);
    }
    if (getCustomProperty(item2, "left") <= -400) {
      incrementCustomProperty(item2, "left", 1500);
    }
    if (getCustomProperty(item3, "left") <= -400) {
      incrementCustomProperty(item3, "left", 1500);
    }
  };
  const updateBird = (delta, speedScale) => {
    let SPEED = 0.07;
    let b1 = bird01.current;
    let b2 = bird02.current;
    let b3 = bird03.current;

    incrementCustomProperty(b1, "left", delta * speedScale * SPEED * -1);
    incrementCustomProperty(b2, "left", delta * speedScale * SPEED * -1);
    incrementCustomProperty(b3, "left", delta * speedScale * SPEED * -1);

    if (getCustomProperty(b1, "left") <= -400) {
      incrementCustomProperty(b1, "left", 1500);
      setCustomProperty(b1, "top", Math.random() * 300);
    }
    if (getCustomProperty(b2, "left") <= -400) {
      incrementCustomProperty(b2, "left", 1500);
      setCustomProperty(b2, "top", Math.random() * 300);
    }
    if (getCustomProperty(b3, "left") <= -400) {
      incrementCustomProperty(b3, "left", 1500);
      setCustomProperty(b3, "top", Math.random() * 300);
    }
  };

  // MAIN ENGINE
  const update = useCallback(time => {
    if (lastTime == null) {
      lastTime = time;
      window.requestAnimationFrame(update);
      return;
    }
    const delta = time - lastTime;
    lastTime = time;
    if (!isPaused) {
      overlay01.current.style.display = "none";
      if (prevTimer) {
        timer = prevTimer;
        prevTimer = null;
        timer01.current.textContent = `Fuel: ${Math.floor(timer)}`;
      } else {
        updateCloud(delta, speedScale);
        updateStar(delta);
        updateParachute(delta);
        updatePlane(delta);
        updateBird(delta, speedScale);

        if (checkHitStar()) updateScore();

        if (checkLose() || timer === 0) return handleLose();
        updateSpeedScale(delta);

        if (checkHitParachute()) updateAddTimer();
        else if (updateTimer(delta, timer)) return handleLose();
      }
      window.requestAnimationFrame(update);
    } else {
      overlay01.current.style.display = "block";
      overlayTitle.current.textContent = "Paused!";
      overlaySubtitle.current.textContent = "Press spacebar to continue!";
      prevTimer = timer;
    }
  }, []);

  const updateSpeedScale = delta => {
    speedScale += delta * SPEED_SCALE_INSCRASE;
  };

  // MOUNT INITIAL SETUP
  useEffect(() => {
    setupCloud();
    setupStar();
    setupParachute();
    setupPlane();
    setupBird();
    pause();
    document.addEventListener("keydown", handleStart, { once: true });
  }, []);

  const handleStart = () => {
    lastTime = null;
    speedScale = 1;
    timer = 100;
    score = 0;
    timer01.current.textContent = `Fuel: ${timer}`;
    score01.current.textContent = `Score: ${score}`;
    overlayTitle.current.textContent = "Press Start to Play !";
    overlay01.current.style.display = "none";
    window.requestAnimationFrame(update);
    setIsPlaying(true)
    setupCloud();
    setupStar();
    setupParachute();
    setupPlane();
    setupBird();
  };

  return (
    <>
      <div className="world">
        <div className="overlay" ref={overlay01}>
          <div className="overlay-title" ref={overlayTitle}>
            Press any key to start !
          </div>
          <small className="overlay-subtitle" ref={overlaySubtitle}></small>
        </div>
        <div className="status-position">
          <div
            className="score"
            ref={timer01}
            style={{ marginRight: "30px", marginTop: "10px" }}
          >
            Fuel: 0
          </div>
          <div
            className="fuel"
            ref={score01}
            style={{ marginRight: "20px", marginTop: "10px" }}
          >
            Score: 0
          </div>
        </div>
        <img src={cloudImg} ref={cloud01} className="cloud-1" alt="cloud" />
        <img src={cloudImg} ref={cloud02} className="cloud-2" alt="cloud" />
        <img src={cloudImg} ref={cloud03} className="cloud-3" alt="cloud" />
        <img src={aircraft} ref={plane01} className="aircraft" alt="aircraft" />
        <img src={bird} ref={bird01} className="bird-1" alt="bird" />
        <img src={bird} ref={bird02} className="bird-2" alt="bird" />
        <img src={bird} ref={bird03} className="bird-3" alt="bird" />
        <img
          src={parachute}
          ref={parachute01}
          className="parachute"
          alt="parachute"
        />
        <img src={star} ref={star01} className="star" alt="star" />
      </div>
    </>
  );
}

export default Game;
