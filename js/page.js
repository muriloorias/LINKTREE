// Parte de salvamento
const titleElement = document.getElementById('title');
const subtitleElement = document.getElementById('subtitle');
const linksContainer = document.getElementById('links-container');

const storageKey = 'linktree-page';


function loadPage() {
    const savedPage = localStorage.getItem(storageKey);

    if (!savedPage) {
        showEmptyPage();
        return;
    }

    try {
        const page = JSON.parse(savedPage);
        renderPage(page);
    } catch (error) {
        console.error('Erro ao ler a pagina:', error);
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

    renderPhoto(page.photo);
    renderBackground(page.background);
    renderLinks(page.links);
}


function renderPhoto(photoSrc) {
    const profileImg = document.querySelector('.profile img');
    if (!profileImg) return;

    if (photoSrc && photoSrc.startsWith('data:')) {
        profileImg.src = photoSrc;
    }
}


function renderBackground(background) {
    if (!background) return;

    if (background.type === 'color' && background.value) {
        document.body.style.background = background.value;
        return;
    }

    if (background.type === 'image' && background.value) {
        document.body.style.backgroundImage = 'url("' + background.value + '")';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.classList.add('has-background-image');
    }
}


function getFaviconUrl(url) {
    try {
        const hostname = new URL(url).hostname;
        return 'https://www.google.com/s2/favicons?domain=' + hostname + '&sz=32';
    } catch {
        return null;
    }
}


const platformMap = {
    youtube:   { name: 'YouTube',   icon: String.fromCodePoint(0x25BA) },
    instagram: { name: 'Instagram', icon: String.fromCodePoint(0x25CE) },
    telegram:  { name: 'Telegram',  icon: String.fromCodePoint(0x27A4) },
    x:         { name: 'X',         icon: String.fromCodePoint(0x1D54F) },
    whatsapp:  { name: 'WhatsApp',  icon: String.fromCodePoint(0x25D4) },
    twitter:   { name: 'X',         icon: String.fromCodePoint(0x1D54F) },
    facebook:  { name: 'Facebook',  icon: 'f' },
    github:    { name: 'GitHub',    icon: String.fromCodePoint(0x25CC) },
    linkedin:  { name: 'LinkedIn',  icon: 'in' },
    spotify:   { name: 'Spotify',   icon: String.fromCodePoint(0x266B) },
    tiktok:    { name: 'TikTok',    icon: String.fromCodePoint(0x266A) },
    discord:   { name: 'Discord',   icon: String.fromCodePoint(0x25CC) },
    reddit:    { name: 'Reddit',    icon: String.fromCodePoint(0x25C9) },
    default:   { name: 'Link',      icon: String.fromCodePoint(0x2197) },
};

function detectPlatform(url) {
    if (!url) {
        return { platform: 'default', ...platformMap.default };
    }

    try {
        const normalizedUrl = /^https?:\/\//i.test(url) ? url : 'https://' + url;
        const { hostname } = new URL(normalizedUrl);
        const host = hostname.replace(/^www\./i, '').toLowerCase();

        const matchers = [
            { key: 'youtube',   pattern: /(^|\.)youtube\.com$|youtu\.be$/i },
            { key: 'instagram', pattern: /(^|\.)instagram\.com$/i },
            { key: 'telegram',  pattern: /(^|\.)t\.me$|(^|\.)telegram\.org$/i },
            { key: 'x',        pattern: /(^|\.)x\.com$|(^|\.)twitter\.com$/i },
            { key: 'whatsapp', pattern: /(^|\.)whatsapp\.com$|(^|\.)wa\.me$/i },
            { key: 'facebook', pattern: /(^|\.)facebook\.com$/i },
            { key: 'github',   pattern: /(^|\.)github\.com$/i },
            { key: 'linkedin', pattern: /(^|\.)linkedin\.com$/i },
            { key: 'spotify',  pattern: /(^|\.)spotify\.com$/i },
            { key: 'tiktok',   pattern: /(^|\.)tiktok\.com$/i },
            { key: 'discord',  pattern: /(^|\.)discord\.com$|(^|\.)discord\.gg$/i },
            { key: 'reddit',   pattern: /(^|\.)reddit\.com$/i },
        ];

        const match = matchers.find(({ pattern }) => pattern.test(host));

        if (match) {
            return { platform: match.key, ...platformMap[match.key] };
        }
    } catch (error) {
        console.warn('Nao foi possivel identificar o link:', error);
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
        button.className = 'link-button';
        button.dataset.platform = platform.platform;
        button.href = link.url;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.style.animationDelay = (index * 50) + 'ms';
        button.title = link.title || platform.name;
        button.setAttribute('aria-label', link.title || platform.name);

        const icon = document.createElement('span');
        icon.className = 'link-button__icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = platform.icon;

        const faviconUrl = getFaviconUrl(link.url);
        if (faviconUrl) {
            const img = document.createElement('img');
            img.src = faviconUrl;
            img.width = 20;
            img.height = 20;
            img.alt = '';
            img.style.borderRadius = '4px';
            img.onload = () => { icon.textContent = ''; icon.appendChild(img); };
        }

        const label = document.createElement('span');
        label.className = 'link-button__label';
        label.textContent = link.title || platform.name;

        const marker = document.createElement('span');
        marker.className = 'link-button__marker';
        marker.setAttribute('aria-hidden', 'true');
        marker.textContent = '...';

        button.append(icon, label, marker);
        linksContainer.appendChild(button);
    });
}


function showEmptyPage() {
    titleElement.textContent = 'Nenhuma pagina criada';
    subtitleElement.textContent = 'Crie sua pagina no Linktree Creator.';

    linksContainer.innerHTML = '';

    const button = document.createElement('a');
    button.className = 'link-button';
    button.href = 'creator.html';
    button.textContent = 'Criar minha pagina';

    linksContainer.appendChild(button);
}


function showError() {
    titleElement.textContent = 'Erro ao carregar pagina';
    subtitleElement.textContent = 'Os dados salvos nao puderam ser carregados.';
}


loadPage();