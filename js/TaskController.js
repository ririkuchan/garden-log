export default class TaskController {
    static getDueTasks(garden) {
        const today = new Date();
        return garden.filter(plant => {
            // 仮に最後のみずやりが3日前だったとするロジック（実際は保存データを使う）
            const lastWatered = new Date(plant.last_watered || plant.added_date || today);
            const nextWateringDate = new Date(lastWatered);
            nextWateringDate.setDate(lastWatered.getDate() + plant.water_interval_days);
            
            return today >= nextWateringDate;
        });
    }
}