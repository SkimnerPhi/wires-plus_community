import { GameSystemWithFilter } from "shapez/game/game_system_with_filter";
import { isTruthyItem } from "shapez/game/items/boolean_item";
import { enumPassthruTransistorVariants, PassthruTransistorComponent } from "../components/passthru_transistor";

export class PassthruTransistorSystem extends GameSystemWithFilter {
    constructor(root) {
        super(root, [PassthruTransistorComponent]);
    }

    update() {
        for (const entity of this.allEntities) {
            const passthruComp = entity.components.PassthruTransistor;
            const slotComp = entity.components.WiredPins;

            const out = slotComp.slots[3];

            if (slotComp.slots[0].linkedNetwork?.valueConflict
                || slotComp.slots[1].linkedNetwork?.valueConflict
                || slotComp.slots[2].linkedNetwork?.valueConflict
            ) {
                out.value = null;
                continue;
            }

            const bottomValue = slotComp.slots[0].linkedNetwork?.currentValue;
            const leftValue = slotComp.slots[1].linkedNetwork?.currentValue;
            const rightValue = slotComp.slots[2].linkedNetwork?.currentValue;

            let bothValue = null;
            if (leftValue && rightValue) {
                if (leftValue === rightValue) {
                    bothValue = leftValue;
                }
            } else {
                bothValue = leftValue || rightValue;
            }

            switch (passthruComp.type) {
                case enumPassthruTransistorVariants.parallel: {
                    out.value = isTruthyItem(bothValue)
                        ? bottomValue
                        : null;
                    break;
                }
                case enumPassthruTransistorVariants.selector: {
                    out.value = isTruthyItem(bottomValue)
                        ? bothValue
                        : null;
                    break;
                }
            }
        }
    }
}