const wrapper = document.getElementById('links-wrapper');
const addBtn = document.getElementById('add-link');
const createBtn = document.getElementById('create');

const mainCard = document.querySelector('main');

const titleInput = document.getElementById('title');
const subtitleInput = document.getElementById('subtitle');

const backgroundType = document.getElementById('backgroundType');
const backgroundColor = document.getElementById('backgroundColor');
const backgroundImage = document.getElementById('backgroundImage');

const colorBackground = document.getElementById('color-background');
const imageBackground = document.getElementById('image-background');

const pageStorageKey = 'linktree-page';
const themeStorageKey = 'linktree-theme';

let count = 1;
const max = 10;

const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');


function readSavedTheme() {
    try {
        const savedTheme = window.localStorage.getItem(themeStorageKey);
        return savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : null;
    } catch {
        return null;
    }
}


function saveTheme(theme) {
    try {
        window.localStorage.setItem(themeStorageKey, theme);
    } catch {
        console.warn('Não foi possível salvar o tema.');
    }
}


function createThemeToggle() {
    if (!mainCard) return null;

    const button = document.createElement('button');
    const icon = document.createElement('span');
    const label = document.createElement('span');

    button.type = 'button';
    button.className = 'theme-toggle-creator';
    button.setAttribute('aria-pressed', 'false');
    icon.className = 'theme-toggle__icon';
    icon.setAttribute('aria-hidden', 'true');
    label.className = 'visually-hidden';

    button.append(icon, label);
    mainCard.prepend(button);

    return { button, icon, label };
}


function setTheme(theme, controls) {
    const isDarkTheme = theme === 'dark';
    const actionLabel = isDarkTheme ? 'Ativar modo claro' : 'Ativar modo escuro';

    document.documentElement.dataset.theme = theme;

    if (controls) {
        controls.button.setAttribute('aria-pressed', String(isDarkTheme));
        controls.button.setAttribute('aria-label', actionLabel);
        controls.button.title = actionLabel;
        controls.icon.textContent = isDarkTheme ? '☀' : '☾';
        controls.label.textContent = actionLabel;
    }
}


const controls = createThemeToggle();

const initialTheme = readSavedTheme() ?? (prefersDarkTheme.matches ? 'dark' : 'light');

setTheme(initialTheme, controls);


if (controls) {
    controls.button.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme, controls);
        saveTheme(nextTheme);
    });
}


function updateBackgroundOptions() {
    if (backgroundType.value === 'color') {
        colorBackground.hidden = false;
        imageBackground.hidden = true;
    } else {
        colorBackground.hidden = true;
        imageBackground.hidden = false;
    }
}


backgroundType.addEventListener('change', updateBackgroundOptions);

updateBackgroundOptions();


backgroundColor.addEventListener('input', () => {
    if (backgroundType.value !== 'color') return;

    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = backgroundColor.value;
});


backgroundImage.addEventListener('change', () => {
    const file = backgroundImage.files[0];

    if (!file) return;

    // Limite de 2 MB
    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
        alert('A imagem deve ter no máximo 2 MB.');
        backgroundImage.value = '';
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        document.body.style.backgroundColor = 'transparent';
        document.body.style.backgroundImage = `url("${reader.result}")`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    };

    reader.readAsDataURL(file);
});


function addLink(value = '') {
    if (count >= max) {
        alert(`Você pode adicionar no máximo ${max} links.`);
        return;
    }

    count++;

    const div = document.createElement('div');
    div.className = 'link-row';
    div.innerHTML = `
        <input
            type="url"
            name="links[]"
            placeholder="https://exemplo.com"
            value="${value}"
        >
        <button
            type="button"
            class="remove-link"
            title="Remover link"
            aria-label="Remover link"
        >
            ✕
        </button>
    `;

    const removeBtn = div.querySelector('.remove-link');

    removeBtn.addEventListener('click', () => {
        div.remove();
        count--;
    });

    wrapper.appendChild(div);
}


if (addBtn && wrapper) {
    addBtn.addEventListener('click', () => {
        addLink();
    });
}


function getLinks() {
    const inputs = wrapper.querySelectorAll('input[type="url"]');
    const links = [];

    inputs.forEach(input => {
        const url = input.value.trim();
        if (url !== '') {
            links.push({ url });
        }
    });

    return links;
}


function getPageData() {
    return {
        title: titleInput.value.trim(),
        subtitle: subtitleInput.value.trim(),
        background: {
            type: backgroundType.value,
            value: backgroundType.value === 'color' ? backgroundColor.value : null,
        },
        links: getLinks(),
    };
}


function savePage() {
    const page = getPageData();

    // Salvar a imagem em base64
    if (backgroundType.value === 'image' && backgroundImage.files.length > 0) {
        const file = backgroundImage.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            page.background.value = reader.result;

            try {
                localStorage.setItem(pageStorageKey, JSON.stringify(page));
                alert('Página salva com sucesso!');
                console.log('Página salva:', page);
            } catch (error) {
                console.error(error);
                alert('Não foi possível salvar a página. A imagem pode ser muito grande.');
            }
        };

        reader.readAsDataURL(file);
        return;
    }

    try {
        localStorage.setItem(pageStorageKey, JSON.stringify(page));
        alert('Página salva com sucesso!');
        console.log('Página salva:', page);
    } catch (error) {
        console.error(error);
        alert('Não foi possível salvar a página.');
    }
}


function loadPage() {
    try {
        const savedPage = localStorage.getItem(pageStorageKey);

        if (!savedPage) return;

        const page = JSON.parse(savedPage);

        if (page.title) {
            titleInput.value = page.title;
        }

        if (page.subtitle) {
            subtitleInput.value = page.subtitle;
        }

        if (page.background) {
            backgroundType.value = page.background.type;
            updateBackgroundOptions();

            if (page.background.type === 'color') {
                backgroundColor.value = page.background.value;
                document.body.style.backgroundImage = 'none';
                document.body.style.backgroundColor = page.background.value;
            }

            if (page.background.type === 'image' && page.background.value) {
                document.body.style.backgroundColor = 'transparent';
                document.body.style.backgroundImage = `url("${page.background.value}")`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundAttachment = 'fixed';
            }
        }

        // Links
        if (Array.isArray(page.links) && page.links.length > 0) {
            // Remove o primeiro input padrão
            wrapper.innerHTML = '';
            count = 0;

            page.links.forEach(link => {
                addLink(link.url);
            });
        }

        console.log('Página carregada:', page);
    } catch (error) {
        console.error('Erro ao carregar página:', error);
    }
}


if (createBtn) {
    createBtn.addEventListener('click', () => {
        savePage();
    });
}

loadPage();