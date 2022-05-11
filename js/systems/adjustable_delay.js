import { GameSystemWithFilter } from "shapez/game/game_system_with_filter";
import { AdjustableDelayComponent } from "../components/adjustable_delay";

export class AdjustableDelaySystem extends GameSystemWithFilter {
    constructor(root) {
        super(root, [AdjustableDelayComponent]);

        this.root.signals.entityManuallyPlaced.add(entity => {
            const editorHud = this.root.hud.parts.adjustableDelayEdit;
            if (editorHud) {
                editorHud.editDelayText(entity, { deleteOnCancel: true });
            }
        });
    }

    update() {
        for (const entity of this.allEntities) {
            const delayComp = entity.components.AdjustableDelay;
            const slotComp = entity.components.WiredPins;

            if (delayComp.delay === 1) {
                const inputNetwork = slotComp.slots[0].linkedNetwork;
                let inputValue = null;
                if (inputNetwork && !inputNetwork.valueConflict) {
                    inputValue = inputNetwork.currentValue;
                }

                slotComp.slots[1].value = inputValue;
            } else {
                slotComp.slots[1].value = delayComp.signals[delayComp.currentIdx];

                const inputNetwork = slotComp.slots[0].linkedNetwork;
                let inputValue = null;
                if (inputNetwork && !inputNetwork.valueConflict) {
                    inputValue = inputNetwork.currentValue;
                }
                delayComp.signals[delayComp.currentIdx] = inputValue;

                delayComp.currentIdx = ++delayComp.currentIdx % delayComp.signals.length;
            }
        }
    }
}