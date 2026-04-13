import GardenModel from './GardenModel.js';
import GardenView from './GardenView.js';

const model = new GardenModel();
const view = new GardenView('plant-grid');

async function init() {
    const encyclopedia = await model.fetchPlantEncyclopedia();
    
    // セレクトボックスの生成
    const select = document.getElementById('plant-species-select');
    if (select) {
        encyclopedia.forEach(species => {
            const option = document.createElement('option');
            option.value = species.id;
            option.textContent = species.name;
            select.appendChild(option);
        });
    }

    // 初期表示
    refreshUI();
    setupEventListeners(encyclopedia);
}

function refreshUI() {
    view.renderPlantList(model.garden);
    updateTasks(model.garden);
}

function updateTasks(plants) {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;
    
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
    // 1. 右上の "+ Add Plant" ボタン
    const addPlantBtn = document.getElementById('add-plant-btn');
    if (addPlantBtn) {
        addPlantBtn.onclick = (e) => {
            e.preventDefault();
            const section = document.getElementById('add-plant-section');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        };
    }

    // 2. 植物追加フォーム
    const addPlantForm = document.getElementById('add-plant-form');
    if (addPlantForm) {
        addPlantForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nickname = document.getElementById('plant-nickname').value;
            const speciesId = document.getElementById('plant-species-select').value;
            const speciesData = encyclopedia.find(s => s.id === speciesId);
            
            const newPlant = { 
                ...speciesData, 
                id: `${speciesData.id}-${Date.now()}`, 
                nickname, 
                added_date: new Date().toLocaleDateString('ja-JP'),
                journal: [] 
            };

            model.addPlant(newPlant);
            refreshUI(); 
            e.target.reset();
        });
    }

    // 3. カテゴリフィルター
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            const filtered = type === 'all' ? model.garden : model.garden.filter(p => p.type === type);
            view.renderPlantList(filtered);
        });
    });

    // 4. 日記モーダルを開く
    const plantGrid = document.getElementById('plant-grid');
    if (plantGrid) {
        plantGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('log-btn')) {
                const id = e.target.dataset.id;
                document.getElementById('current-plant-id').value = id;
                
                // 【追加】今日の日付をデフォルトでセット
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('journal-date').value = today;

                document.getElementById('journal-modal').style.display = 'flex';
            }
        });
    }

    // 5. モーダルを閉じる
    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('journal-modal').style.display = 'none';
        });
    }

    // 6. 日記の保存
    const saveJournalBtn = document.getElementById('save-journal-btn');
    if (saveJournalBtn) {
        saveJournalBtn.addEventListener('click', () => {
            const id = document.getElementById('current-plant-id').value;
            const text = document.getElementById('journal-text').value;
            const photo = document.getElementById('journal-photo-url').value;
            
            // 【修正】入力された日付を取得
            const selectedDate = document.getElementById('journal-date').value;

            if (text && selectedDate) {
                // 表示用に yyyy/mm/dd 形式に整形
                const dateDisplay = selectedDate.replace(/-/g, '/');

                model.addJournalEntry(id, {
                    date: dateDisplay,
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
}

init();