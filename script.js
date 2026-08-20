(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        // ============================================================
        // DOM CACHE
        // ============================================================

        const triggerOverlay = document.getElementById('triggerOverlay');
        const startButton = document.getElementById('startButton');
        const loadingBar = document.getElementById('loadingBar');
        const statusText = document.getElementById('statusText');

        const ambientLight = document.getElementById('ambientLight');
        const roseWrapper = document.getElementById('roseWrapper');
        const roseHead = document.getElementById('roseHead');
        const calyx = document.getElementById('calyx');

        const stem = document.getElementById('stem');
        const leafLeft = document.getElementById('leafLeft');
        const leafRight = document.getElementById('leafRight');

        const endText = document.getElementById('endText');
        const fallingPetalsEl = document.getElementById('fallingPetals');

        // ============================================================
        // CONFIG
        // ============================================================

        const PETAL_LAYERS = [
            {
                count: 4,
                w: 24,
                h: 46,
                curl: 78,
                delayBase: 0,
                tz: 2,
                cls: 'petal-bud'
            },
            {
                count: 5,
                w: 34,
                h: 58,
                curl: 65,
                delayBase: 0.25,
                tz: 9,
                cls: 'petal-core'
            },
            {
                count: 6,
                w: 46,
                h: 72,
                curl: 48,
                delayBase: 0.55,
                tz: 18,
                cls: 'petal-inner'
            },
            {
                count: 7,
                w: 58,
                h: 88,
                curl: 22,
                delayBase: 0.90,
                tz: 30,
                cls: 'petal-mid-inner'
            },
            {
                count: 8,
                w: 72,
                h: 104,
                curl: -5,
                delayBase: 1.30,
                tz: 44,
                cls: 'petal-mid'
            },
            {
                count: 9,
                w: 86,
                h: 118,
                curl: -25,
                delayBase: 1.75,
                tz: 60,
                cls: 'petal-outer'
            },
            {
                count: 10,
                w: 98,
                h: 130,
                curl: -48,
                delayBase: 2.25,
                tz: 76,
                cls: 'petal-blush'
            }
        ];

        const SEPALS_COUNT = 5;

        const FALLING_PETAL_COLORS = [
            ['#2a944e', '#092e12'],
            ['#238541', '#071f0c'],
            ['#3aaa5d', '#114c23'],
            ['#55bf75', '#1a6f35']
        ];

        const LOADER_DURATION = 2400;
        const MAX_FALLING_PETALS = 10;
        const FALLING_PETAL_INTERVAL = 2200;

        let fallingPetalInterval = null;
        let animationStarted = false;
        let loaderFrame = 0;

        // ============================================================
        // SMALL UTILITIES
        // ============================================================

        const delay = ms =>
            new Promise(resolve => setTimeout(resolve, ms));

        const random = (min, max) =>
            min + Math.random() * (max - min);

        const randomSign = () =>
            Math.random() > 0.5 ? 1 : -1;

        // ============================================================
        // LOADER
        // ============================================================

        function startCardLoader() {
            const steps = [
                [20, 'Loading Love.css...'],
                [50, 'Growing digital petals...'],
                [80, 'Adding velvet textures...'],
                [95, 'Optimizing 3D rendering...'],
                [100, 'Ready to bloom!']
            ];

            let startTimestamp = 0;
            let lastPercent = -1;

            const animateLoader = timestamp => {
                if (!startTimestamp) {
                    startTimestamp = timestamp;
                }

                const progress = Math.min(
                    (timestamp - startTimestamp) / LOADER_DURATION,
                    1
                );

                const percent = Math.floor(progress * 100);

                // Solo tocar el DOM cuando realmente cambia el porcentaje.
                if (percent !== lastPercent) {
                    lastPercent = percent;

                    // Transform no provoca layout como width.
                    loadingBar.style.transform =
                        `scaleX(${percent / 100})`;

                    // Encontrar el texto activo.
                    let activeText = steps[steps.length - 1][1];

                    for (let i = 0; i < steps.length; i++) {
                        if (percent <= steps[i][0]) {
                            activeText = steps[i][1];
                            break;
                        }
                    }

                    if (statusText.textContent !== activeText) {
                        statusText.textContent = activeText;
                    }
                }

                if (progress < 1) {
                    loaderFrame = requestAnimationFrame(animateLoader);
                } else {
                    loaderFrame = 0;
                    startButton.disabled = false;
                }
            };

            loaderFrame = requestAnimationFrame(animateLoader);
        }

        // ============================================================
        // SEPALS
        // ============================================================

        function createSepals() {
            const fragment = document.createDocumentFragment();
            const step = 360 / SEPALS_COUNT;

            for (let i = 0; i < SEPALS_COUNT; i++) {
                const sepal = document.createElement('div');

                const angle =
                    i * step + random(-2.5, 2.5);

                const delayValue =
                    0.3 + i * 0.06;

                const curl =
                    random(18, 26);

                sepal.className = 'sepal';

                sepal.style.setProperty(
                    '--sepal-angle',
                    `${angle}deg`
                );

                sepal.style.setProperty(
                    '--sepal-curl',
                    `${curl}deg`
                );

                sepal.style.setProperty(
                    '--sepal-delay',
                    `${delayValue}s`
                );

                fragment.appendChild(sepal);
            }

            // Una sola operación de DOM.
            calyx.appendChild(fragment);
        }

        // ============================================================
        // ROSE PETALS
        // ============================================================

       function createPetals() {
    const fragment = document.createDocumentFragment();

    PETAL_LAYERS.forEach((layer, layerIndex) => {
        const angleStep = 360 / layer.count;

        // Mantiene la distribución original pero evita
        // que varias capas queden exactamente alineadas.
        const layerOffset =
            layerIndex * 24 +
            (Math.random() - 0.5) * 8;

        for (let i = 0; i < layer.count; i++) {
            const petal = document.createElement('div');

            petal.className = `petal ${layer.cls}`;

            const angle =
                layerOffset +
                i * angleStep +
                (Math.random() - 0.5) * 5;

            const delay =
                layer.delayBase +
                i * 0.05;

            const curl =
                layer.curl +
                (Math.random() - 0.5) * 6;

            const scale =
                0.94 +
                Math.random() * 0.12;

            const bloomDuration =
                2.1 +
                Math.random() * 0.4;

            petal.style.width = `${layer.w}px`;
            petal.style.height = `${layer.h}px`;

            petal.style.setProperty('--angle', `${angle}deg`);
            petal.style.setProperty('--curl', `${curl}deg`);
            petal.style.setProperty('--scale', scale);
            petal.style.setProperty('--delay', `${delay}s`);
            petal.style.setProperty('--tz', `${layer.tz}px`);
            petal.style.setProperty('--bloom-dur', `${bloomDuration}s`);

            fragment.appendChild(petal);
        }
    });

    roseHead.appendChild(fragment);
}

        // ============================================================
        // STEM
        // ============================================================

        function growStem() {
            return new Promise(resolve => {
                stem.classList.add('grow');

                setTimeout(() => {
                    leafLeft.classList.add('visible');
                }, 800);

                setTimeout(() => {
                    leafRight.classList.add('visible');
                }, 1100);

                setTimeout(resolve, 2200);
            });
        }

        // ============================================================
        // BLOOM
        // ============================================================

        function bloom() {
            // Las tres modificaciones ocurren en el mismo task.
            calyx.classList.add('visible');
            ambientLight.classList.add('visible');
            roseHead.classList.add('blooming');
        }

        // ============================================================
        // FALLING PETALS
        // ============================================================

        function spawnFallingPetal() {
            if (
                fallingPetalsEl.childElementCount >=
                MAX_FALLING_PETALS
            ) {
                return;
            }

            const petal = document.createElement('div');

            petal.className = 'falling-petal';

            const w = random(10, 22);
            const h = w * random(1.25, 1.40);

            const x = random(20, 80);
            const y = random(3, 13);

            const duration = random(5.5, 9);
            const animationDelay = random(0, 0.6);

            const colors =
                FALLING_PETAL_COLORS[
                    Math.floor(
                        Math.random() *
                        FALLING_PETAL_COLORS.length
                    )
                ];

            const s1 =
                randomSign() * random(15, 40);

            const s2 =
                randomSign() * random(10, 30);

            const s3 =
                randomSign() * random(20, 50);

            const s4 =
                randomSign() * random(10, 25);

            petal.style.left = `${x}vw`;
            petal.style.top = `${y}vh`;

            petal.style.setProperty(
                '--fp-w',
                `${w}px`
            );

            petal.style.setProperty(
                '--fp-h',
                `${h}px`
            );

            petal.style.setProperty(
                '--fp-c1',
                colors[0]
            );

            petal.style.setProperty(
                '--fp-c2',
                colors[1]
            );

            petal.style.setProperty(
                '--f-dur',
                `${duration}s`
            );

            petal.style.setProperty(
                '--f-delay',
                `${animationDelay}s`
            );

            petal.style.setProperty(
                '--s1',
                `${s1}px`
            );

            petal.style.setProperty(
                '--s2',
                `${s2}px`
            );

            petal.style.setProperty(
                '--s3',
                `${s3}px`
            );

            petal.style.setProperty(
                '--s4',
                `${s4}px`
            );

            fallingPetalsEl.appendChild(petal);

            const removeDelay =
                (duration + animationDelay) * 1000 + 300;

            setTimeout(() => {
                petal.remove();
            }, removeDelay);
        }

        function startFallingPetals() {
            // Evitar iniciar el intervalo más de una vez.
            if (fallingPetalInterval !== null) {
                return;
            }

            for (let i = 0; i < 3; i++) {
                setTimeout(
                    spawnFallingPetal,
                    i * 300
                );
            }

            fallingPetalInterval = setInterval(
                spawnFallingPetal,
                FALLING_PETAL_INTERVAL
            );
        }

        // ============================================================
        // MAIN ANIMATION
        // ============================================================

        async function startAnimationSequence() {
            await growStem();

            await delay(100);

            bloom();

            setTimeout(() => {
                roseWrapper.classList.add('rotating');
            }, 2600);

            setTimeout(() => {
                startFallingPetals();
            }, 3400);

            setTimeout(() => {
                endText.classList.add('visible');
            }, 4600);
        }

        // ============================================================
        // START BUTTON
        // ============================================================

        startButton.addEventListener(
            'click',
            () => {
                // Protección contra doble click.
                if (animationStarted) {
                    return;
                }

                animationStarted = true;

                startButton.disabled = true;

                triggerOverlay.classList.add(
                    'fade-out'
                );

                setTimeout(() => {
                    void startAnimationSequence();
                }, 800);
            },
            {
                passive: true
            }
        );

        // ============================================================
        // INITIALIZATION
        // ============================================================

        createSepals();
        createPetals();

        setTimeout(() => {
            startCardLoader();
        }, 400);

        // Limpieza por si la página permanece abierta mucho tiempo.
        window.addEventListener(
            'pagehide',
            () => {
                if (loaderFrame) {
                    cancelAnimationFrame(loaderFrame);
                }

                if (fallingPetalInterval !== null) {
                    clearInterval(fallingPetalInterval);
                    fallingPetalInterval = null;
                }
            },
            { once: true }
        );
    });
})();