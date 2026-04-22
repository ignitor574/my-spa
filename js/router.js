let pageUrls = {
    about: '/index.html?about',
    contact: '/index.html?contact',
    gallery: '/index.html?gallery'
};

function OnStartUp() {
    popStateHandler();
}
OnStartUp();

// --- Event Listenery dla Nawigacji ---

document.querySelector('#about-link').addEventListener('click', () => {
    history.pushState({ page: 'about' }, "About", "?about");
    RenderAboutPage();
});

document.querySelector('#contact-link').addEventListener('click', () => {
    history.pushState({ page: 'contact' }, "Contact", "?contact");
    RenderContactPage();
});

document.querySelector('#gallery-link').addEventListener('click', () => {
    history.pushState({ page: 'gallery' }, "Gallery", "?gallery");
    RenderGalleryPage();
});

// --- Funkcje Renderujące ---

function RenderAboutPage() {
    document.querySelector('main').innerHTML = `<h1>About Me</h1><p>Treść strony o mnie...</p>`;
}

function RenderContactPage() {
    document.querySelector('main').innerHTML = `<h1>Contact</h1><form>...</form>`;
}

function RenderGalleryPage() {
    const main = document.querySelector('main');
    
    main.innerHTML = `
        <h1 class="title">Moja Galeria</h1>
        <div id="gallery-grid" class="gallery-grid"></div>
        
        <div id="modal" class="modal">
            <span class="close-modal">&times;</span>
            <img class="modal-content" id="modal-img">
        </div>
    `;

    const imageUrls = [
        'foto1.jpg',
        'foto2.jpg',
        'foto3.jpg',
        'foto4.jpg',
        'foto5.jpg',
        'foto6.jpg',
        'foto7.jpg',
        'foto8.jpg',
        'foto9.jpg'
    ];
    
    const grid = document.getElementById('gallery-grid');
    
    imageUrls.forEach(url => {
        const imgPlaceholder = document.createElement('div');
        imgPlaceholder.className = 'img-placeholder';
        imgPlaceholder.dataset.src = url; 
        grid.appendChild(imgPlaceholder);
    });

    setupLazyLoading();
    setupModal();  
}

function setupLazyLoading() {
    const placeholders = document.querySelectorAll('.img-placeholder');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                const src = container.dataset.src;

                // 1. Asynchronous Fetch
                fetch(src)
                    .then(response => {
                        if (!response.ok) throw new Error("Network response was not ok");
                        return response.blob();
                    })
                    .then(blob => {
                        const objectURL = URL.createObjectURL(blob);
                        const img = document.createElement('img');
                        img.src = objectURL;
                        img.className = 'gallery-thumb';
                        
                        // Clean up: avoid memory leaks by revoking the URL when the image loads
                        img.onload = () => {
                            container.classList.add('loaded');
                            // URL.revokeObjectURL(objectURL); // Optional: only if not used in modal
                        };

                        img.onclick = () => openModal(objectURL);
                        container.appendChild(img);
                    })
                    .catch(error => console.error("Error loading blob:", error));

                observer.unobserve(container); 
            }
        });
    }, { threshold: 0.1 });

    placeholders.forEach(p => observer.observe(p));
}

// --- Logika Modala ---

function setupModal() {
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-modal');

    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    };
}

function openModal(src) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    modal.style.display = "flex";
    modalImg.src = src;
}

// --- Obsługa Historii Przeglądarki ---

function popStateHandler() {
    let loc = window.location.search;
    if (loc === '?contact') RenderContactPage();
    else if (loc === '?about') RenderAboutPage();
    else if (loc === '?gallery') RenderGalleryPage();
}

window.onpopstate = popStateHandler;

document.querySelector('#theme-toggle').addEventListener('click', () => {
    // This toggles a "dark-mode" class on the body tag
    document.body.classList.toggle('dark-mode');
});