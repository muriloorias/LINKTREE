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


const platformMap = {
    youtube: { name: 'YouTube', icon: '▶' },
    instagram: { name: 'Instagram', icon: '◎' },
    telegram: { name: 'Telegram', icon: '➤' },
    x: { name: 'X', icon: '𝕏' },
    whatsapp: { name: 'WhatsApp', icon: '◔' },
    twitter: { name: 'X', icon: '𝕏' },
    facebook: { name: 'Facebook', icon: 'f' },
    github: { name: 'GitHub', icon: '◌' },
    linkedin: { name: 'LinkedIn', icon: 'in' },
    spotify: { name: 'Spotify', icon: '♫' },
    tiktok: { name: 'TikTok', icon: '♪' },
    discord: { name: 'Discord', icon: '◌' },
    reddit: { name: 'Reddit', icon: '◉' },
    default: { name: 'Link', icon: '↗' },
};

function detectPlatform(url) {
    if (!url) {
        return { platform: 'default', ...platformMap.default };
    }

    try {
        const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
        const { hostname } = new URL(normalizedUrl);
        const host = hostname.replace(/^www\./i, '').toLowerCase();

        const matchers = [
            { key: 'youtube', pattern: /(^|\.)youtube\.com$|youtu\.be$/i },
            { key: 'instagram', pattern: /(^|\.)instagram\.com$/i },
            { key: 'telegram', pattern: /(^|\.)t\.me$|(^|\.)telegram\.org$/i },
            { key: 'x', pattern: /(^|\.)x\.com$|(^|\.)twitter\.com$/i },
            { key: 'whatsapp', pattern: /(^|\.)whatsapp\.com$|(^|\.)wa\.me$/i },
            { key: 'facebook', pattern: /(^|\.)facebook\.com$/i },
            { key: 'github', pattern: /(^|\.)github\.com$/i },
            { key: 'linkedin', pattern: /(^|\.)linkedin\.com$/i },
            { key: 'spotify', pattern: /(^|\.)spotify\.com$/i },
            { key: 'tiktok', pattern: /(^|\.)tiktok\.com$/i },
            { key: 'discord', pattern: /(^|\.)discord\.com$|(^|\.)discord\.gg$/i },
            { key: 'reddit', pattern: /(^|\.)reddit\.com$/i },
        ];

        const match = matchers.find(({ pattern }) => pattern.test(host));

        if (match) {
            return { platform: match.key, ...platformMap[match.key] };
        }
    } catch (error) {
        console.warn('Não foi possível identificar o link:', error);
    }

    return { platform: 'default', ...platformMap.default };
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

        const platform = detectPlatform(link.url);
        const button = document.createElement('a');
        const icon = document.createElement('span');
        const label = document.createElement('span');
        const marker = document.createElement('span');

        button.className = 'link-button';
        button.dataset.platform = platform.platform;
        button.href = link.url;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.style.animationDelay = `${index * 50}ms`;
        button.title = link.title || platform.name;
        button.setAttribute('aria-label', link.title || platform.name);

        icon.className = 'link-button__icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = platform.icon;

        label.className = 'link-button__label';
        label.textContent = link.title || platform.name;

        marker.className = 'link-button__marker';
        marker.setAttribute('aria-hidden', 'true');
        marker.textContent = '•••';

        button.append(icon, label, marker);
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
