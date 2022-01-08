

class SailorClass {
    constructor(id) {

        this.playerId = id,
        this.name = "",
        this.skills = {
            gunnery: this.skillFunc(),
            seamanship: this.skillFunc(),
            swordmanship: this.skillFunc(),
            navigation: this.skillFunc(),
            marksmanship: this.skillFunc(),
            
        }
    }

        skillFunc() {
            let baseExpertise = Math.floor((Math.random() * 99) + 1);

            let skill = Math.floor((Math.random() * baseExpertise) + 1);
        
            return `${skill}`;
        }
}

module.exports = SailorClass;