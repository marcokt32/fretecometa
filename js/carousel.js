const slides = document.querySelectorAll(".hero-slide-image");

let currentSlide = 0;

/* Espera a imagem terminar de carregar. Retorna false se ela falhar. */
function waitForImage(img) {

    return new Promise(resolve => {

        if (img.complete) {
            resolve(img.naturalWidth > 0);
            return;
        }

        img.addEventListener("load", () => resolve(true), { once: true });
        img.addEventListener("error", () => resolve(false), { once: true });

    });
}

async function advanceHero() {

    /* Procura a próxima imagem que carregou de verdade */
    for (let i = 1; i < slides.length; i++) {

        const nextIndex = (currentSlide + i) % slides.length;

        const loaded = await waitForImage(slides[nextIndex]);

        if (loaded) {

            slides[currentSlide].classList.remove("active");
            slides[nextIndex].classList.add("active");

            currentSlide = nextIndex;

            break;
        }
    }

    setTimeout(advanceHero, 5000);
}

if (slides.length > 1) {
    setTimeout(advanceHero, 5000);
}