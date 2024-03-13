// Define an array of questions and their weights
const questions = [
  { question: "Creativity / Originality", weight: 2 },
  { question: "Entertainment", weight: 3 },
  { question: "Score", weight: 2 },
  { question: "Plot", weight: 3 },
  { question: "Cinematography", weight: 2 },
  { question: "Characters", weight: 2.5 },
  { question: "Theme/Message", weight: 1.5 }
];

// Array to store the selected numbers
const selectedNumbers = [];

// Array to store the weights
const weights = [];

// Current question index
let currentQuestionIndex = -1; // Start at -1 to handle the initial number selection

// Weighted average
let weightedAverage = 0;

// Initial selection number
let initialSelection = 0;

// Function to render the initial number selection
function renderInitialSelection() {
  const questionContainer = document.getElementById('questionContainer');
  questionContainer.innerHTML = ''; // Clear the container

  const questionDiv = document.createElement('div');
  const questionLabel = document.createElement('label');
  questionLabel.textContent = "Initial Rating";


  const buttonContainer = document.createElement('div');
  for (let i = 1; i <= 10; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.addEventListener('click', () => handleInitialSelection(i));
      buttonContainer.appendChild(button);
  }

  questionDiv.appendChild(questionLabel);
  questionDiv.appendChild(buttonContainer);
  questionContainer.appendChild(questionDiv);
}

// Function to handle the initial number selection
function handleInitialSelection(selectedNumber) {
  initialSelection = selectedNumber;
  currentQuestionIndex = 0;
  selectedNumbers[0] = selectedNumber;
  renderQuestion();
}

// Function to render the current question
function renderQuestion() {
  const questionContainer = document.getElementById('questionContainer');
  // Can add text
  questionContainer.innerHTML = ''; // Clear the container

  const questionDiv = document.createElement('div');
  const questionLabel = document.createElement('label');
  questionLabel.textContent = `${currentQuestionIndex + 1}. ${questions[currentQuestionIndex].question}`;

  const buttonContainer = document.createElement('div');
  for (let i = 1; i <= 10; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.addEventListener('click', () => handleButtonClick(i));
      buttonContainer.appendChild(button);
  }

  const backButton = document.createElement('button');
  backButton.textContent = 'Back';
  backButton.addEventListener('click', handleBackButton);
  backButton.disabled = currentQuestionIndex === 0;
  backButton.style.backgroundColor = 'orange'; // Apply inline style to the Reset button for styling

  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset';
  resetButton.addEventListener('click', handleResetButton);
  resetButton.style.backgroundColor = 'orange'; // Apply inline style to the Reset button for styling

  questionDiv.appendChild(questionLabel);
  questionDiv.appendChild(buttonContainer);
  questionDiv.appendChild(backButton);
  questionDiv.appendChild(resetButton);
  questionContainer.appendChild(questionDiv);
}

// Function to handle button click
function handleButtonClick(selectedNumber) {
  selectedNumbers[currentQuestionIndex] = selectedNumber;
  weights[currentQuestionIndex] = questions[currentQuestionIndex].weight;
  currentQuestionIndex++;

  if (currentQuestionIndex === questions.length) {
      weightedAverage = calculateWeightedAverage();
      displayResult();
  } else {
      renderQuestion();
  }
}

// Function to handle back button click
function handleBackButton() {
  currentQuestionIndex--;
  renderQuestion();
}

// Function to handle reset button click
function handleResetButton() {
  currentQuestionIndex = -1;
  selectedNumbers.length = 0; // Clear the selectedNumbers array
  weights.length = 0; // Clear the weights array
  weightedAverage = 0; // Reset the weighted average
  initialSelection = 0; // Reset the initial selection
  location.reload();
  renderInitialSelection();
}

// Function to calculate the weighted average
function calculateWeightedAverage() {
  let sum = 0;
  let weightSum = 0;

  for (let i = 0; i < selectedNumbers.length; i++) {
      sum += selectedNumbers[i] * weights[i];
      weightSum += weights[i];
  }

  const average = sum / weightSum;
  return average;
}

// Function to round a number to the nearest 0.5
function roundToHalf(number) {
  return Math.round(number * 2) / 2;
}

