// --- Subtle neon glowing cursor ---
const cursor = document.querySelector(".cursor-light");
let x = 0, y = 0;
let targetX = 0, targetY = 0;

document.addEventListener("mousemove", e => {
  targetX = e.clientX;
  targetY = e.clientY;
});

function animateCursor() {
  // Smooth follow / gravity feel
  x += (targetX - x) * 0.15;
  y += (targetY - y) * 0.15;

  if (cursor) {
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
  }

  requestAnimationFrame(animateCursor);
}

animateCursor();


// --- Boot animation ---
const bootLines = [
  ">Great to see you. I'm 0xm0t0k0 aka 0xth00rf1nn aka c1nn4m0nr0ls"
];

const bootText = document.getElementById("boot-text");
const bootScreen = document.getElementById("boot-sequence");
const mainContent = document.getElementById("main-content");

let line = 0;
let char = 0;

function typeBootLine() {
  if (line < bootLines.length) {
    if (char < bootLines[line].length) {
      bootText.textContent += bootLines[line].charAt(char);
      char++;
      setTimeout(typeBootLine, 30);
    } else {
      bootText.textContent += "\n";
      line++;
      char = 0;
      setTimeout(typeBootLine, 400);
    }
  } else {
    // After boot animation finishes
    setTimeout(() => {
      bootScreen.style.opacity = "0";
      setTimeout(() => {
        bootScreen.style.display = "none";
        mainContent.style.display = "block";
      }, 1000);
    }, 600);
  }
}

window.addEventListener("load", typeBootLine);
