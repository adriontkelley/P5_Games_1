

var song, analyzer;


var voronoi;
var boundingBox;
var diagram;

var bobCount = 300;
var bobs = [];
var globalHue;
var showPoints = true;
var debug = false;



var creatures = [];
var ropes = [];
var collisionSize;
var debugMode = false;

var gravitySlider;
var airDragSlider;
var frizzSlider;
var collisionSizeSlider;
var debugButton;


function preload() {
  song = loadSound('data/Love_Invaders.mp3');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
song.loop();


analyzer = new p5.Amplitude();


analyzer.setInput(song);


textAlign(CENTER);
  colorMode(HSB, 255);
  
  globalHue = random(255);
  
  voronoi = new Voronoi();
  boundingBox = {xl:1, xr:width-1, yt:1, yb:height-1};
  
  for (let i = 0; i < bobCount; i++) {
    bobs[i] = new Bob(random(width), random(height));
  }


  
  
  gravitySlider = new SliderLayout("Gravity", 0.1, 1, 0.5, 0.1, 1000, 1000);
  airDragSlider = new SliderLayout("Air drag", 0.1, 0.5, 0.2, 0.1, 1000, 1700);
  elasticitySlider = new SliderLayout("Elasticity", 0.01, 0.2, 0.1, 0.01, 1000, 2400);
  frizzSlider = new SliderLayout("Frizz", 0, 1, 0.5, 0.05, 1000, 3100);
  collisionSizeSlider = new SliderLayout("Collision size", 100, 100, 100, 1, 1000, 3800);
  debugButton = createButton("Toggle debug display");
  debugButton.position(100, collisionSizeSlider.slider.position().y+40);
  debugButton.mousePressed(debugButtonOnClick);
  
  
  creatures.push(new Creature(width/4, height/4));
  creatures.push(new Creature(width-width/4, height/4));
  creatures.push(new Creature(width/2, height-height/4));
} 


function draw() {
  background(globalHue, 150, 255);

var rms = analyzer.getLevel();





  for (let i = 0; i < bobs.length; i++) {
    bobs[i].move();
  }
  
  
  let transform = [];
  
  for (let i = 0; i < bobs.length; i++) {
    transform.push({x:bobs[i].pos.x, 
                  y:bobs[i].pos.y, 
                  color:color(globalHue, 150, 150, bobs[i].vel.mag()*10)});
  }

  voronoi.recycle(diagram);
  diagram = voronoi.compute(transform, boundingBox);
  
  for (let i = 0; i < diagram.cells.length; i++) {
    if (!diagram.cells[i].halfedges.length) {
      continue;
    }
    
    fill(diagram.cells[i].site.color);
    
    if (debug) {
      stroke(random(255));
      strokeWeight(0.1+rms);
    } else {
      noStroke();
    }
    
   
    beginShape();
    for (let j = 0; j < diagram.cells[i].halfedges.length; j++) {
      let v = diagram.cells[i].halfedges[j].getStartpoint();
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
  
  
  if (debug || showPoints) {
    for (let i = 0; i < bobs.length; i++) {
      if (debug) {
        stroke(0, 100);
        strokeWeight(3);
      } else {
        stroke(globalHue, 150, 100, bobs[i].vel.mag()*5);
        strokeWeight(bobs[i].vel.mag()*1.5);
      }

      point(bobs[i].pos.x, bobs[i].pos.y);
    }
  }
  
  

  
  collisionSize = collisionSizeSlider.value();
  
  
  
  var nFreq = 0.05;
  var nSpeed = 50;
  
  for (var c = 0; c < creatures.length; c++) {
    var cre = creatures[c];
    
   
    var nx = noise(cre.fOffset+frameCount*nFreq)*nSpeed-nSpeed*0.5;
    var ny = noise(cre.fOffset+1000+frameCount*nFreq)*nSpeed-nSpeed*0.5;
    
    

    
    if (cre.dir.x > 1) {
      cre.pos.x += nx;
    } else {
      cre.pos.x -= nx;
    }
    
    if (cre.dir.y > 1) {
      cre.pos.y += ny;
    } else {
      cre.pos.y -= ny;
    }
    
    
    if (cre.pos.x < 0) {
      cre.pos.x = 0;
      cre.dir.x *= -1;
    } else if (cre.pos.x > width) {
      cre.pos.x = width;
      cre.dir.x *= -1;
    }

    if (cre.pos.y < 0) {
      cre.pos.y = 0;
      cre.dir.y *= -1;
    } else if (cre.pos.y > height) {
      cre.pos.y = height;
      cre.dir.y *= -1;
    }
    


    
    for (var i = 0; i < cre.ropes.length; i++) {
      for (var j = 0; j < cre.ropes[i].objs.length; j++) {
        var d = dist(mouseX, mouseY, cre.ropes[i].objs[j].pos.x, cre.ropes[i].objs[j].pos.y);

        if (d < collisionSize) {
          
          var force = new p5.Vector(cre.ropes[i].objs[j].pos.x, cre.ropes[i].objs[j].pos.y);
          force.sub(mouseX, mouseY);
          force.normalize();
          force.mult(2);
          cre.ropes[i].objs[j].acc.add(force);
        }
      }
      


      p5.Vector.lerp(cre.ropes[i].objs[0].pos, cre.pos, 0.05*rms, cre.ropes[i].objs[0].pos);

      cre.ropes[i].display();
    }


  }
  
  
}

function keyPressed() {
  debug = !debug;
}


function mousePressed() {
  showPoints = !showPoints;
}



function debugButtonOnClick() {
  debugMode = ! debugMode;
}