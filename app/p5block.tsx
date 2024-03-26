import React from "react";
import { type Sketch } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";


const sketch: Sketch = (p5) => {
  let xoff = 0;
  let yoff = 10000;
  let radiusOff = 3000;
  let speedXOff = 40000;
  let speedYOff = 50000;
  let colorOff = 60000; // Offset for color in noise space
  let prevMouseX = -1;
  let prevMouseY = -1;

  p5.setup = () => {
    p5.createCanvas(512, p5.windowHeight);
    p5.noiseDetail(0.80, 24);
  };
  p5.windowResized = () => {
    p5.resizeCanvas(512, p5.windowHeight);
  }
  p5.draw = () => {
    //p5.background(0, 5);
    p5.background(0, 0, 0, 5); // Semi-transparent background

    // Use Perlin noise to determine fill color
    let noiseVal = p5.noise(colorOff);
    let fillColor = p5.map(noiseVal, 0, 1, 255, 100);
    p5.noStroke();
    p5.fill(fillColor);

    // Dynamic stroke weight based on distance to center
    let distToCenter = p5.dist(p5.mouseX, p5.mouseY, p5.width / 2, p5.height / 2);
    let strokeWeight = p5.map(distToCenter, 0, p5.dist(0, 0, p5.width / 2, p5.height / 2), 1, 10);
    // p5.strokeWeight(strokeWeight);


    let speedX = p5.map(p5.noise(speedXOff), 0, 1, 0.000000005, 0.01);
    let speedY = p5.map(p5.noise(speedYOff), 0, 1, 0.000000005, 0.01);

    let x = p5.map(p5.noise(xoff), 0, 1, 0, p5.width) * 2;
    let y = p5.map(p5.noise(yoff), 0, 1, 0, p5.height) * 2;

    let radius = p5.map(p5.noise(radiusOff), 0, 1, 5, 100);
    let radiusY = p5.map(p5.noise(radiusOff-100), 0, 1, 5, 100);

    if (p5.dist(p5.mouseX, p5.mouseY, prevMouseX, prevMouseY) > 1) {
      x = p5.mouseX;
      y = p5.mouseY;
      prevMouseX = p5.mouseX;
      prevMouseY = p5.mouseY;
    }

    xoff += speedX;
    yoff += speedY;
    radiusOff += 0.005;
    speedXOff += 0.0002;
    speedYOff += 0.0002;
    colorOff += 0.02; // Increment color offset

    p5.ellipse(x, y, radius * 2, radiusY * 2);
  };

  p5.mousePressed = () => {
    prevMouseX = -1;
    prevMouseY = -1;
  };

  p5.keyPressed = () => {
    if (p5.key === " ") {
      p5.setup();
    }
  };
};

export default function p5block() {
  return <NextReactP5Wrapper sketch={sketch} />;
}