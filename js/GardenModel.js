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
}