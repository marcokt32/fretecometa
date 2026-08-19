document.addEventListener("DOMContentLoaded", () => {

    const carousel = document.querySelector(".cargo-carousel");

    if (!carousel) return;

    const track = carousel.querySelector(".cargo-carousel-track");
    const cards = carousel.querySelectorAll(".cargo-card");

    const prevButton = carousel.querySelector(".cargo-carousel-prev");
    const nextButton = carousel.querySelector(".cargo-carousel-next");

    const dots = document.querySelectorAll(".cargo-dot");

    if (!track || !cards.length) return;


    /* =========================
       CONFIGURAÇÃO
    ========================= */

    let currentIndex = 0;

    let cardsPerView = getCardsPerView();

    let maxIndex = Math.max(
        0,
        cards.length - cardsPerView
    );


    /* =========================
       QUANTIDADE DE CARDS
    ========================= */

    function getCardsPerView() {

        if (window.innerWidth <= 768) {
            return 1;
        }

        if (window.innerWidth <= 992) {
            return 2;
        }

        return 3;
    }


    /* =========================
       ATUALIZAR CARROSSEL
    ========================= */

    function updateCarousel() {

        cardsPerView = getCardsPerView();

        maxIndex = Math.max(
            0,
            cards.length - cardsPerView
        );

        /*
         * Cada card possui uma largura calculada
         * pelo CSS e existe um gap entre eles.
         *
         * Calculamos a distância usando a posição
         * real do card.
         */

        const cardWidth = cards[0].getBoundingClientRect().width;

        const gap = parseFloat(
            getComputedStyle(track).gap
        ) || 0;

        const offset =
            currentIndex * (cardWidth + gap);

        track.style.transform =
            `translateX(-${offset}px)`;


        updateButtons();

        updateDots();
    }


    /* =========================
       PRÓXIMO
    ========================= */

    function nextSlide() {

        if (currentIndex < maxIndex) {

            currentIndex++;

        } else {

            currentIndex = 0;

        }

        updateCarousel();
    }


    /* =========================
       ANTERIOR
    ========================= */

    function previousSlide() {

        if (currentIndex > 0) {

            currentIndex--;

        } else {

            currentIndex = maxIndex;

        }

        updateCarousel();
    }


    /* =========================
       BOTÕES
    ========================= */

    nextButton.addEventListener(
        "click",
        nextSlide
    );

    prevButton.addEventListener(
        "click",
        previousSlide
    );


    /* =========================
       INDICADORES
    ========================= */

    function updateDots() {

        dots.forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentIndex
            );

        });

    }


    dots.forEach((dot, index) => {

        dot.addEventListener(
            "click",
            () => {

                if (index <= maxIndex) {

                    currentIndex = index;

                    updateCarousel();

                }

            }
        );

    });


    /* =========================
       BOTÕES VISUAIS
    ========================= */

    function updateButtons() {

        /*
         * Como o carrossel é infinito,
         * os botões permanecem disponíveis.
         */

        prevButton.disabled = false;
        nextButton.disabled = false;

    }


    /* =========================
       SWIPE / DRAG
    ========================= */

    let startX = 0;

    let currentX = 0;

    let isDragging = false;


    function startDrag(event) {

        isDragging = true;

        startX =
            event.type === "touchstart"
                ? event.touches[0].clientX
                : event.clientX;

    }


    function moveDrag(event) {

        if (!isDragging) return;

        currentX =
            event.type === "touchmove"
                ? event.touches[0].clientX
                : event.clientX;

    }


    function endDrag() {

        if (!isDragging) return;

        isDragging = false;

        const distance =
            currentX - startX;

        const minimumSwipe = 50;


        if (Math.abs(distance) >= minimumSwipe) {

            if (distance < 0) {

                nextSlide();

            } else {

                previousSlide();

            }

        }

        startX = 0;

        currentX = 0;

    }


    /* TOUCH */

    track.addEventListener(
        "touchstart",
        startDrag,
        { passive: true }
    );

    track.addEventListener(
        "touchmove",
        moveDrag,
        { passive: true }
    );

    track.addEventListener(
        "touchend",
        endDrag
    );


    /* MOUSE */

    track.addEventListener(
        "mousedown",
        startDrag
    );

    window.addEventListener(
        "mousemove",
        moveDrag
    );

    window.addEventListener(
        "mouseup",
        endDrag
    );


    /* =========================
       REDIMENSIONAMENTO
    ========================= */

    window.addEventListener(
        "resize",
        () => {

            currentIndex = Math.min(
                currentIndex,
                maxIndex
            );

            updateCarousel();

        }
    );


    /* =========================
       INICIALIZAÇÃO
    ========================= */

    updateCarousel();

});