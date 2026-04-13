export default class GardenModel {
    constructor() {
        // localStorageからデータを読み込み。なければ空配列。
        this.garden = JSON.parse(localStorage.getItem('myGarden')) || [];
    }

    // 外部JSON（植物図鑑）を取得
    async fetchPlantEncyclopedia() {
        const response = await fetch('./data/plants.json');
        return await response.json();
    }

    // 自分の庭に植物を追加して保存
    addPlant(plant) {
        this.garden.push(plant);
        this.save();
    }

    // 日記の追加
    addJournalEntry(plantId, entryData) {
        const plant = this.garden.find(p => p.id === plantId);
        if (plant) {
            if (!plant.journal) plant.journal = [];
            
            // entryDataにはtextやphotoが含まれる
            plant.journal.push({
                date: entryData.date || new Date().toLocaleDateString(),
                text: entryData.text,
                photo: entryData.photo || ""
            });
            this.save();
        }
    }

    // 保存処理の共通化
    save() {
        localStorage.setItem('myGarden', JSON.stringify(this.garden));
    }
}