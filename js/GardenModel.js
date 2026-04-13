export default class GardenModel {
  constructor() {
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
    localStorage.setItem('myGarden', JSON.stringify(this.garden));
  }

  addJournalEntry(plantId, entryText) {
    const plant = this.garden.find(p => p.id === plantId);
    if (plant) {
        if (!plant.journal) plant.journal = [];
        plant.journal.push({
            date: new Date().toLocaleDateString(),
            text: entryText
        });
        localStorage.setItem('myGarden', JSON.stringify(this.garden));
    }
  }
}