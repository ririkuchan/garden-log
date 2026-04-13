export default class GardenView {
    constructor(parentElementId) {
        this.parentElement = document.getElementById(parentElementId);
    }

    renderPlantList(garden) {
        this.parentElement.innerHTML = ''; // 一旦クリア
        garden.forEach(plant => {
            const card = this.createPlantCard(plant);
            this.parentElement.appendChild(card);
        });
    }

    createPlantCard(plant) {
        const card = document.createElement('div');
        card.classList.add('plant-card');
        
        // Unsplashから植物名で画像を検索するURL
        const imageUrl = `https://source.unsplash.com/featured/?${plant.name},garden`;

        card.innerHTML = `
            <img src="${imageUrl}" alt="${plant.image_alt}" style="width:100%; border-radius:8px;">
            <h3>${plant.name}</h3>
            <p><strong>Type:</strong> ${plant.type}</p>
            <p><strong>Next Water:</strong> in ${plant.water_interval_days} days</p>
            <div class="card-btns">
                <button class="log-btn" data-id="${plant.id}">Journal</button>
                <button class="edit-btn">Edit</button>
            </div>
        `;
        return card;
    }
}