// Function to display the result
function displayResult() {
  const resultContainer = document.getElementById('resultContainer');
 // resultContainer.textContent = `TEXT`;

  const initialSelectionContainer = document.getElementById('initialSelection');
  initialSelectionContainer.textContent = `Original Rating: ${initialSelection}`;

  if (currentQuestionIndex === questions.length) {
      const roundedWeightedAverage = roundToHalf(weightedAverage.toFixed(2)); // Round the weighted average
      const weightedAverageContainer = document.getElementById('weightedAverage');
      weightedAverageContainer.textContent = `Recommended Rating: ${roundedWeightedAverage}`;
  }
}

function toggleTheme() {
  if (document.body.classList.contains("dark"))
      document.body.classList.remove("dark");
  else
      document.body.classList.add("dark");
}
// Render the initial number selection
renderInitialSelection();


"use strict";

let canv, ctx; // canvas and context
let maxx, maxy; // canvas dimensions

let radius; // hexagons radius (and side length)
let grid; // array of hexagons
let nbx, nby; // grid size (in elements, not pixels)
let orgx, orgy;
let perx, pery, pergrid;
let loops;

// for animation
let messages;

// shortcuts for Math.
const mrandom = Math.random;
const mfloor = Math.floor;
const mround = Math.round;
const mceil = Math.ceil;
const mabs = Math.abs;
const mmin = Math.min;
const mmax = Math.max;

const mPI = Math.PI;
const mPIS2 = Math.PI / 2;
const mPIS3 = Math.PI / 3;
const m2PI = Math.PI * 2;
const m2PIS3 = (Math.PI * 2) / 3;
const msin = Math.sin;
const mcos = Math.cos;
const matan2 = Math.atan2;

const mhypot = Math.hypot;
const msqrt = Math.sqrt;

const rac3 = msqrt(3);
const rac3s2 = rac3 / 2;

//------------------------------------------------------------------------

