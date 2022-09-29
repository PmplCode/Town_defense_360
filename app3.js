const sprite = new Image();
sprite.src = 'img/imagenes.png'
const backmusic = new Audio('img/focus-loop-corporate-music-114297.mp3');
const tower = new Image();
tower.src = 'img/Untitled_Artwork.png'
backmusic.volume = 0.5
backmusic.loop = true;


// function game(){
    const canvas = document.getElementById('canvas');
    const c = canvas.getContext('2d');
    
    
    canvas.width = innerWidth; //FULL SCREEN
    canvas.height = innerHeight; // FULL SCREEN
    
    const startGameId = document.getElementById('startGameId');
    const divFix = document.getElementById('divFix');
    
    const x = canvas.width / 2; //PER POSICIONAR AL MIG DE L'SCREEN
    const y = canvas.height / 2;//PER POSICIONAR AL MIG DE L'SCREEN  

    //CREEM EL PERSONATGE
    class PlayerRot { 
        constructor(posX, posY, width, height, deg){
            this.x = posX
            this.y = posY
            this.width = width
            this.height = height
            this.deg = deg // ??? ROTACIÓ???
        }
        
        draw() {
            c.drawImage(
                tower,
                500,
                0,
                1500,
                2000,
                this.x,
                this.y,
                100,
                100
            );
            
        }
        rotate(){
            this.draw()
            c.rotate(1)
        }

    };
    
    //CREEM LA ALDEA
    class Player {
        constructor(x, y, radius, color){
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
        }
        
        draw() { //PINTEM LA ALDEA
            c.drawImage(
                sprite,
                0,
                0,
                1000,
                650,
                x-145,
                y-90,
                290,
                145
            );
        }
    };

    //CREEM LES BALES
    class Projectile {
        constructor (x, y, radius, color, velocity) {
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.velocity = velocity
        };

        draw() { //DIBUIXEM LA BALA
            c.drawImage(
                sprite,
                1280,
                485,
                1418,
                556,
                this.x-10,
                this.y-5,
                175,
                75
            );
            c.beginPath()
            // c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
            // c.fillStyle = this.color
            c.fill()
        };
        
        update() { //DISPARAR, PASSEM EL MÈTODE DRAW() I PINTEM
            this.draw()
            this.x = this.x + this.velocity.x
            this.y = this.y + this.velocity.y
        }
    }
    
    class Enemy {
        constructor (x, y, radius, color, velocity) {
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.velocity = velocity
        };
        
        draw() { //DIBUIXEM ELS ENEMICS
            c.drawImage(
                sprite,
                1800,
                37,
                222,
                251,
                this.x-25,
                this.y-20,
                50,
                40
            );
            c.beginPath()
            
        };
        
        update() { //PASSEM EL MÈTODE DRAW() I PINTEM LA TRAJECTORIA
            this.draw()
            this.x = this.x + this.velocity.x
            this.y = this.y + this.velocity.y
        }
    }
    let player;
    let playerRot;

    //ARRAYS PER GUARDAR ELS ENEMICS I LES BALES
    let projectiles = [];
    let enemies = []
    
    function init() { //PRINTEGEM LA ALDEA I EL JUGADOR
        player = new Player(x, y, 60, "blue");
        playerRot = new PlayerRot(x-25, y-25, 50, 254, 50)
        projectiles = []; //INICIEM ELS ARRAYS A 0
        enemies = []; //INICIEM ELS ARRAYS A 0
        score = 0; //SCORE A 0
        veloci = 1.5;
        veloci1 = 5;
        document.getElementById('scoreId').innerHTML = score;
    }

    let animationId;
    let spawnId;
    let score = 0;

    
    function spawnEnemies(frames) {
        spawnId = setInterval(() => {
            const radius = Math.random() +15; // mínim de radi dels enemics
            let x;
            let y;
            if (Math.random() < 0.5) { //RESpAWN ALEATORIAMENT ¡FORA! DEL CANVAS ( WIDTH / HEIGHT+ RADIUS )
                x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius //SPAWN ALEATORI PER LA DRETA O ESQUERRA DEL CANVAS
                y = Math.random() * canvas.height
            } else {
                x = Math.random() * canvas.width
                y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius // SpAWN ALEATORI PER SOTA O SOBRE EL CANVAS
            }
            //IF x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            // && y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius    TOTS ELS ENEMICS ES CREERAN EN LES CANTONADES DEL CANVAS.
            const color = `hsl(${Math.random()*360}, 100%, 50%)`
            
            //RESTEM DES DEL DESTÍ FINS LORIGEN, NO DEL REVES
            const angle = Math.atan2(canvas.height/2 - y, 
            canvas.width/2 - x)
            const velocity = {
                x: Math.cos(angle) * veloci, 
                y: Math.sin(angle) * veloci
            }
            enemies.push(new Enemy(x, y, radius, color, velocity))
            console.log(frames);
        }, frames)
    }
    
    let veloci = 1.5
    let veloci1 = 5;

    function animate(){
        animationId = requestAnimationFrame(animate);

        //ESBORRA EL RASTRE DE LES BALES
        c.clearRect(0, 0, canvas.width, canvas.height) 
        player.draw();
        playerRot.draw(); // INICIEM PLAYERROT!!!!!!!!
        projectiles.forEach(projectile => {
            projectile.update()
        })
        
        enemies.forEach((enemy, k) => {
            enemy.update();
            
            //END GAME: COLISION ENEMIGO CON JUGADOR
            const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
            if (dist - enemy.radius - (player.radius - 2) < 1){
                cancelAnimationFrame(animationId);
                enemies.forEach((enemy) => delete enemy);
                enemies = [];
                veloci = 1.5;
                veloci1 = 5;
                document.getElementById('fixedScore').innerHTML = score;
                divFix.style.display = 'flex';
                clearInterval(spawnId);
            }
            
            //COLISION ENEMIGO / BALA
            projectiles.forEach((projectile, j) => {
                const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
                
                if (dist - enemy.radius - projectile.radius < 1){
                    
                    score += 100;
                    document.getElementById('scoreId').innerHTML = score;
                    veloci += 0.08; //PER CADA ENEMIC ELIMINAT: EL SEGUENT VA MÉS RAPID FINS AL CENTRE
                    veloci1 += 0.04; //PER CADA ENEMIC ELIMINAT: LA TEVA BALA VA MÉS RAPID, PERÒ ESCALA MENYS QUE LA VELOCITAT DE L'ENEMIC
                    
                    setTimeout(() => {
                        enemies.splice(k, 1)
                        projectiles.splice(j, 1)
                    }, 0);
                }
            })
        })
    }
    

    //DISPARAR LA BALA AMB EL CLICK
    addEventListener('click', (event) =>{
        const angle = Math.atan2(event.clientY - y, event.clientX - x) // L'ANGLE DES DEL CENTRE DEL CANVAS FINS ON ES FA EL CLICK PER DISPARAR.
        const velocity = {
            x: Math.cos(angle) * veloci1, 
            y: Math.sin(angle) * veloci1
        }
        projectiles.push(new Projectile(x, y, 6.5, 'red', velocity))
    });
    
    //COMENÇAR EL JOC, INICIEM FUNCIO INIT + ANIMATE + SPAWNENEMIES + DIV
    startGameId.addEventListener('click', () => {
        init();
        animate();
        spawnEnemies(1500);
        divFix.style.display = 'none';
        backmusic.play();
    })