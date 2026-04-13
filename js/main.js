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

    // 初期表示
    refreshUI();
    setupEventListeners(encyclopedia);
}

// 画面表示を最新の状態にする関数
function refreshUI() {
    view.renderPlantList(model.garden);
    updateTasks(model.garden);
}

// タスクリスト（水やり予定など）を生成する
function updateTasks(plants) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    if (plants.length === 0) {
        taskList.innerHTML = '<li>No plants yet. Add one to see your tasks!</li>';
        return;
    }

    plants.forEach(plant => {
        const li = document.createElement('li');
        const interval = plant.water_interval_days || 'Check soil';
        li.innerHTML = `<strong>${plant.nickname || plant.name}</strong>: Water every ${interval} days.`;
        taskList.appendChild(li);
    });
}

function setupEventListeners(encyclopedia) {
    // 【追加】右上の +Add Plant ボタンをクリックした時にフォームへスクロール
    // クラス名が .add-plant-header-btn の場合（HTMLを確認してください）
    const headerAddBtn = document.querySelector('.add-plant-header-btn'); 
    headerAddBtn?.addEventListener('click', () => {
        document.getElementById('add-plant-form').scrollIntoView({ behavior: 'smooth' });
    });

    // 1. 植物追加フォーム
    document.getElementById('add-plant-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const nickname = document.getElementById('plant-nickname').value;
        const speciesId = document.getElementById('plant-species-select').value;
        const speciesData = encyclopedia.find(s => s.id === speciesId);
        
        const newPlant = { 
            ...speciesData, 
            id: `${speciesData.id}-${Date.now()}`, 
            nickname, 
            added_date: new Date().toISOString(), 
            journal: [] 
        };

        model.addPlant(newPlant);
        refreshUI(); 
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

    // 3. 日記モーダルの制御（開く）
    document.getElementById('plant-grid').addEventListener('click', (e) => {
        if (e.target.classList.contains('log-btn')) {
            const id = e.target.dataset.id;
            document.getElementById('current-plant-id').value = id;
            document.getElementById('journal-modal').style.display = 'block';
        }
    });

    // 【修正】モーダルを閉じる処理（×ボタンとキャンセルボタン両方に対応）
    const closeButtons = document.querySelectorAll('#close-modal-btn, .cancel-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('journal-modal').style.display = 'none';
        });
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
            refreshUI(); 
            document.getElementById('journal-modal').style.display = 'none';
            document.getElementById('journal-text').value = '';
            document.getElementById('journal-photo-url').value = '';
        }
    });
}

init();