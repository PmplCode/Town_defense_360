const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    };

    draw () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color;
        c.fill();
    };
};

class Proyectil {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.x + this.velocity.y;
    }
};

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.x + this.velocity.y;
    }
};

//MESURA DE LA MEITAT DE LA PANTALLA RESPONSIVE
const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 30, 'red');

const projectiles = [];
const enemies = [];

function spawnEnemies() {
    setInterval(() => {
        const x = 100;
        const y = 100;
        const radius = 30;
        const color = 'green';
        const velocity = {
            x: 1,
            y: 1
        };

        enemies.push(new Enemy(x, y, radius, color, velocity));
        console.log(enemies);
    }, 1000);
};

function animate() {
    cancelAnimationFrame(animate) //CRIDA LA FUNCIÓ A SI MATEIX pER DIBUIXAR
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    projectiles.forEach(proyectil => {
        proyectil.update();
    })

    enemies.forEach(enemy => {
        enemy.update();
    });
};

window.addEventListener('click', (event) => {
    const angle = Math.atan2( //CALCULA L'ANGLE EN RADIANTS ENTRE EL PUNT ORIGEN (CENTRE CANVAS) FINS ON HAS CLICAT
    event.clientY - canvas.height / 2, 
    event.clientX - canvas.width / 2
    );

    const velocity = {
        x: Math.cos(angle), //EN L'EIX X, RETORNA 1 o -1
        y: Math.sin(angle) //EN L'EIX Y, RETORNA 1 o -1
    };

    projectiles.push(
        new Proyectil(
            canvas.width / 2, //origen centre del canvas
            canvas. height / 2, //origen centre del canvas 
            10,
            'yellow',
            velocity
        )
    )
});

spawnEnemies();
animate();