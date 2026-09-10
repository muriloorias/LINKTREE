const profile = document.querySelector('.User');
const storageKey = 'linktree-theme';
const socialUrls = {
  youtube: 'https://www.youtube.com/',
  telegram: 'https://t.me/',
  x: 'https://x.com/',
  instagram: 'https://www.instagram.com/',
  whatsap: 'https://wa.me/',
};

function readSavedTheme() {
  try {
    const savedTheme = window.localStorage.getItem(storageKey);
    return savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : null;
  } catch {
    return null;
  }
}

function saveTheme(theme) {
  try {
    window.localStorage.setItem(storageKey, theme);
  } catch {
   
  }
}

function createThemeToggle() {
  const button = document.createElement('button');
  const icon = document.createElement('span');
  const label = document.createElement('span');

  button.type = 'button';
  button.className = 'theme-toggle';
  button.setAttribute('aria-pressed', 'false');
  icon.className = 'theme-toggle__icon';
  icon.setAttribute('aria-hidden', 'true');
  label.className = 'visually-hidden';

  button.append(icon, label);
  profile.prepend(button);

  return { button, icon, label };
}

function setTheme(theme, controls) {
  const isDarkTheme = theme === 'dark';
  const actionLabel = isDarkTheme ? 'Ativar modo claro' : 'Ativar modo escuro';

  document.documentElement.dataset.theme = theme;
  controls.button.setAttribute('aria-pressed', String(isDarkTheme));
  controls.button.setAttribute('aria-label', actionLabel);
  controls.button.title = actionLabel;
  controls.icon.textContent = isDarkTheme ? '☀' : '☾';
  controls.label.textContent = actionLabel;
}

function configureSocialButtons() {
  Object.entries(socialUrls).forEach(([id, url]) => {
    const button = document.getElementById(id);
    if (!button) return;

    button.type = 'button';
    button.setAttribute('aria-label', `Abrir ${button.textContent.trim()} em uma nova aba`);
    button.title = `Abrir ${button.textContent.trim()}`;
    button.addEventListener('click', () => {
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });
}

if (profile) {
  const viewport = document.querySelector('meta[name="viewport"]');
  const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const controls = createThemeToggle();
  const initialTheme = readSavedTheme() ?? (prefersDarkTheme.matches ? 'dark' : 'light');

  if (viewport) {
    viewport.content = 'width=device-width, initial-scale=1.0';
  }

  setTheme(initialTheme, controls);
  configureSocialButtons();

  controls.button.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme, controls);
    saveTheme(nextTheme);
  });
}
