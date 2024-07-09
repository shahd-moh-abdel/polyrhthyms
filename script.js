const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let soundEnabled = true;

document.onvisibilitychange = () => soundEnabled = false;
canvas.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
});

const start = {
  x: canvas.width * 0.1,
  y: canvas.height * 0.8
};
const end = {
  x: canvas.width * 0.9,
  y: canvas.height * 0.8
};

const center = {
  x: canvas.width * 0.5,
  y: canvas.height * 0.8
};
const arcs = [
  
"#bdb2ff",
  "#b6acf6",
  "#afa5ec",
  "#a79ee3",
  "#a097d9",
  "#9891d0",
  "#918ac7",
  "#8a84bd",
  "#837db3",
  "#7b76aa",
  "#746fa0",
  "#6d6997",
  "#65628e",
  "#5e5b84",
  "#57557a",
  "#4f4e71",
  "#484868",
  "#41415e",
  "#393a55",
  "#32334b",
  "#2b2d42"
  
];

const length = end.x - start.x;
const initArcRadius = length * 0.05;

const spacing = (length / 2 - initArcRadius) / arcs.length;

ctx.strokeStyle = "white";
ctx.fillStyle = "white";
ctx.lineWidth = 6;

const startTime = new Date().getTime();

const calculateNextImpactTime = (currentImpactTime, velocity) => {
  return currentImpactTime + (Math.PI / velocity) * 1000;
};

const sounds = arcs.map((color, index) => {
  const audio = new Audio(`sounds/key-${index + 1}.wav`);
  audio.volume = 0.09;
  const oneFullLoop = 2 * Math.PI;
  const numberOfLoops = 50 - index;
  const velocity = (oneFullLoop * numberOfLoops) / 900;
  return {
    audio,
    nextImpactTime: calculateNextImpactTime(startTime, velocity),
    velocity
  };
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const currentTime = new Date().getTime();
  const elapsedTime = (currentTime - startTime) / 1000;
  const arcRadius = length * 0.05;

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

  ctx.save();
  arcs.forEach((arc, index) => {
    const arcRadius = initArcRadius + index * spacing;
    ctx.strokeStyle = arcs[index];
    ctx.lineWidth = 6;

    const oneFullLoop = 2 * Math.PI;
    const numberOfLoops = 50 - index;

    const velocity = (oneFullLoop * numberOfLoops) / 900;
    const maxAngle = 2 * Math.PI;
    const distance = Math.PI + elapsedTime * velocity;
    const modDistance = distance % maxAngle;
    const adjustedDistance =
      modDistance >= Math.PI ? modDistance : maxAngle - modDistance;

    const x = center.x + arcRadius * Math.cos(adjustedDistance);
    const y = center.y + arcRadius * Math.sin(adjustedDistance);

    // Arc
    ctx.beginPath();
    ctx.arc(center.x, center.y, arcRadius, Math.PI, 2 * Math.PI);
    ctx.stroke();

    // Circle
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Sound
    const sound = sounds[index];
    if (currentTime >= sound.nextImpactTime) {
      if (soundEnabled) {
        sound.audio.play();
      }
      sound.nextImpactTime = calculateNextImpactTime(sound.nextImpactTime, sound.velocity);
    }
  });
  ctx.restore();

  requestAnimationFrame(draw);
}

draw();
