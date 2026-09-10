// Parte de salvamento
const titleElement = document.getElementById('title');
const subtitleElement = document.getElementById('subtitle');
const linksContainer = document.getElementById('links-container');

const storageKey = 'linktree-page';


function loadPage() {
    const savedPage = localStorage.getItem(storageKey);

    // Não existe nenhuma página salva
    if (!savedPage) {
        showEmptyPage();
        return;
    }

    try {
        const page = JSON.parse(savedPage);
        renderPage(page);
    } catch (error) {
        console.error('Erro ao ler a página:', error);
        showError();
    }
}


function renderPage(page) {
    if (page.title) {
        titleElement.textContent = page.title;
        document.title = page.title;
    }

    if (page.subtitle) {
        subtitleElement.textContent = page.subtitle;
    } else {
        subtitleElement.style.display = 'none';
    }

    renderBackground(page.background);
    renderLinks(page.links);
}


function renderBackground(background) {
    if (!background) return;

    if (background.type === 'color' && background.value) {
        document.body.style.background = background.value;
        return;
    }

    if (background.type === 'image' && background.value) {
        document.body.style.backgroundImage = `url("${background.value}")`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.classList.add('has-background-image');
    }
}


function renderLinks(links) {
    linksContainer.innerHTML = '';

    if (!Array.isArray(links) || links.length === 0) {
        const message = document.createElement('p');
        message.className = 'no-links';
        message.textContent = 'Nenhum link adicionado ainda.';
        linksContainer.appendChild(message);
        return;
    }

    links.forEach((link, index) => {
        if (!link.url) return;

        const button = document.createElement('a');
        button.className = 'link-button';
        button.href = link.url;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.textContent = link.title || link.url;
        button.style.animationDelay = `${index * 50}ms`;

        linksContainer.appendChild(button);
    });
}


// Página vazia
function showEmptyPage() {
    titleElement.textContent = 'Nenhuma página criada';
    subtitleElement.textContent = 'Crie sua página no Linktree Creator.';

    linksContainer.innerHTML = '';

    const button = document.createElement('a');
    button.className = 'link-button';
    button.href = 'creator.html';
    button.textContent = 'Criar minha página';

    linksContainer.appendChild(button);
}


function showError() {
    titleElement.textContent = 'Erro ao carregar página';
    subtitleElement.textContent = 'Os dados salvos não puderam ser carregados.';
}


loadPage();
