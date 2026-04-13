import GardenModel from './GardenModel.js';
import GardenView from './GardenView.js';

const model = new GardenModel();
const view = new GardenView('plant-grid');

async function init() {
    const encyclopedia = await model.fetchPlantEncyclopedia();
    
    // セレクトボックスの生成
    const select = document.getElementById('plant-species-select');
    encyclopedia.forEach(species => {
        const option = document.createElement('option');
        option.value = species.id;
        option.textContent = species.name;
        select.appendChild(option);
    });

    view.renderPlantList(model.garden);
    setupEventListeners(encyclopedia);
}

function setupEventListeners(encyclopedia) {
    // 1. 植物追加フォーム
    document.getElementById('add-plant-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const nickname = document.getElementById('plant-nickname').value;
        const speciesId = document.getElementById('plant-species-select').value;
        const speciesData = encyclopedia.find(s => s.id === speciesId);
        
        model.addPlant({ ...speciesData, nickname, added_date: new Date().toISOString(), journal: [] });
        view.renderPlantList(model.garden);
        e.target.reset();
    });

    // 2. フィルター
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            const filtered = type === 'all' ? model.garden : model.garden.filter(p => p.type === type);
            view.renderPlantList(filtered);
        });
    });

    // 3. 日記モーダルの制御（イベント委譲）
    document.getElementById('plant-grid').addEventListener('click', (e) => {
        if (e.target.classList.contains('log-btn')) {
            const id = e.target.dataset.id;
            document.getElementById('current-plant-id').value = id;
            document.getElementById('journal-modal').style.display = 'block';
        }
    });

    // 4. 日記の保存
    document.getElementById('save-journal-btn').addEventListener('click', () => {
        const id = document.getElementById('current-plant-id').value;
        const text = document.getElementById('journal-text').value;
        const photo = document.getElementById('journal-photo-url').value;

        if (text) {
            model.addJournalEntry(id, {
                date: new Date().toLocaleDateString(),
                text: text,
                photo: photo
            });
            view.renderPlantList(model.garden);
            document.getElementById('journal-modal').style.display = 'none';
            document.getElementById('journal-text').value = '';
            document.getElementById('journal-photo-url').value = '';
        }
    });
}

init();