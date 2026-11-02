/* ===== CONFIG ===== */
const WHATSAPP_NUMBER = "5521991079252";
const ADS_SEND_TO = "AW-18405161587/Nzv_CIP7lbAdEPP0ochE";

/* ===== HEADER ===== */
const header = document.querySelector(".header");

if (header) {
    window.addEventListener("scroll", () => {
        header.classList.toggle("visible", window.scrollY > 100);
    });
}

/* ===== MODAL DE QUALIFICAÇÃO ===== */
const modal = document.createElement("div");
modal.className = "lead-modal";
modal.setAttribute("role", "dialog");
modal.setAttribute("aria-modal", "true");
modal.hidden = true;

modal.innerHTML = `
  <div class="lead-box">
    <button type="button" class="lead-close" aria-label="Fechar">&times;</button>
    <h3>Peça seu orçamento</h3>
    <p>Responda rapidinho para agilizarmos seu atendimento.</p>

    <form id="lead-form" novalidate>
      <label>Seu nome
        <input type="text" name="nome" required>
      </label>

      <label>O que você precisa?
        <select name="servico" required>
          <option value="">Selecione</option>
          <option>Mudança residencial</option>
          <option>Frete / carreto</option>
          <option>Mudança comercial</option>
          <option>Reboque de moto</option>
          <option>Aluguel de mesas e cadeiras</option>
        </select>
      </label>

      <label><span id="lbl-origem">Bairro/cidade de origem</span>
        <input type="text" name="origem" required>
      </label>

      <label id="grp-destino">Bairro/cidade de destino
        <input type="text" name="destino">
      </label>

      <label>Quando precisa?
        <select name="quando" required>
          <option value="">Selecione</option>
          <option>Esta semana</option>
          <option>Este mês</option>
          <option>Mais de 1 mês</option>
          <option value="pesquisando">Só estou pesquisando preços</option>
        </select>
      </label>

      <input type="text" name="site" class="lead-hp" tabindex="-1" autocomplete="off">

      <p class="lead-error" hidden>Preencha os campos obrigatórios.</p>

      <button type="submit" class="btn btn-primary lead-submit">
        Continuar no WhatsApp
      </button>
    </form>
  </div>`;

document.body.appendChild(modal);

const form = modal.querySelector("#lead-form");
const errorMsg = modal.querySelector(".lead-error");
const grpDestino = modal.querySelector("#grp-destino");
const lblOrigem = modal.querySelector("#lbl-origem");

function openModal() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    form.nome.focus();
}

function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
}

modal.querySelector(".lead-close").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

/* Mesas e cadeiras não têm "destino": é o local do evento */
form.servico.addEventListener("change", () => {
    const mesas = form.servico.value === "Aluguel de mesas e cadeiras";
    grpDestino.hidden = mesas;
    lblOrigem.textContent = mesas ? "Local do evento (bairro/cidade)" : "Bairro/cidade de origem";
});

function buildMessage(d) {
    const linhas = [
        "Olá! Vim pelo site e gostaria de um orçamento.",
        "",
        `*Nome:* ${d.nome}`,
        `*Serviço:* ${d.servico}`,
        d.servico === "Aluguel de mesas e cadeiras"
            ? `*Local do evento:* ${d.origem}`
            : `*Origem:* ${d.origem}\n*Destino:* ${d.destino}`,
        `*Prazo:* ${d.quando === "pesquisando" ? "Só pesquisando preços" : d.quando}`
    ];
    return linhas.join("\n");
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const d = Object.fromEntries(new FormData(form));

    /* Anti-bot: campo escondido preenchido */
    if (d.site) return;

    const mesas = d.servico === "Aluguel de mesas e cadeiras";
    const faltando = !d.nome.trim() || !d.servico || !d.origem.trim() || !d.quando
        || (!mesas && !d.destino.trim());

    errorMsg.hidden = !faltando;
    if (faltando) return;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(d))}`;

    /* Abre o WhatsApp primeiro (precisa estar dentro do clique, senão o navegador bloqueia) */
    window.open(url, "_blank", "noopener,noreferrer");

    /* Conversão só para quem não está "só pesquisando" */
    const redirect = () => { window.location.href = "obrigado.html"; };

    if (d.quando !== "pesquisando" && typeof gtag === "function") {
        let done = false;
        const go = () => { if (!done) { done = true; redirect(); } };
        gtag("event", "conversion", {
            send_to: ADS_SEND_TO,
            event_callback: go
        });
        setTimeout(go, 1000); // garantia caso a tag demore
    } else {
        redirect();
    }
});

/* Todos os botões de WhatsApp abrem o formulário */
document.querySelectorAll(".whatsapp-link, a.btn[href$='#contato']").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
    });
});