const firstScene = document.getElementById('first-scene');
const card = document.getElementById('clickable-card');
const questionContainer = document.getElementById('secret-question');
const mainText = document.getElementById('main-question-text');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const music = document.getElementById('bg-music');
const buttonsContainer = document.querySelector('.buttons');
const endVideo = document.getElementById('end-video');

let hasTriedNo = false;
let yesRunCount = 0;
let currentStep = 1;

// 1. Открытие карточки
card.addEventListener('click', function () {
    music.play();
    card.style.transition = 'all 0.4s ease';
    card.style.opacity = '0';
    setTimeout(function () {
        if (firstScene) firstScene.remove();
        questionContainer.classList.remove('hidden');
    }, 400);
});

// Размашистые прыжки
function getFarCoordinates(button) {
    const containerWidth = buttonsContainer.offsetWidth;
    const containerHeight = buttonsContainer.offsetHeight;
    const currentX = parseFloat(button.style.left) || (button.id === 'btn-yes' ? 20 : containerWidth - 120);
    const currentY = parseFloat(button.style.top) || 40;
    let newX, newY, distance;
    const minJump = 80;

    do {
        newX = Math.floor(Math.random() * (containerWidth - button.offsetWidth));
        newY = Math.floor(Math.random() * (containerHeight - button.offsetHeight));
        distance = Math.sqrt(Math.pow(newX - currentX, 2) + Math.pow(newY - currentY, 2));
    } while (distance < minJump);

    return { x: newX, y: newY };
}

function triggerShake() {
    questionContainer.classList.add('shake-effect');
    setTimeout(() => { questionContainer.classList.remove('shake-effect'); }, 400);
}

// НАШ СУПЕР-МОЩНЫЙ МНОГОКРАТНЫЙ САЛЮТ ИЗ КОНФЕТТИ
function fireworkExplosion() {
    const colors = ['#ff3366', '#00ffcc', '#ffcc00', '#33ccff', '#ff66ff', '#99ff33', '#ffffff', '#ff9900'];

    // Создаем контейнер для конфетти
    const confettiBox = document.createElement('div');
    confettiBox.style.position = 'absolute';
    confettiBox.style.top = '0';
    confettiBox.style.left = '0';
    confettiBox.style.width = '100%';
    confettiBox.style.height = '100%';
    confettiBox.style.overflow = 'hidden';
    confettiBox.style.pointerEvents = 'none';
    confettiBox.style.zIndex = '999';
    questionContainer.appendChild(confettiBox);

    // Функция, которая делает ОДИН мощный залп
    function launchBurst() {
        const particleCount = 150; // Количество частиц в одном залпе

        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.style.position = 'absolute';

            // Генерируем случайную точку вылета в районе центра, чтобы взрыв был объемным
            const startX = questionContainer.offsetWidth / 2 + (Math.random() * 40 - 20);
            const startY = questionContainer.offsetHeight / 2 + (Math.random() * 40 - 20);

            p.style.left = startX + 'px';
            p.style.top = startY + 'px';

            // Разнообразные размеры частиц (от мелких до крупных)
            const size = Math.random() * 12 + 6;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // Делаем разные формы: круги, квадраты, ромбы
            const shapeRand = Math.random();
            if (shapeRand < 0.33) {
                p.style.borderRadius = '50%';
            } else if (shapeRand < 0.66) {
                p.style.transform = 'rotate(45deg)'; // Ромбики
            }

            confettiBox.appendChild(p);

            // Физика полета во все стороны (360 градусов)
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 12 + 6; // Увеличили скорость вылета
            let xSpeed = Math.cos(angle) * velocity;
            let ySpeed = Math.sin(angle) * velocity - 4; // Сильный толчок вверх

            let currentX = startX;
            let currentY = startY;
            let opacity = 1;

            function updateParticle() {
                currentX += xSpeed;
                currentY += ySpeed;
                ySpeed += 0.25; // Сила гравитации (тянет вниз)
                xSpeed *= 0.97; // Сопротивление воздуха
                opacity -= 0.01; // Сделали растворение более долгим, чтобы они летали дольше

                p.style.left = currentX + 'px';
                p.style.top = currentY + 'px';
                p.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(updateParticle);
                } else {
                    p.remove();
                }
            }
            requestAnimationFrame(updateParticle);
        }
    }

    // ЗАПУСКАЕМ СЕРИЮ ВЗРЫВОВ
    launchBurst(); // Первый мощный бабах сразу

    // Каждые 300 миллисекунд (чуть меньше трети секунды) бахает новый залп
    const interval = setInterval(launchBurst, 300);

    // Через 3.5 секунды прекращаем создавать новые взрывы, чтобы не лагал комп
    setTimeout(() => {
        clearInterval(interval);
    }, 3500);
}

// 2. Убегание кнопки "Нет"
function moveNoButton() {
    if (currentStep === 1) {
        const coords = getFarCoordinates(btnNo);
        btnNo.style.left = coords.x + 'px';
        btnNo.style.top = coords.y + 'px';
        hasTriedNo = true;
    }
}
btnNo.addEventListener('mouseenter', moveNoButton);
btnNo.addEventListener('touchstart', moveNoButton);

// 3. Убегание кнопки "Да" (Шаг 2)
function moveYesButton() {
    if (currentStep === 2 && yesRunCount < 3) {
        const coords = getFarCoordinates(btnYes);
        btnYes.style.left = coords.x + 'px';
        btnYes.style.top = coords.y + 'px';

        yesRunCount++;
        triggerShake();

        if (yesRunCount === 3) {
            mainText.textContent = "да нажми ну";
            btnNo.style.transform = 'scale(2)';
            btnNo.style.left = 'calc(50% - ' + (btnNo.offsetWidth * 2 / 2) + 'px)';
            btnNo.style.top = '30px';
            btnNo.style.zIndex = '100';
        }
    }
}
btnYes.addEventListener('mouseenter', moveYesButton);
btnYes.addEventListener('touchstart', moveYesButton);

// 4. Клик по кнопке "Да" (Финал)
btnYes.addEventListener('click', function () {
    if (currentStep === 1 && hasTriedNo === true) {
        mainText.textContent = "это я крч, надеюсь я в блок не улечу. сам прикол чет уже не прикалывает меня, но пох";
        btnYes.style.display = 'none';
        btnNo.style.display = 'none';

        endVideo.style.display = 'block';
        endVideo.play();

        fireworkExplosion(); // Наш автономный праздничный салют!
    }
    else if (currentStep === 1 && hasTriedNo === false) {
        currentStep = 2;
        mainText.textContent = "балин, есть прикол один, нажимай на нет везде";
        triggerShake();
        const coords = getFarCoordinates(btnYes);
        btnYes.style.left = coords.x + 'px';
        btnYes.style.top = coords.y + 'px';
    }
});

// 5. Возврат назад
btnNo.addEventListener('click', function () {
    if (currentStep === 2) {
        mainText.textContent = "";
        setTimeout(function () {
            mainText.textContent = "мы друзья?";
            btnNo.style.transform = 'scale(1)';
            btnNo.style.width = '100px';
            btnNo.style.height = '45px';
            btnNo.style.fontSize = '18px';
            btnYes.style.left = '20px';
            btnYes.style.top = '40px';
            btnNo.style.right = '20px';
            btnNo.style.left = 'auto';
            btnNo.style.top = '40px';
            currentStep = 1;
            hasTriedNo = true;
            yesRunCount = 0;
        }, 1500);
    }
});
