import GardenModel from './GardenModel.js';
import GardenView from './GardenView.js';

const model = new GardenModel();
const view = new GardenView('plant-grid');

async function init() {
    // 1. 初回起動時、もしLocalStorageが空ならJSONから初期データを読み込む（テスト用）
    if (model.garden.length === 0) {
        const initialData = await model.fetchPlantEncyclopedia();
        // 最初の3つくらいを自分の庭に追加してみる
        initialData.slice(0, 3).forEach(plant => model.addPlant(plant));
    }

    // 2. 描画
    view.renderPlantList(model.garden);

    // 3. フィルターボタンのイベント設定
    setupFilters();
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