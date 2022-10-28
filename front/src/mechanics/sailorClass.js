import React from 'react';

class SailorClass extends React.Component {
    constructor(props) {
        super();

        this.playerId = ""
        this.name = ""
        this.skills = {
            gunnery: this.skillFunc(),
            seamanship: this.skillFunc(),
            swordmanship: this.skillFunc(),
            navigation: this.skillFunc(),
            marksmanship: this.skillFunc()
        }
    }

        skillFunc() {
            // Base expertise is to later be set to the individual
            //skills of the sailors of the ship and refactored:
            //ie: average or median
            let baseExpertise = Math.floor((Math.random() * 99) + 1);

            let skill = Math.floor((Math.random() * baseExpertise) + 1);
        
            return skill;
        }
}

export default SailorClass;