function alea(mini, maxi) {
  // random number in given range

  if (typeof maxi == "undefined") return mini * mrandom(); // range 0..mini

  return mini + mrandom() * (maxi - mini); // range mini..maxi
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function intAlea(mini, maxi) {
  // random integer in given range (mini..maxi - 1 or 0..mini - 1)
  //
  if (typeof maxi == "undefined") return mfloor(mini * mrandom()); // range 0..mini - 1
  return mini + mfloor(mrandom() * (maxi - mini)); // range mini .. maxi - 1
}

//------------------------------------------------------------------------

class ExtremeFilter {
  /* tracks extreme points to build a linear gradient in direction given by constructor
      let D the oriented straight line passing by (0,0) in direction D
      makes projection of filtered points on D
      keeps track of points whose projection has min and max abscissa on D
      */

  constructor(angle = 0) {
    this.min = Infinity;
    this.max = -Infinity;
    this.c = Math.cos(angle);
    this.s = Math.sin(angle);
  }

  filter(p) {
    let absc = p.x * this.c + p.y * this.s;
    if (absc < this.min) {
      this.min = absc;
      this.pmin = p;
    }
    if (absc > this.max) {
      this.max = absc;
      this.pmax = p;
    }
  } // filter

  filterArc(xc, yc, radius, starta, enda, ccw) {
    /* uses same signature as CanvasRenderingContext2D.arc
        does not accurately find extreme values, but filters a few points along the arc.
        Inaccuracy does not matter that much for a gradient
        */
    let x, y, a;
    // make angles increasing along arc
    if (ccw) [starta, enda] = [enda, starta];
    while (enda < starta) enda += m2PI;
    while (enda > starta + m2PI) enda -= m2PI;
    const ndiv = mceil((enda - starta) / 0.4); // vill divide arc in angles < 0.4 rad (0.4 : arbitrary value)
    if (ndiv == 0) ndiv = 1; // will do some extra work, but who cares ?
    for (let k = 0; k <= ndiv; ++k) {
      a = starta + (k * (enda - starta)) / ndiv;
      this.filter({ x: xc + radius * mcos(a), y: yc + radius * msin(a) });
    }
  } // filterArc

  getLinearGradient() {
    /* creates a gradient without filling the stop points */
    let delta = this.max - this.min;
    return ctx.createLinearGradient(
      this.pmin.x,
      this.pmin.y,
      this.pmin.x + delta * this.c,
      this.pmin.y + delta * this.s
    );
  }
} // ExtremeFilter
//------------------------------------------------------------------------

class Hexagon {
  constructor(kx, ky) {
    this.kx = kx;
    this.ky = ky;
    //        this.rot = intAlea(6); // random orientation
    this.rot = pergrid[ky % pery][kx % perx];

    this.entered = [];
    // entering se
  } // Hexagon.constructor

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  size() {
    // coordinates of centre
    this.xc = orgx + this.kx * 1.5 * radius;
    this.yc = orgy + this.ky * radius * rac3;
    if (this.kx & 1) this.yc -= radius * rac3s2; // odd columns, centre is a bit higher

    this.a0 = (this.rot * mPI) / 3; // angle shift due to cell orientation

    // centers for arcs
    this.s0 = {
      x: this.xc + radius * mcos(this.a0 - (2 * mPI) / 3),
      y: this.yc + radius * msin(this.a0 - (2 * mPI) / 3)
    };
    this.s1 = {
      x: this.xc + radius * mcos(this.a0 - (1 * mPI) / 3),
      y: this.yc + radius * msin(this.a0 - (1 * mPI) / 3)
    };
    this.s2 = { x: 2 * this.s0.x - this.s1.x, y: 2 * this.s0.y - this.s1.y };
    this.s3 = { x: 2 * this.s1.x - this.s0.x, y: 2 * this.s1.y - this.s0.y };
    // initial angle

    this.middle = new Array(6).fill(0).map((p, k) => ({
      x: this.xc + radius * rac3s2 * mcos((k * mPI) / 3 - mPI / 2),
      y: this.yc + radius * rac3s2 * msin((k * mPI) / 3 - mPI / 2)
    }));
  } // Hexagon.prototype.size

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  drawHexagon() {
    let x, y;

    ctx.beginPath();
    for (let th = 0; th < m2PI; th += mPIS3) {
      x = this.xc + radius * mcos(th);
      y = this.yc + radius * msin(th);
      if (th == 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
  } // Hexagon.prototype.drawHexagon

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  getNeighbor(edge) {
    const kx = this.kx + [0, 1, 1, 0, -1, -1][edge];
    const ky =
      this.ky +
      [
        [-1, 0, 1, 1, 1, 0],
        [-1, -1, 0, 1, 0, -1]
      ][this.kx & 1][edge];
    if (kx < 0 || kx >= nbx || ky < 0 || ky >= nby) return false;
    return grid[ky][kx];
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  addToPath(loop, entry) {
    /* remark : exit edge is always (entry -1) mod 6 */
    const path = loop.path;
    let arcp;

    this.entered[entry] = loop; // remember we already entered here

    const relentry = (entry - this.rot + 6) % 6;
    switch (relentry) {
      case 0:
        arcp = [
          this.s0.x,
          this.s0.y,
          radius / 2,
          this.a0,
          this.a0 + (2 * mPI) / 3
        ];
        path.arc(...arcp);
        loop.ef.filterArc(...arcp);
        break;
      case 1:
        arcp = [
          this.s1.x,
          this.s1.y,
          radius / 2,
          this.a0 + mPI / 3,
          this.a0 + mPI
        ];
        path.arc(...arcp);
        loop.ef.filterArc(...arcp);
        break;
      case 2:
        arcp = [
          this.s3.x,
          this.s3.y,
          (3 * radius) / 2,
          this.a0 + (2 * mPI) / 3,
          this.a0 + mPI
        ];
        path.arc(...arcp);
        loop.ef.filterArc(...arcp);
        arcp = [
          this.s1.x,
          this.s1.y,
          radius / 2,
          this.a0 + mPI,
          this.a0 + mPI / 3,
          true
        ];
        path.arc(...arcp);
        loop.ef.filterArc(...arcp);
        break;
      case 3:
        path.lineTo(this.middle[this.rot].x, this.middle[this.rot].y);
        loop.ef.filter(this.middle[this.rot]);
        arcp = [
          this.s3.x,
          this.s3.y,
          (3 * radius) / 2,
          this.a0 + mPI,
          this.a0 + (2 * mPI) / 3,
          true
        ];
        path.arc(...arcp);
        loop.ef.filterArc(...arcp);
        break;
      case 4:
        arcp = [
          this.s2.x,
          this.s2.y,
          (3 * radius) / 2,
          this.a0 + mPI / 3,
          this.a0,
          true
        ];
        path.arc(...arcp);
        loop.ef.filterArc(...arcp);
        path.lineTo(
          this.middle[(this.rot + 3) % 6].x,
          this.middle[(this.rot + 3) % 6].y
        );
        loop.ef.filter(this.middle[(this.rot + 3) % 6]);
        break;
      case 5:
        arcp = [
          this.s0.x,
          this.s0.y,
          radius / 2,
          this.a0 + (2 * mPI) / 3,
          this.a0,
          true
        ];
        path.arc(...arcp);
        loop.ef.filterArc(...arcp);
        arcp = [
          this.s2.x,
          this.s2.y,
          (3 * radius) / 2,
          this.a0,
          this.a0 + mPI / 3
        ];
        path.arc(...arcp);
        loop.ef.filterArc(...arcp);
        break;
    } // switch (relentry)

    const exit = (entry + 5) % 6;
    if (entry != this.rot)
      loop.segments.push({
        cell: this,
        p0: entry,
        p1: this.rot,
        isEntry: true
      });
    if (exit != this.rot)
      loop.segments.push({
        cell: this,
        p0: this.rot,
        p1: exit,
        isEntry: entry == this.rot
      });
  } // addToPath

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  addToPath2(path, entry, alpha) {
    /* remark : exit edge is always (entry -1) mod 6 */
    /* similar to addToPath, with an alpha parameter to draw growing / shinking version of curves
          alpha = 0 : "normal", full curve
          alpha = 0.5 : curve shrunk to single point
        */
    //        const path = loop.path;
    let arcp;
    let x, y, ang;

    const relentry = (entry - this.rot + 6) % 6;
    switch (relentry) {
      case 0:
        arcp = [
          this.s0.x,
          this.s0.y,
          radius * (0.5 - alpha),
          this.a0,
          this.a0 + (2 * mPI) / 3
        ];
        path.arc(...arcp);
        // loop.ef.filterArc(...arcp);
        break;
      case 1:
        arcp = [
          this.s1.x,
          this.s1.y,
          radius * (0.5 - alpha),
          this.a0 + mPI / 3,
          this.a0 + mPI
        ];
        path.arc(...arcp);
        // loop.ef.filterArc(...arcp);
        break;
      case 2:
        x = 2 * alpha;
        y = msqrt((1.5 - alpha) * (1.5 - alpha) - (x - 1.5) * (x - 1.5));
        ang = matan2(y, 1.5 - x);
        arcp = [
          this.s3.x,
          this.s3.y,
          (3 * radius) / 2 - alpha * radius,
          this.a0 + (2 * mPI) / 3,
          this.a0 + mPI - ang
        ];
        path.arc(...arcp);
        // loop.ef.filterArc(...arcp);
        ang = matan2(y, 0.5 - x);
        arcp = [
          this.s1.x,
          this.s1.y,
          radius / 2 + alpha * radius,
          this.a0 + mPI - ang,
          this.a0 + mPI / 3,
          true
        ];
        path.arc(...arcp);
        // loop.ef.filterArc(...arcp);
        break;
      case 3:
        x = alpha;
        y = msqrt(6 * alpha);
        let x1 = x * radius;
        let y1 = (y - rac3s2) * radius;
        /* ONLY FOR TESTS
            let y2 = rac3s2 * radius;
            path.moveTo(this.xc + x1 * mcos(this.a0) - y2 * msin(this.a0), this.yc + x1 * msin(this.a0) + y2 * mcos(this.a0))
             END ONLY FOR TESTS */
        arcp = {
          x: this.xc + x1 * mcos(this.a0) - y1 * msin(this.a0),
          y: this.yc + x1 * msin(this.a0) + y1 * mcos(this.a0)
        };
        path.lineTo(arcp.x, arcp.y);
        // loop.ef.filter(arcp)
        ang = matan2(y, 1.5 - x);
        arcp = [
          this.s3.x,
          this.s3.y,
          (3 * radius) / 2 + alpha * radius,
          this.a0 + mPI - ang,
          this.a0 + (2 * mPI) / 3,
          true
        ];
        path.arc(...arcp);
        // loop.ef.filterArc(...arcp);
        break;
      case 4:
        x = -alpha;
        y = msqrt(6 * alpha);
        ang = matan2(y, 1.5 + x);
        arcp = [
          this.s2.x,
          this.s2.y,
          (3 * radius) / 2 + alpha * radius,
          this.a0 + mPI / 3,
          this.a0 + ang,
          true
        ];
        path.arc(...arcp);
        // loop.ef.filterArc(...arcp);
        arcp = {
          x:
            this.xc +
            x * radius * mcos(this.a0) -
            rac3s2 * radius * msin(this.a0),
          y:
            this.yc +
            x * radius * msin(this.a0) +
            rac3s2 * radius * mcos(this.a0)
        };
        path.lineTo(arcp.x, arcp.y);
        // loop.ef.filter(arcp)
        break;
      case 5:
        x = 2 * alpha;
        y = msqrt((1.5 - alpha) * (1.5 - alpha) - (x - 1.5) * (x - 1.5));
        ang = matan2(y, 0.5 - x);
        arcp = [
          this.s0.x,
          this.s0.y,
          radius * (0.5 + alpha),
          this.a0 + (2 * mPI) / 3,
          this.a0 + ang,
          true
        ];
        path.arc(...arcp);
        // loop.ef.filterArc(...arcp);
        ang = matan2(y, 1.5 - x);
        arcp = [
          this.s2.x,
          this.s2.y,
          radius * (1.5 - alpha),
          this.a0 + ang,
          this.a0 + mPI / 3
        ];
        path.arc(...arcp);
        // loop.ef.filterArc(...arcp);
        break;
    } // switch (relentry)
  } // addToPath2

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  drawLines() {
    ctx.translate(this.xc, this.yc);
    ctx.rotate((mPI / 3) * this.rot);
    ctx.beginPath();
    ctx.moveTo(0, -radius * rac3s2);
    ctx.lineTo(0, radius * rac3s2);
    ctx.moveTo(0, -radius * rac3s2);
    ctx.arc(-radius / 2, -radius * rac3s2, radius / 2, 0, (2 * mPI) / 3);
    ctx.moveTo(0, -radius * rac3s2);
    ctx.arc((-3 * radius) / 2, -radius * rac3s2, (3 * radius) / 2, 0, mPI / 3);
    ctx.moveTo(0, radius * rac3s2);
    ctx.arc(
      (3 * radius) / 2,
      -radius * rac3s2,
      (3 * radius) / 2,
      mPI,
      (2 * mPI) / 3,
      true
    );
    ctx.moveTo(0, -radius * rac3s2);
    ctx.arc(radius / 2, -radius * rac3s2, radius / 2, mPI, mPI / 3, true);
    ctx.lineWidth = radius / 10;
    ctx.strokeStyle = "#f00";
    ctx.stroke();
    ctx.resetTransform();
  }
} //class Hexagon

//-----------------------------------------------------------------------------
function makeLoop(cell, entry) {
  // creates path starting from given entry of given Cell
  // remark : paths ending on outermost edges of grid should be created first

  const startCell = cell;
  const startEntry = entry;

  let pth = new Path2D();
  let loop = { path: pth, segments: [], ef: new ExtremeFilter(-mPI / 4) };

  pth.moveTo(cell.middle[entry].x, cell.middle[entry].y); // starting point
  loop.ef.filter(cell.middle[entry]);
  do {
    cell.addToPath(loop, entry);
    cell = cell.getNeighbor((entry + 5) % 6);
    if (cell === false) break; // reached grid edge...
    entry = (entry + 2) % 6; // entry edge in next cell
  } while (cell != startCell);
  pth.closePath();
  return loop;
} // makeLoop

//-----------------------------------------------------------------------------
function makeAlphaPath(loop, alpha) {
  // returns a shunk version of the path for a given loop
  // alpha = 0 -> normal path ; alpha = 0.5 -> shrunk to a single point

  let pth = new Path2D();
  let seg = loop.segments[0];
  let cell = seg.cell,
    ang0 = (seg.p0 * mPI) / 3;
  let x0 = -alpha * radius;
  let y0 = -rac3s2 * radius;
  pth.moveTo(
    cell.xc + x0 * mcos(ang0) - y0 * msin(ang0),
    cell.yc + x0 * msin(ang0) + y0 * mcos(ang0)
  );
  loop.segments.forEach((seg) => {
    if (seg.isEntry) {
      seg.cell.addToPath2(pth, seg.p0, alpha);
    }
  });
  pth.closePath();
  return pth;
} // make alphaPath
//-----------------------------------------------------------------------------

function createGrid() {
  let line;

  perx = 2 * intAlea(1, 4);
  pery = intAlea(1, 5);

  pergrid = [];
  for (let ky = 0; ky < pery; ++ky) {
    pergrid[ky] = line = []; // new line
    for (let kx = 0; kx < perx; ++kx) {
      line[kx] = intAlea(6);
    } // for let kx
  } // for ky

  grid = [];
  for (let ky = 0; ky < nby; ++ky) {
    grid[ky] = line = []; // new line
    for (let kx = 0; kx < nbx; ++kx) {
      line[kx] = new Hexagon(kx, ky);
      line[kx].size();
    } // for let kx
  } // for ky
} // createGrid
//-----------------------------------------------------------------------------
function drawFrame() {
  grid.forEach((line) => line.forEach((cell) => cell.drawHexagon()));

  for (let k = 0; k < 10; ++k) {
    grid[intAlea(nby)][intAlea(nbx)].drawLines();
  }
} //

//-----------------------------------------------------------------------------

let animate;

{
  // scope for animate

  let animState = 0;
  let tInit;
  animate = function (tStamp) {
    let message;
    let alpha;

    message = messages.shift();
    if (message && message.message == "reset") animState = 0;

    window.requestAnimationFrame(animate);

    switch (animState) {
      case 0:
        if (startOver()) {
          ++animState;
        }
        break;

      case 1:
        loops.forEach((loop) => {
          ctx.fillStyle = loop.gr;
          ctx.fill(loop.path);
        });
        ++animState;
        break;

      case 2:
        if (!message) return;
        if (message.message == "rightclick") drawFrame();

        if (message.message != "click") break; // just wait for click
        tInit = performance.now();
        ++animState;
        break;

      case 3: // deleting pattern
        alpha = mmax(0, 1 - (performance.now() - tInit) / 500) / 2; // 0.5..0
        ctx.fillStyle = "#000";
        loops.forEach((loop) => {
          //              ctx.fillStyle = loop.gr;
          ctx.fill(makeAlphaPath(loop, alpha));
        });
        if (alpha == 0) {
          startOver();
          tInit = performance.now();
          ++animState;
        }
        break;

      case 4: // new pattern
        alpha = mmax(0, 1 - (performance.now() - tInit) / 1000) / 2; // 0.5..0
        loops.forEach((loop) => {
          ctx.fillStyle = loop.gr;
          ctx.fill(makeAlphaPath(loop, alpha));
        });
        if (alpha == 0) {
          animState = 2;
        }
    } // switch
  }; // animate
} // scope for animate

//------------------------------------------------------------------------
//------------------------------------------------------------------------

function startOver() {
  // canvas dimensions

  maxx = window.innerWidth;
  maxy = window.innerHeight;

  canv.width = maxx;
  canv.height = maxy;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, maxx, maxy);

  radius = (maxx + maxy) / intAlea(20, 40);

  // all hexagons fully visible
  nbx = mfloor((maxx / radius - 0.5) / 1.5);
  nby = mfloor(maxy / radius / rac3 - 0.5);
  // all screen covered with hexagons
  nbx = mceil(maxx / radius / 1.5 + 1);
  nby = mceil(maxy / radius / rac3 + 0.5);

  if (nbx < 1 || nby < 1) return false; // nothing to draw

  orgx = (maxx - radius * (1.5 * nbx + 0.5)) / 2 + radius; // obvious, insn't it ?
  orgy = (maxy - radius * rac3 * (nby + 0.5)) / 2 + radius * rac3; // yet more obvious

  createGrid();

  loops = [];
  // create paths on perimeter first
  grid.forEach((line) =>
    line.forEach((hex) => {
      for (let k = 0; k < 6; ++k) {
        if (hex.getNeighbor(k) == false) loops.push(makeLoop(hex, k));
      }
    })
  );

  // all the rest now
  grid.forEach((line) =>
    line.forEach((hex) => {
      for (let k = 0; k < 6; ++k) {
        if (!hex.entered[k]) loops.push(makeLoop(hex, k));
      }
    })
  );

  // alternance for contrast
  loops[0].contrast = 1;
  let nloops = [loops[0]];
  while (nloops.length) {
    let loop = nloops.shift();
    loop.segments.forEach((seg) => {
      let oloop;
      if (seg.p0 == seg.cell.rot) oloop = seg.cell.entered[seg.p1];
      // contiguous to this segment
      else oloop = seg.cell.entered[(seg.p0 + 1) % 6]; // contiguous to this segment;
      if (oloop.contrast) return; // oloop already contrasted
      oloop.contrast = 3 - loop.contrast; // toggle 1-2-1-2...
      nloops.push(oloop);
    });
  } // while

  // color with periodicity - uses above contrast
  const hue0 = intAlea(360);
  const hue1 = intAlea(2) ? hue0 : (hue0 + 180 + intAlea(-60, 60)) % 360;
  const rnd = intAlea(3);

  let hue, lum, sat;

  for (let kpy = 0; kpy < mmin(pery, nby); ++kpy) {
    for (let kpx = 0; kpx < mmin(perx, nbx); ++kpx) {
      for (let entry = 0; entry < 6; ++entry) {
        let lp = grid[kpy][kpx].entered[entry];
        let color = lp.color;
        if (!color) {
          if (lp.contrast == 1) {
            hue = rnd ? hue0 : intAlea(360);
            sat = 100;
            lum = 20;
          } else {
            hue = rnd ? hue1 : intAlea(360);
            sat = 70;
            lum = 80;
          }
          color = { hue, sat, lum };
        } else {
          ({ hue, sat, lum } = color);
        }

        for (let ky = kpy; ky < nby; ky += pery) {
          for (let kx = kpx; kx < nbx; kx += perx) {
            grid[ky][kx].entered[entry].color = color; // keep this line to copy color between copies of pattern
            /*
                                if (grid[ky][kx].entered[entry].contrast == 1) {
                                  hue = hue0;
                                  sat = 100;
                                  lum = 20;
                                } else {
                                  hue = hue1;
                                  sat = 70;
                                  lum = 80;
                                }
                */
            let ef = grid[ky][kx].entered[entry].ef;
            let gr = ef.getLinearGradient();
            gr.addColorStop(0, `hsl(${hue} ${sat}% ${lum}%)`);
            if (lp.contrast == 1 && rnd == 0)
              gr.addColorStop(0.5, `hsl(${hue} ${sat}% 50%)`);
            gr.addColorStop(1, `hsl(${hue} ${sat}% ${100 - lum}%)`);
            grid[ky][kx].entered[entry].gr = gr;
          } // for kx
        } // for ky
      } // for entry
    } // for kx
  } // for kpy

  return true;
} // startOver

//------------------------------------------------------------------------

function mouseClick(event) {
  messages.push({ message: "click" });
} // mouseClick
//------------------------------------------------------------------------

function mouseRightClick(event) {
  messages.push({ message: "rightclick" });
  event.preventDefault();
} // mouseClick

//------------------------------------------------------------------------
//------------------------------------------------------------------------
// beginning of execution

{
  canv = document.createElement("canvas");
  canv.style.position = "absolute";
  document.body.appendChild(canv);
  ctx = canv.getContext("2d");
  //      canv.setAttribute('title', 'click me');
} // création CANVAS

canv.addEventListener("click", mouseClick);
canv.addEventListener("contextmenu", mouseRightClick);
messages = [{ message: "reset" }];
requestAnimationFrame(animate);


