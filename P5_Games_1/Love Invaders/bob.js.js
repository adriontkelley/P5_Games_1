function Bob(x, y) {
  
  this.pos = new p5.Vector(x, y);
  this.vel = p5.Vector.random2D();
  this.vel.mult(random(5));
  this.acc = new p5.Vector(0, 0);
  this.target = new p5.Vector(x, y);
  
  this.move = function() {
    let targetDist = dist(this.pos.x, this.pos.y, this.target.x, this.target.y);
    
    let proximityMult = 1;
    
    
    let distThresh = 50;
    if (targetDist < distThresh) {
      proximityMult = targetDist/distThresh;
    }
    
    
    this.vel.mult(0.95);
    
    
    if (targetDist > 1) {
      let steer = new p5.Vector(this.target.x, this.target.y);
      steer.sub(this.pos);
      steer.normalize();
      steer.mult(0.5*proximityMult);
      this.acc.add(steer);
    }
    
    
    let mouseDist = dist(this.pos.x, this.pos.y, mouseX, mouseY);
    let mouseThresh = 200;
    
    if (mouseDist < mouseThresh) {
      let push = new p5.Vector(this.pos.x, this.pos.y);
      push.sub(new p5.Vector(mouseX, mouseY));
      push.normalize();
      push.mult((mouseThresh-mouseDist)*0.02);
      this.acc.add(push);
    }
    
    
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
}