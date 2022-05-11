import { Vector, enumDirection } from "shapez/core/vector";
import { enumPinSlotType } from "shapez/game/components/wired_pins";
import { defaultBuildingVariant } from "shapez/game/meta_building";
import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { getMod, isModSafeRewardUnlocked } from "../utils";

const half = "half";

export function patchAdder() {
    const wiresPlus = getMod("wires-plus");

    this.modInterface.addVariantToExistingBuilding(
        wiresPlus.MetaAdderBuilding,
        half,
        {
            name: "Half Adder",
            description: "Add 2 booleans together and output the result (top) and carry (left).",
            dimensions: new Vector(1, 1),
            isUnlocked(root) {
                return isModSafeRewardUnlocked(root, enumHubGoalRewards.reward_logic_gates);
            }
        }
    );

    this.modInterface.extendClass(wiresPlus.MetaAdderBuilding, ({ $old }) => ({
        updateVariants(entity, rotationVariant, variant) {
            const pinComp = entity.components.WiredPins;

            switch (variant) {
                case defaultBuildingVariant: {
                    pinComp.setSlots([
                        {
                            pos: new Vector(0, 0),
                            direction: enumDirection.bottom,
                            type: enumPinSlotType.logicalAcceptor,
                        },
                        {
                            pos: new Vector(1, 0),
                            direction: enumDirection.bottom,
                            type: enumPinSlotType.logicalAcceptor,
                        },
                        {
                            pos: new Vector(1, 0),
                            direction: enumDirection.right,
                            type: enumPinSlotType.logicalAcceptor,
                        },
                        {
                            pos: new Vector(1, 0),
                            direction: enumDirection.top,
                            type: enumPinSlotType.logicalEjector,
                        },
                        {
                            pos: new Vector(0, 0),
                            direction: enumDirection.left,
                            type: enumPinSlotType.logicalEjector,
                        },
                    ]);
                    break;
                }
                case half: {
                    pinComp.setSlots([
                        {
                            pos: new Vector(0, 0),
                            direction: enumDirection.bottom,
                            type: enumPinSlotType.logicalAcceptor,
                        },
                        {
                            pos: new Vector(0, 0),
                            direction: enumDirection.right,
                            type: enumPinSlotType.logicalAcceptor,
                        },
                        {
                            pos: new Vector(0, 0),
                            direction: enumDirection.top,
                            type: enumPinSlotType.logicalEjector,
                        },
                        {
                            pos: new Vector(0, 0),
                            direction: enumDirection.left,
                            type: enumPinSlotType.logicalEjector,
                        },
                    ]);
                    break;
                }
                default: {
                    $old.updateVariants(entity, rotationVariant, variant);
                    break;
                }
            }
        },
    }));
}