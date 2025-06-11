const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gravity = 0.3;
const jumpForce = - 8;
const groundLevel = canvas.height - 198*0.7; // height of ground

let showStory = true;
let storyText = "";
let displayedText = "";
let storyCharIndex = 0;
let typingDone = false;


let recenica =0;

const player = {
  x: 50,
  y: groundLevel,
  width: 85*0.7,
  height: 198*0.7,
  speed: 3,
  dx: 0,
  dy: 0,
  jumping: false
};
const keys = {
    left: false,
    right: false,
    up: false
  };
  const playerImage = new Image();
playerImage.src = "Subject.png";

function Enemy(x, y, width, height, range,speed) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;
  this.direction = 1; // 1 = right, -1 = left
  this.range = range;
  this.startX = x;
}

Enemy.prototype.update = function() {
  this.x += this.speed * this.direction;

  // Turn around at the ends of the patrol range
  if (this.x > this.startX + this.range || this.x < this.startX) {
    this.direction *= -1;
  }
};
const enemyImage = new Image();
enemyImage.src = "baba.png"; // Replace with your PNG file

Enemy.prototype.draw = function(ctx) {
  ctx.drawImage(enemyImage,this.x, this.y, this.width, this.height);
};



// Platform class
function Platform(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }



  Platform.prototype.draw = function(ctx) {
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  ctx.fillStyle = "pink";
  ctx.fillRect(this.x, this.y, this.width, this.height);
  ctx.restore();

  ctx.strokeStyle = "brown";
  ctx.lineWidth = 2;
  ctx.strokeRect(this.x, this.y, this.width, this.height);
};


  // Example platforms
  
  const levels = [
    {
        backgroundImage:"slika3.jpg",
        brojrecenica: 9,
        story : ["Zdravo Petra! Dobro došla u igricu: Put do Vuka!",
          "Nadam se da ćeš preći sve nivoe i da ćeš se zabaviti!",
          "Priča može da počne...",
          "Petra: Jako mi nedostaje moj Vuk :(. On je najbolji i najlepši dečko na svetu.",
          "Petra: Šteta što sam u Subotici, a on je tako daleko :(....(plače)",
          "Petra: ...(IDEJA!) Šta ako ja odem do njega da ga iznenadim? Sigurno ću ga obradovati!",
          "Petra: Hmmm(razmišlja) , pošto je on u Beogradu najbolje da pokupim neku BlaBla vožnju. ",
          "Petra: U Akciju! (uzbudjeno)",
        " Dpbar dan"],
        enemies:[],
      platforms: [
    new Platform(110, 520, 60, 20),
    new Platform(220, 470, 60, 20),
    new Platform(330, 420, 60, 20),
    new Platform(440, 370, 60, 20),
    new Platform(630, 420, 130, 20),
    new Platform(880, 360, 60, 20),
    new Platform(800, 290, 60, 20),
    new Platform(880, 220, 60, 20),
    new Platform(800, 150, 60, 20),
    new Platform(600, 150, 60, 20),
    new Platform(400, 150, 60, 20),
    new Platform(200, 150, 60, 20),
    new Platform(70, 100, 60, 20)
      ]
    },
    {
        backgroundImage:"savacentar.jpg",
        brojrecenica: 4,
        story:["Dva sata kasnije...",
          "Petra: To je bila dosadna vožnja sa Madjarima... Još su me ostavili kod Sava Centra :/",
          "Petra: Sada ću morati da uhvatim 95-icu do Karaburme (JUPII)",
          "Ne znam "
        ],
        enemies:[],
        
      platforms: [
  new Platform(120, 500, 60, 20),
  new Platform(70, 400, 50, 20),
  new Platform(230, 320, 40, 20),
  new Platform(310, 400, 50, 20),
  new Platform(450, 360, 60, 20),
  new Platform(620, 340, 40, 20),
  new Platform(540, 270, 50, 20),
  new Platform(530, 170, 40, 20),
  new Platform(840, 270, 60, 20),
  new Platform(70, 100, 50, 20),
  new Platform(150, 160, 40, 20),
  new Platform(240, 120, 30, 20),
  new Platform(410, 90, 30, 20)
]

    },
    {
        backgroundImage:"gsp.jpg",
        brojrecenica: 4,
        story:["Stigla je 95-ica, ali unutra je nenormalna guzva!",
          "Petra: Izgleda da ću morati da izbegavam šugave penzionere",
          "Petra: Daće Bog da preživim do Karaburme...(iznervirano)",
          " a"
        ],
        enemies: [
  new Enemy(300, groundLevel+77, 60, 60, 350,1),
  new Enemy(0, 280, 60, 60, 440,2),
  new Enemy(800, 260, 60, 60, 200,2.5),
  new Enemy(170, 80, 60, 60, 340,1)
],

      platforms: [
        new Platform(800, 500, 100, 20),
        new Platform(630, 400, 100, 20),
        new Platform(800, 320, 200, 20),
        new Platform(630, 230, 100, 20),
        new Platform(0, 340, 480, 20),
        new Platform(170, 140, 400, 20),
        new Platform(70, 100, 60, 20)

      ]
    },
    {
        backgroundImage:"kara.jpg",
        brojrecenica: 5,
        story:["Petra: Konačno izazak iz onog busa!",
          "Petra: Sada konačno da iznenadim Vuka :3",
          "*lift ne radi*",
          "Petra: DA LI JE MOGUĆE DA ĆU MORATI DA SE PENJEM? (popizdela)",
          "Ne znam "
        ],
        enemies:[],
        
      platforms: [
  new Platform(850, 500, 30, 20),
  new Platform(900, 400, 30, 20),
  new Platform(850, 300, 30, 20),
  new Platform(900, 200, 30, 20),
  new Platform(850, 100, 30, 20),
  new Platform(300, 400, 30, 20),
  new Platform(250, 300, 30, 20),
  new Platform(300, 200, 30, 20),
  new Platform(250, 100, 30, 20),
  new Platform(500, 460, 70, 20),
  new Platform(70, 100, 60, 20)
]

    }
  ];
  let currentLevel = 0;
  
