const sprite = new Image();
sprite.src = 'img/imagenes.png'



// function game(){
    const canvas = document.getElementById('canvas');
    const c = canvas.getContext('2d');
    
    
    canvas.width = innerWidth; //FULL SCREEN
    canvas.height = innerHeight; // FULL SCREEN
    
    const startGameId = document.getElementById('startGameId');
    const divFix = document.getElementById('divFix');
    
    const x = canvas.width / 2; //PER POSICIONAR AL MIG DE L'SCREEN
    const y = canvas.height / 2;//PER POSICIONAR AL MIG DE L'SCREEN  

    class PlayerRot { //CREEM EL PERSONATGE
        constructor(posX, posY, width, height, deg){
            this.x = posX
            this.y = posY
            this.width = width
            this.height = height
            this.deg = deg
        }
        
        draw() {
            c.drawImage(
                sprite,
                1183,
                38,
                this.width,
                this.height,
                this.x,
                this.y,
                75,
                50
            );
            // c.translate(Math.hypot(player.x - enemy.x, player.y - enemy.y))
            c.rotate(0);
            // c.fill()
            // c.beginPath();
            // c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
            // c.fillStyle = this.color
            // c.fill()
        }

    };
    

    class Player { //CREEM EL PERSONATGE
        constructor(x, y, radius, color){
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
        }
        
        draw() {
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
            // c.beginPath();
            // c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
            // c.fillStyle = this.color
            // c.fill()
        }
    };

    
    class Projectile {
        constructor (x, y, radius, color, velocity) {
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.velocity = velocity
        };

        draw() {
            c.drawImage(
                sprite,
                1280,
                500,
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
        
        draw() {
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
            // c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
            // c.fillStyle = this.color
            // c.fill()
        };
        
        update() { //DISPARAR, PASSEM EL MÈTODE DRAW() I PINTEM
            this.draw()
            this.x = this.x + this.velocity.x
            this.y = this.y + this.velocity.y
        }
    }
    let player = new Player(x, y, 50, "blue");
    let playerRot = new Player(x-30, y-25, 444, 254, 0) 
    let projectiles = [];
    let enemies = []
    
    function init() {
        player = new Player(x, y, 55, "blue");
        playerRot = new PlayerRot(x-30, y-25, 444, 254, 0)
        projectiles = [];
        enemies = [];
        score = 0;
        document.getElementById('scoreId').innerHTML = score;
    }


    
    
    function spawnEnemies() {
        setInterval(() => {
            const radius = Math.random() +15
            
            let x;
            let y;
            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
                y = Math.random() * canvas.height
            } else {
                x = Math.random() * canvas.width
                y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
            }
            const color = `hsl(${Math.random()*360}, 100%, 50%)`
            
            const angle = Math.atan2(canvas.height/2 - y, 
            canvas.width/2 - x)
            const velocity = {
                x: Math.cos(angle) * 1.5, 
                y: Math.sin(angle) * 1.5
            }
            enemies.push(new Enemy(x, y, radius, color, velocity))
            
            console.log(enemies)
        }, 1500)
    }
    
    let animationId;
    let score = 0;
    
    
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
            
            //END GAME
            const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
            if (dist - enemy.radius - (player.radius - 2) < 1){
                cancelAnimationFrame(animationId);
                document.getElementById('fixedScore').innerHTML = score;
                divFix.style.display = 'flex';
            }
            
            //COLISION ENEMIGO / BALA
            projectiles.forEach((projectile, j) => {
                const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
                
                if (dist - enemy.radius - projectile.radius < 1){
                    
                    score += 100;
                    document.getElementById('scoreId').innerHTML = score;
                    
                    setTimeout(() => {
                        enemies.splice(k, 1)
                        projectiles.splice(j, 1)
                    }, 0);
                }
            })
        })
    }
    
    addEventListener('click', (event) =>{
        const angle = Math.atan2(event.clientY - y, event.clientX - x)
        const velocity = {
            x: Math.cos(angle) * 5, 
            y: Math.sin(angle) * 5
        }
        projectiles.push(new Projectile(x, y, 6.5, 'red', velocity))
    });
    
    startGameId.addEventListener('click', () => {
        init();
        animate();
        spawnEnemies();
        divFix.style.display = 'none'
    })