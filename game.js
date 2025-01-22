// Seçim ve değişkenler
const game = document.querySelector('.game');

// Temel ayarlar
const ballSpeed = 2; // Top hızı
const racketSpeed = 20; // Raket hızı
let ballX = 190; // Topun X pozisyonu
let ballY = 550; // Topun Y pozisyonu
let ballDX = ballSpeed; // Topun X doğrultusu
let ballDY = -ballSpeed; // Topun Y doğrultusu
let racketX = 150; // Raketin başlangıç X pozisyonu
let isGameRunning = true;

// Raket oluştur
const racket = document.createElement('div');
racket.classList.add('racket');
game.appendChild(racket);

// Top oluştur
const ball = document.createElement('div');
ball.classList.add('ball');
game.appendChild(ball);

// Tuğlaları oluştur
const createBricks = () => {
    const rows = 3;
    const cols = 9;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const brick = document.createElement('div');
            brick.classList.add('brick');

            brick.style.left = `${col * 42 + 5}px`;
            brick.style.top = `${row * 25 + 5}px`;
            game.appendChild(brick);
        }
    }
};

// Oyun döngüsü
const gameLoop = () => {
    if (!isGameRunning) return;

    // Top hareketini hesapla
    ballX += ballDX;
    ballY += ballDY;

    // Topun konumunu güncelle
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    // Duvarlara çarpmayı kontrol et
    if (ballX <= 0 || ballX >= game.clientWidth - ball.clientWidth) {
        ballDX *= -1; // Yön değiştir
    }

    if (ballY <= 0) {
        ballDY *= -1; // Yön değiştir
    }

    // Alt sınır kontrolü (Kaybetme durumu)
    if (ballY >= game.clientHeight - ball.clientHeight) {
        isGameRunning = false;
        alert("Kaybettiniz!");
        return;
    }

    // Raketle çarpışmayı kontrol et
    const racketTop = game.clientHeight - 30;
    const racketLeft = racketX;
    const racketRight = racketX + racket.clientWidth;

    if (
        ballY + ball.clientHeight >= racketTop &&
        ballX + ball.clientWidth >= racketLeft &&
        ballX <= racketRight
    ) {
        ballDY *= -1; // Yukarı yön değiştir
    }

    // Tuğlalarla çarpışmayı kontrol et
    const bricks = Array.from(document.querySelectorAll('.brick'));
    bricks.forEach((brick) => {
        const brickRect = brick.getBoundingClientRect();
        const ballRect = ball.getBoundingClientRect();

        if (
            ballRect.right > brickRect.left &&
            ballRect.left < brickRect.right &&
            ballRect.bottom > brickRect.top &&
            ballRect.top < brickRect.bottom
        ) {
            brick.remove(); // Tuğlayı sil
            ballDY *= -1; // Y yönünü değiştir
        }
    });

    // Tüm tuğlalar silindiyse kazanma durumu
    if (bricks.length === 0) {
        isGameRunning = false;
        alert("Kazandınız!");
        return;
    }

    requestAnimationFrame(gameLoop); // Animasyonu devam ettir
};

// Raket kontrolü
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && racketX > 0) {
        racketX -= racketSpeed;
    } else if (e.key === 'ArrowRight' && racketX < game.clientWidth - racket.clientWidth) {
        racketX += racketSpeed;
    }

    racket.style.left = `${racketX}px`;
});

// Tuğlaları oluştur ve oyunu başlat
createBricks();
gameLoop();
