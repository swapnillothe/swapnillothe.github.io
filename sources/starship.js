class Particle {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speed = Math.random() * 2 + 1;
        this.angle = angle + (Math.random() - 0.5) * 0.5; // Slight spread
        this.speedX = Math.sin(this.angle) * this.speed;
        this.speedY = -Math.cos(this.angle) * this.speed;
        this.color = this.getColor();
    }

    getColor() {
        const colors = [
            `hsl(${Math.random() * 30 + 10}, 100%, 50%)`,  // Orange
            `hsl(${Math.random() * 30 + 40}, 100%, 50%)`,  // Yellow
            `hsl(0, 100%, 100%)`  // White
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.1;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Starship {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = this.x;
        this.targetY = this.y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.rotation = 0;
        this.width = 25;  // Reduced from 50
        this.height = 50; // Reduced from 100
        this.thrust = 0.02;
        this.maxSpeed = 1.5;
        this.friction = 0.99;
        this.maxRotationSpeed = 0.05; // New property for max rotation speed
        this.stopThreshold = 5; // Distance threshold to start stopping
        this.isStopping = false;
        this.image = new Image();
        this.image.src = 'sources/imgs/starship.png';

        // Change the initial position to the top right corner
        this.x = window.innerWidth - this.width;
        this.y = this.height;

    }

    update(mouseX, mouseY) {
        // Calculate direction and distance to target
        let dx = mouseX - this.x;
        let dy = mouseY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Check if mouse has moved
        if (mouseX !== this.targetX || mouseY !== this.targetY) {
            this.targetX = mouseX;
            this.targetY = mouseY;
            this.isStopping = false;
        }

        if (distance > this.stopThreshold && !this.isStopping) {
            // Apply thrust
            this.velocityX += (dx / distance) * this.thrust;
            this.velocityY += (dy / distance) * this.thrust;

            // Limit speed
            let speed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
            if (speed > this.maxSpeed) {
                this.velocityX = (this.velocityX / speed) * this.maxSpeed;
                this.velocityY = (this.velocityY / speed) * this.maxSpeed;
            }
        } else {
            // Start stopping procedure
            this.isStopping = true;
            // Apply stronger friction to stop
            this.velocityX *= 0.95;
            this.velocityY *= 0.95;
        }

        // Apply normal friction
        this.velocityX *= this.friction;
        this.velocityY *= this.friction;

        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Update rotation with limited turning speed
        let targetRotation = Math.atan2(this.velocityY, this.velocityX) + Math.PI / 2;
        let rotationDiff = targetRotation - this.rotation;
        
        // Normalize the rotation difference to be between -PI and PI
        if (rotationDiff > Math.PI) rotationDiff -= 2 * Math.PI;
        if (rotationDiff < -Math.PI) rotationDiff += 2 * Math.PI;
        
        // Limit the rotation speed
        rotationDiff = Math.max(Math.min(rotationDiff, this.maxRotationSpeed), -this.maxRotationSpeed);
        
        this.rotation += rotationDiff;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

        // Draw flame
        if (Math.abs(this.velocityX) > 0.1 || Math.abs(this.velocityY) > 0.1) {
            ctx.fillStyle = 'orange';
            ctx.beginPath();
            ctx.moveTo(this.width / 4, this.height / 2);
            ctx.lineTo(-this.width / 4, this.height / 2);
            ctx.lineTo(0, this.height / 2 + Math.random() * 10 + 5); // Reduced flame size
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if the device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // If it's not mobile, proceed with the animation
    if (!isMobile) {
        const canvas = document.createElement('canvas');
        document.getElementById('firstsection').appendChild(canvas);
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';

        let particles = [];
        const starship = new Starship();
        let mouseX = window.innerWidth - starship.width / 2;
        let mouseY = starship.height / 2;

        function createParticles(x, y, angle) {
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(x, y, angle));
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            starship.update(mouseX, mouseY);
            starship.draw(ctx);

            if (Math.abs(starship.velocityX) > 0.1 || Math.abs(starship.velocityY) > 0.1) {
                createParticles(
                    starship.x - Math.sin(starship.rotation) * starship.height / 2,
                    starship.y + Math.cos(starship.rotation) * starship.height / 2,
                    starship.rotation + Math.PI // Particles should go in the opposite direction of the ship's rotation
                );
            }

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw(ctx);
                if (particles[i].size <= 0.1) {
                    particles.splice(i, 1);
                    i--;
                }
            }

            requestAnimationFrame(animate);
        }

        animate();

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    }
});
