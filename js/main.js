import GardenModel from './GardenModel.js';
import GardenView from './GardenView.js';

const model = new GardenModel();
const view = new GardenView('plant-grid');

async function init() {
    // 1. 図鑑（JSON）を読み込んでセレクトボックスを埋める
    const encyclopedia = await model.fetchPlantEncyclopedia();
    const select = document.getElementById('plant-species-select');
    
    encyclopedia.forEach(species => {
        const option = document.createElement('option');
        option.value = species.id;
        option.textContent = species.name;
        select.appendChild(option);
    });

    // 2. 初回起動時、もし庭が空ならテストデータを表示
    if (model.garden.length === 0) {
        encyclopedia.slice(0, 3).forEach(plant => model.addPlant(plant));
    }

    // 3. 描画
    view.renderPlantList(model.garden);
    setupFilters();
    setupForm(encyclopedia);
}

// 植物を追加するフォームの処理
function setupForm(encyclopedia) {
    const form = document.getElementById('add-plant-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nickname = document.getElementById('plant-nickname').value;
        const speciesId = document.getElementById('plant-species-select').value;
        const speciesData = encyclopedia.find(s => s.id === speciesId);
        
        const newPlant = { ...speciesData, nickname: nickname, added_date: new Date().toISOString() };
        model.addPlant(newPlant);
        view.renderPlantList(model.garden); // 再描画
        form.reset();
    });
}

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            const filtered = type === 'all' 
                ? model.garden 
                : model.garden.filter(p => p.type === type);
            view.renderPlantList(filtered);
        });
    });
}

init();