let currentPlatforms = levels[currentLevel].platforms;
let currentEnemies = levels[currentLevel].enemies || [];

storyText = levels[currentLevel].story[recenica];


function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

}


const backgroundImages = {};
let imagesToLoad = levels.length;

for (let i = 0; i < levels.length; i++) {
  const img = new Image();
  img.src = levels[i].backgroundImage;

  img.onload = () => {
    imagesToLoad--;
    if (imagesToLoad === 0) {
      // All images loaded, start the game
      requestAnimationFrame(update);
    }
  };

  img.onerror = () => {
    console.error("Failed to load image for level " + i);
    imagesToLoad--;
    if (imagesToLoad === 0) {
      requestAnimationFrame(update);
    }
  };

  backgroundImages[i] = img;
}





function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
showStory=false;
recenica = 10;
function update() {
if (showStory||recenica+1<levels[currentLevel].brojrecenica) {
  showStory=true;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.font = "24px 'Comic Sans MS', cursive";
  ctx.textAlign = "center";
  

  
  // Draw the story text, with typing effect
  displayedText += storyText[storyCharIndex] || "";
  if (!typingDone && storyCharIndex < storyText.length) {
    storyCharIndex++;
  } else {
    typingDone = true;
  }

  ctx.fillText(displayedText, canvas.width / 2, canvas.height / 2);
  

  if (typingDone) {
    ctx.font = "16px 'Comic Sans MS', cursive";
    ctx.fillText("Stisni Enter da nastavis dalje :3", canvas.width / 2, canvas.height / 2 + 40);
  }

  requestAnimationFrame(update);
  return;
}





    const bg = backgroundImages[currentLevel];
if (bg.complete) {
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
} else {
  ctx.fillStyle = "#000"; // fallback while image loads
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

    
  drawPlayer();
// Draw platforms


if(keys.right) moveRight();
if(keys.left) moveLeft();
if(keys.up) jump();

currentPlatforms.forEach(p => p.draw(ctx));

  // Horizontal movement
  player.x += player.dx;

  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x +player.width> canvas.width ) {
    player.x = canvas.width-player.width;
  }

  // Gravity
  player.dy += gravity;
  player.y += player.dy;

  let onPlatform = false;

// Check collision with platforms
player.dx*=0.96

for (const p of currentPlatforms) {
  const isColliding = 
    player.x+10 < p.x + p.width &&
    player.x + player.width -10 > p.x &&
    player.y + player.height <= p.y + player.dy &&
    player.y + player.height + player.dy >= p.y;

  if (isColliding) {
    player.y = p.y - player.height;
    player.dy = 0;
    player.jumping = false;
    onPlatform = true;
    player.dx*=1.01
    break;
  }
}
// Ground collision (if not on platform)
if (!onPlatform && player.y >= groundLevel) {
  player.y = groundLevel;
  player.dy = 0;
  player.jumping = false;
  player.dx*=1.01
}



if (player.x < 90 && player.y < 50) {
  currentLevel++;
  if (currentLevel > levels.length) {
    alert("You win! Game over.");
    currentLevel = 0;
  }

  currentPlatforms = levels[currentLevel].platforms;
  player.x = 0;
  player.y = groundLevel;
  player.dy = 0;
  player.dx = 0;
  player.jumping = false;

  currentEnemies = levels[currentLevel].enemies || [];

  // Set up 
  recenica=0;
  storyText = levels[currentLevel].story[recenica];
  showStory = true;
  displayedText = "";
  storyCharIndex = 0;
  typingDone = false;
}

currentEnemies.forEach(enemy => {
  enemy.update();
  enemy.draw(ctx);

  // Collision detection
  if (
    player.x < enemy.x + enemy.width &&
    player.x + player.width > enemy.x &&
    player.y+60 < enemy.y + enemy.height &&
    player.y + player.height > enemy.y
  ) {
    player.x = 0;
    player.y = groundLevel;
    player.dy = 0;
    player.dx = 0;
    player.jumping = false;
  }
});





  requestAnimationFrame(update);
}

function moveRight() {
  player.dx +=0.2;
}

function moveLeft() {
  player.dx -=0.2
}

function jump() {
  if (!player.jumping) {
    player.dy = jumpForce;
    player.jumping = true;
  }
}


function keyDown(e) {
    if (showStory && e.key === "Enter" && typingDone ) {
    showStory=false;
    displayedText = "";
    storyCharIndex = 0;
    typingDone = false;
    recenica++;
    storyText = levels[currentLevel].story[recenica];

    return;
  }
  
  

  
    if (e.key === "ArrowRight") keys.right = true;
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === " " || e.key === "ArrowUp") keys.up = true;
  }
  
  function keyUp(e) {
    if (e.key === "ArrowRight") keys.right = false;
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === " " || e.key === "ArrowUp") keys.up = false;
  }
  

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

