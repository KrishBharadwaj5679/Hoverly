const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const dot = document.getElementById("dot");
const ring = document.getElementById("ring");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let ringPos = { x: mouse.x, y: mouse.y };

const colors = ["#7ee8fa", "#eec0c6", "#a29bfe", "#ffeaa7", "#55efc4"];

class Particle {
  constructor(x, y, burst = false) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = burst ? Math.random() * 6 + 2 : Math.random() * 1.5 + 0.3;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 1;
    this.decay = burst
      ? 0.015 + Math.random() * 0.01
      : 0.02 + Math.random() * 0.02;
    this.size = burst ? Math.random() * 4 + 2 : Math.random() * 2.5 + 1;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.life -= this.decay;
  }

  draw() {
    ctx.globalAlpha = Math.max(this.life, 0);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
}

let particles = [];

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  dot.style.left = mouse.x + "px";
  dot.style.top = mouse.y + "px";

  for (let i = 0; i < 2; i++) {
    particles.push(new Particle(mouse.x, mouse.y));
  }
});

window.addEventListener("click", (e) => {
  for (let i = 0; i < 40; i++) {
    particles.push(new Particle(e.clientX, e.clientY, true));
  }
  ring.style.transform = "translate(-50%, -50%) scale(1.6)";
  setTimeout(() => {
    ring.style.transform = "translate(-50%, -50%) scale(1)";
  }, 150);
});

// touch support
window.addEventListener(
  "touchmove",
  (e) => {
    const t = e.touches[0];
    mouse.x = t.clientX;
    mouse.y = t.clientY;
    dot.style.left = mouse.x + "px";
    dot.style.top = mouse.y + "px";
    for (let i = 0; i < 2; i++) {
      particles.push(new Particle(mouse.x, mouse.y));
    }
  },
  { passive: true },
);

function animate() {
  ctx.fillStyle = "rgba(11, 14, 26, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // smooth ring follow
  ringPos.x += (mouse.x - ringPos.x) * 0.15;
  ringPos.y += (mouse.y - ringPos.y) * 0.15;
  ring.style.left = ringPos.x + "px";
  ring.style.top = ringPos.y + "px";

  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  particles = particles.filter((p) => p.life > 0);

  requestAnimationFrame(animate);
}

animate();
