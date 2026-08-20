const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 100) {
        header.classList.add("visible");
    } else {
        header.classList.remove("visible");
    }

});


const whatsappLinks = document.querySelectorAll(".whatsapp-link");

whatsappLinks.forEach(link => {

    link.addEventListener("click", (event) => {

        event.preventDefault();

        const whatsappUrl =
            "https://wa.me/5521991079252?text=Ol%C3%A1%21%20Gostaria%20de%20solicitar%20uma%20cota%C3%A7%C3%A3o%20de%20frete.%20Poderia%20me%20ajudar%20com%20as%20informa%C3%A7%C3%B5es%20sobre%20valores%2C%20prazo%20e%20disponibilidade%3F";

        window.open(
            whatsappUrl,
            "_blank",
            "noopener,noreferrer"
        );

        window.location.href = "obrigado.html";

    });

});