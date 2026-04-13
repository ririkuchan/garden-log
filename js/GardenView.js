export default class GardenView {
    constructor(parentElementId) {
        this.parentElement = document.getElementById(parentElementId);
    }

    renderPlantList(garden) {
        this.parentElement.innerHTML = ''; 
        if (garden.length === 0) {
            this.parentElement.innerHTML = '<p>Your garden is empty. Add your first plant below!</p>';
            return;
        }
        garden.forEach(plant => {
            const card = this.createPlantCard(plant);
            this.parentElement.appendChild(card);
        });
    }

    createPlantCard(plant) {
        const card = document.createElement('div');
        card.classList.add('plant-card');
        
        // 1. 予備（fallback）用の画像URLを定義
        const fallbackUrl = `https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=400`;

        // 2. JSONにimage_urlがあればそれを使い、なければ予備画像を使う
        const mainImageUrl = plant.image_url || fallbackUrl;

        card.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${mainImageUrl}" 
                     alt="${plant.image_alt || plant.name}" 
                     class="plant-card-img" 
                     onerror="this.onerror=null;this.src='${fallbackUrl}';" 
                     style="width:100%; height:150px; object-fit:cover; border-radius:8px;">
            </div>
            <div class="card-content">
                <h3>${plant.nickname || plant.name}</h3>
                <p class="species-tag">${plant.name}</p>
                
                <div class="journal-preview">
                    ${this.renderJournalEntries(plant.journal || [])}
                </div>

                <div class="card-btns">
                    <button class="log-btn" data-id="${plant.id}">+ Log Growth</button>
                </div>
            </div>
        `;
        return card;
    }

    renderJournalEntries(entries) {
        if (entries.length === 0) return '<p class="no-data">No logs yet.</p>';
        // 最新の3件だけ表示
        return entries.slice(-3).reverse().map(entry => `
            <div class="journal-entry">
                <small>${entry.date}</small>
                <p>${entry.text}</p>
                ${entry.photo ? `<img src="${entry.photo}" class="journal-thumb" style="width:100%; margin-top:5px; border-radius:4px;">` : ''}
            </div>
        `).join('');
    }
}