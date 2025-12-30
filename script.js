document.addEventListener('DOMContentLoaded', () => {
    // Theme detection
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'theme-dark' : 'theme-light';
    document.body.classList.add(theme);

    // Translation
    const setLanguage = async (lang) => {
        try {
            const response = await fetch(`locales/${lang}.json`);
            if (!response.ok) {
                console.warn(`Could not load translation file for language: ${lang}. Falling back to English.`);
                await setLanguage('en');
                return;
            }
            const translations = await response.json();
            document.querySelectorAll('[data-translate]').forEach(element => {
                const key = element.getAttribute('data-translate');
                if (translations[key]) {
                    if (element.tagName === 'TITLE') {
                        document.title = translations[key];
                    } else {
                        element.textContent = translations[key];
                    }
                }
            });
        } catch (error) {
            console.error('Error loading or applying translations:', error);
            // Fallback to English in case of any error
            if (lang !== 'en') {
                await setLanguage('en');
            }
        }
    };

    const userLang = navigator.language.split('-')[0];
    const supportedLangs = ['en', 'fr', 'zh', 'es', 'de', 'ja', 'ru', 'pt', 'ar'];
    const langToLoad = supportedLangs.includes(userLang) ? userLang : 'en';
    
    setLanguage(langToLoad);
});
