import { Component } from "shapez/game/component";
import { typeItemSingleton } from "shapez/game/item_resolver";
import { types } from "shapez/savegame/serialization";

export class AdjustableDelayComponent extends Component {
    static getId() {
        return "AdjustableDelay";
    }

    static getSchema() {
        return {
            signals: types.array(
                types.nullable(typeItemSingleton)
            )
        };
    }

    constructor(delay = 1) {
        super();

        this.currentIdx = 0;
        this.signals = new Array(delay - 1);
    }

    get delay() {
        return this.signals.length + 1;
    }
    set delay(delay) {
        const newArray = new Array(delay - 1);
        const limit = Math.min(newArray.length, this.signals.length);
        
        for (let idx = 0; idx < limit; ++idx) {
            const oldIdx = (idx + this.currentIdx) % this.signals.length;
            newArray[idx] = this.signals[oldIdx];
        }

        this.signals = newArray;
        this.currentIdx = 0;
    }

    copyAdditionalStateTo(otherComponent) {
        otherComponent.delay = this.delay;
    }
}