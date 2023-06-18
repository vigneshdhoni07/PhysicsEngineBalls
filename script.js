console.log("JS Physics Engine");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let x = 100;
let y = 100;
let LEFT, RIGHT, UP, DOWN;
let velocity = 5;
let friction = 0.05;
const BALLZ = [];

function precise(number, precision) {
  let factor = 10 ** precision;
  return Math.round(number * factor) / factor;
}

function col_detect(b1, b2) {
  // console.log(b1.r);
  // console.log(b2.r);
  // console.log(b2.pos.subtract(b1.pos).mag());
  // console.log(b1.r + b2.r >= b2.pos.subtract(b1.pos).mag());
  if (b1.r + b2.r >= b2.pos.subtract(b1.pos).mag()) {
    return true;
  } else {
    return false;
  }
}
function pen_depth_bb(b1, b2) {
  let dist = b1.pos.subtract(b2.pos);
  let pen_depth = b1.r + b2.r - dist.mag();
  let pen_res = dist.unit().mul(pen_depth / 2);
  b1.pos = b1.pos.add(pen_res);
  b2.pos = b2.pos.add(pen_res.mul(-1));
}
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }
  subtract(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }
  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
  mul(n) {
    return new Vector(this.x * n, this.y * n);
  }
  static dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }
  unit() {
    if (this.mag() == 0) {
      return new Vector(0, 0);
    } else {
      return new Vector(this.x / this.mag(), this.y / this.mag());
    }
  }
  normal() {
    return new Vector(-this.y, this.x).unit();
  }
  drawVec(start_x, start_y, n, color) {
    ctx.beginPath();
    ctx.arc(550, 420, 50, 0, Math.PI * 2);
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(start_x, start_y);
    ctx.lineTo(start_x + this.x * n, start_y + this.y * n);
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}

class Ball {
  constructor(x, y, r) {
    // this.x = x;
    // this.y = y;
    this.pos = new Vector(x, y);
    this.r = r;
    this.player = false;
    this.vel = new Vector(0, 0);

    this.acc = new Vector(0, 0);
    // this.vel_x = 0;
    // this.vel_y = 0;

    // this.acc_x = 0;
    // this.acc_y = 0;
    this.acceleration = 1;
    BALLZ.push(this);
  }
  drawBall() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.fillStyle = "yellow";
    ctx.fill();
  }
  display() {
    this.vel.drawVec(550, 400, 10, "red");
    this.acc.unit().drawVec(550, 400, 50, "green");

    // ctx.beginPath();
    // ctx.moveTo(this.x, this.y);
    // ctx.lineTo(this.x + this.acc_x * 100, this.y + this.acc_y * 100);
    // ctx.strokeStyle = "green";
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.moveTo(this.x, this.y);
    // ctx.lineTo(this.x + this.vel_x * 10, this.y + this.vel_y * 10);
    // ctx.strokeStyle = "red";
    // ctx.stroke();
  }
}
canvas.addEventListener("keydown", (event) => {
  if (event.keyCode == 37) {
    console.log("LEFT");

    LEFT = true;
  }
  if (event.keyCode == 38) {
    console.log("UP");

    UP = true;
  }
  if (event.keyCode === 39) {
    console.log("RIGHT");

    RIGHT = true;
  }
  if (event.keyCode === 40) {
    console.log("DOWN");
    DOWN = true;
  }
});
canvas.addEventListener("keyup", (event) => {
  if (event.keyCode == 37) {
    console.log("LEFT");
    LEFT = false;
  }
  if (event.keyCode == 38) {
    console.log("UP");
    UP = false;
  }
  if (event.keyCode === 39) {
    console.log("RIGHT");

    RIGHT = false;
  }
  if (event.keyCode === 40) {
    console.log("DOWN");
    DOWN = false;
  }
});

function keyControl(b) {
  // console.log(b.x,b.vel);
  if (LEFT) {
    // b.acc_x= -b.acceleration;
    // console.log(b.vel);
    b.acc.x = -b.acceleration;
  }
  if (RIGHT) {
    // b.acc_x = b.acceleration;
    b.acc.x = b.acceleration;
  }
  if (UP) {
    // b.acc.y = -b.acceleration;
    b.acc.y = -b.acceleration;
  }
  if (DOWN) {
    // b.acc.y = b.acceleration;
    b.acc.y = b.acceleration;
  }
  if (!UP && !DOWN) {
    // b.acc.y = 0;
    b.acc.y = 0;
  }
  if (!RIGHT && !LEFT) {
    // b.acc.x = 0;
    b.acc.x = 0;
  }
  // b.vel_x += b.acc_x;
  // b.vel_y += b.acc_y;
  b.acc = b.acc.unit().mul(b.acceleration);
  b.vel = b.vel.add(b.acc);

  // b.vel = b.vel.add(b.acc);
  // b.vel = b.vel.mul(1 - friction);
  // b.vel_x *= 1 - friction;
  // b.vel_y *= 1 - friction;
  b.vel = b.vel.mul(1 - friction);
  // b.drawVec(b.vel.x, b.vel.y, 10, "red");
  // console.log(b.vel.x, b.vel.y);
  // b.x += b.vel.x;
  // b.y += b.vel.y;
  b.pos = b.pos.add(b.vel);
  // console.log(b.x, b.y);
}
let distanceVector = new Vector(0, 0);
function mainLoop() {
  // Do whatever
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  // Ball1.drawBall();
  //   Ball2.drawBall();

  BALLZ.forEach((e, index) => {
    e.drawBall();
    if (e.player) {
      keyControl(e);
    }
    for (let i = 0; i < BALLZ.length; i++) {
      if (col_detect(BALLZ[index], BALLZ[i])) {
        pen_depth_bb(BALLZ[index], BALLZ[i]);
        ctx.fillText("Collided", 500, 330);
      }
    }

    e.display();
  });
  // distanceVector = Ball2.pos.subtract(Ball1.pos);

  // ctx.fillText("Distance: " + precise(distanceVector.mag(), 2), 500, 330);
  // ctx.fillText("Radius 1: " + Ball1.r, 500, 340);
  // ctx.fillText("Radius 1: " + Ball2.r, 500, 350);
  // ctx.fillText("Radius Sum:" + (Ball1.r + Ball2.r), 500, 360);

  requestAnimationFrame(mainLoop);
}
requestAnimationFrame(mainLoop);

let Ball1 = new Ball(100, 100, 30);
let Ball2 = new Ball(300, 300, 40);
Ball1.player = true;
// Ball2.player = true;
// Ball1.velocity = 5;
// BALLZ.forEach((e) => {
//   console.log(e);
// });
// setInterval(() => {
//   ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
//   Ball1.drawBall();
//   keyControl(Ball1);
// }, 1000);
// keyControl(Ball1);
