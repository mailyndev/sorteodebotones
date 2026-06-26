/**
 * Lógica del Juego: Elige tu destino
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const btnRed = document.getElementById('btn-red');
    const btnBlue = document.getElementById('btn-blue');
    const btnRestart = document.getElementById('btn-restart');
    const selectionZone = document.getElementById('selection-zone');
    const resultZone = document.getElementById('result-zone');
    const gameCard = document.getElementById('game-card');
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');
    const canvas = document.getElementById('confetti-canvas');
    
    // --- Configuración de Confeti ---
    const ctx = canvas.getContext('2d');
    let confettiActive = false;
    let particles = [];
    let animationFrameId = null;
    const confettiColors = [
        '#ff3366', // Rojo neón
        '#00ccff', // Azul neón
        '#10b981', // Verde éxito
        '#f59e0b', // Ámbar
        '#8b5cf6', // Violeta
        '#ec4899'  // Rosa
    ];

    // Ajustar tamaño del canvas a la pantalla
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', () => {
        if (confettiActive) resizeCanvas();
    });

    // Clase Confeti
    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height - 20;
            this.size = Math.random() * 8 + 6;
            this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            this.speedX = Math.random() * 4 - 2;
            this.speedY = Math.random() * 4 + 4;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 3 - 1.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            // Balanceo horizontal suave
            this.speedX += Math.sin(this.y * 0.05) * 0.05;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    function initConfetti() {
        confettiActive = true;
        resizeCanvas();
        particles = [];
        for (let i = 0; i < 120; i++) {
            particles.push(new Confetti());
        }
        animateConfetti();
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let activeCount = 0;

        particles.forEach(p => {
            if (p.y < canvas.height + 20) {
                p.update();
                p.draw();
                activeCount++;
            }
        });

        if (activeCount > 0 && confettiActive) {
            animationFrameId = requestAnimationFrame(animateConfetti);
        } else {
            stopConfetti();
        }
    }

    function stopConfetti() {
        confettiActive = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // --- Lógica del Juego ---
    
    // Mensajes aleatorios de victoria y derrota
    const winMessages = [
        "¡Has ganado! El destino te sonríe hoy. Has superado la prueba.",
        "¡Victoria! Tu intuición ha sido impecable. Te espera la gloria.",
        "¡Enhorabuena! Has elegido el camino correcto hacia el éxito."
    ];

    const loseMessages = [
        "Has perdido. El abismo te reclama esta vez. Inténtalo de nuevo.",
        "¡Derrota! Tu elección te ha llevado por un mal camino.",
        "Has perdido. La suerte no te ha acompañado. ¿Te atreves a probar otra vez?"
    ];

    function handleSelection(buttonColor) {
        // Deshabilitar clics temporalmente durante la transición
        btnRed.style.pointerEvents = 'none';
        btnBlue.style.pointerEvents = 'none';
        
        // Fase 1: Animar fuera la zona de selección
        selectionZone.classList.add('fade-out');
        
        // Esperar a que termine la animación de fade-out
        setTimeout(() => {
            selectionZone.classList.add('hidden');
            selectionZone.classList.remove('fade-out');
            
            // Fase 2: Determinar resultado aleatorio (50% de probabilidad)
            const didWin = Math.random() > 0.5;
            
            if (didWin) {
                // Configurar interfaz para Ganador
                gameCard.classList.add('win-state');
                resultTitle.textContent = "¡Has ganado! 🎉";
                resultDescription.textContent = winMessages[Math.floor(Math.random() * winMessages.length)];
                // Lanzar confeti
                initConfetti();
            } else {
                // Configurar interfaz para Perdedor
                gameCard.classList.add('lose-state');
                resultTitle.textContent = "Has perdido 😢";
                resultDescription.textContent = loseMessages[Math.floor(Math.random() * loseMessages.length)];
            }
            
            // Mostrar la zona de resultados con su respectiva animación
            resultZone.classList.remove('hidden');
        }, 400);
    }

    function resetGame() {
        // Detener confeti
        stopConfetti();
        
        // Animar fuera la pantalla de resultados
        resultZone.classList.add('fade-out');
        
        setTimeout(() => {
            resultZone.classList.add('hidden');
            resultZone.classList.remove('fade-out');
            
            // Quitar clases de estado de la tarjeta
            gameCard.classList.remove('win-state', 'lose-state');
            
            // Habilitar de nuevo botones
            btnRed.style.pointerEvents = 'auto';
            btnBlue.style.pointerEvents = 'auto';
            
            // Mostrar la pantalla de selección original
            selectionZone.classList.remove('hidden');
        }, 400);
    }

    // --- Listeners de Eventos ---
    btnRed.addEventListener('click', () => handleSelection('red'));
    btnBlue.addEventListener('click', () => handleSelection('blue'));
    btnRestart.addEventListener('click', resetGame);
});
