const workListElement = document.getElementById('ul-works');
const elementsToTranslate = [ // IDs of elements needing translation
    'page-title', 'main-heading', 'lang-bn', 'lang-hi', 'lang-en',
    'nav-about', 'nav-early-life', 'nav-career', 'nav-philosophy', 'nav-works', 'nav-gallery', 'nav-legacy',
    'quote', 'h-about', 'p-about-1', 'p-about-2',
    'h-early-life', 'p-early-life-1', 'p-early-life-1b', 'p-early-life-2', 'p-early-life-2b', 'p-early-life-3',
    'h-career', 'p-career-intro', 'li-career-1', 'li-career-2', 'li-career-3', 'li-career-4', 'li-career-5', 'li-career-6', 'li-career-7', 'li-career-8',
    'h-philosophy', 'p-philosophy-1', 'p-philosophy-2', 'p-philosophy-3',
    'h-works', 'p-works-intro', /* Work list handled separately */ 'p-works-note',
    'h-gallery', 'h-legacy', 'p-legacy-1', 'p-legacy-2', 'p-legacy-3', 'p-legacy-4',
    'h-family-photo',
    'footer-remembrance', 'footer-source'
];

function loadTranslations(lang) {
    if (!translations[lang]) {
        console.error("Language not supported:", lang);
        return;
    }

    // Update standard elements
    elementsToTranslate.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            // Handle <title> tag differently
            if (id === 'page-title') {
                document.title = translations[lang][id];
            } else { // Use innerHTML for elements that might contain <strong> or other tags
                element.innerHTML = translations[lang][id];
            }
        } else {
            console.warn(`Element with ID '${id}' not found.`);
        }
    });

    // Update Works list specifically
    const worksListKey = `works-list-${lang}`;
    if (translations[lang][worksListKey] && workListElement) {
        workListElement.innerHTML = ''; // Clear existing list
        translations[lang][worksListKey].forEach(workItem => {
            const li = document.createElement('li');
            li.innerHTML = workItem; // Use innerHTML in case there's formatting like (अनु.)
            workListElement.appendChild(li);
        });
    } else if (workListElement) {
        console.warn(`Works list for language '${lang}' not found or element 'ul-works' does not exist.`);
        // Fallback: Use Bengali list if target lang list is missing but bn exists
        const bnWorksListKey = `works-list-bn`;
        if (translations["bn"][bnWorksListKey]) {
            workListElement.innerHTML = ''; // Clear existing list
            translations["bn"][bnWorksListKey].forEach(workItem => {
                const li = document.createElement('li');
                li.innerHTML = workItem;
                workListElement.appendChild(li);
            });
            console.warn(`Falling back to Bengali works list for language '${lang}'.`);
        } else {
            workListElement.innerHTML = ''; // Clear list if specific lang list missing
        }
    }


    // Update HTML lang attribute
    document.documentElement.lang = lang;
    document.body.lang = lang; // Add lang to body too for simpler CSS font rules

    // Update active language button style
    document.querySelectorAll('.lang-nav a').forEach(a => a.classList.remove('active'));
    const activeLink = document.querySelector(`.lang-nav a[data-lang="${lang}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Store preference
    localStorage.setItem('preferredLanguage', lang);
}

// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️'; // Sun icon for switching to light
        darkModeToggle.title = 'Switch to light mode';
    } else {
        body.classList.remove('dark-mode');
        darkModeToggle.textContent = '🌓'; // Moon icon for switching to dark
        darkModeToggle.title = 'Switch to dark mode';
    }
    localStorage.setItem('preferredTheme', theme);
}

darkModeToggle.addEventListener('click', () => {
    const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Language Switching
document.querySelectorAll('.lang-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent page jump
        const selectedLang = link.getAttribute('data-lang');
        loadTranslations(selectedLang);
    });
});

// Initial Load Logic
document.addEventListener('DOMContentLoaded', () => {
    // Determine initial language (localStorage > default 'bn')
    const savedLang = localStorage.getItem('preferredLanguage');
    const initialLang = (savedLang && translations[savedLang]) ? savedLang : 'bn'; // Default to Bengali
    loadTranslations(initialLang);


    // Determine initial theme (localStorage > prefers-color-scheme > default 'light')
    const savedTheme = localStorage.getItem('preferredTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let initialTheme = 'light'; // Default light

    if (savedTheme) {
        initialTheme = savedTheme;
    } else if (prefersDark) {
        initialTheme = 'dark';
    }
    applyTheme(initialTheme); // Apply determined theme
});
