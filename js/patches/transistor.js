import { generateMatrixRotations } from "shapez/core/utils";
import { enumDirection, Vector } from "shapez/core/vector";
import { MetaTransistorBuilding } from "shapez/game/buildings/transistor";
import { enumLogicGateType, LogicGateComponent } from "shapez/game/components/logic_gate";
import { enumPinSlotType } from "shapez/game/components/wired_pins";
import { WireTunnelComponent } from "shapez/game/components/wire_tunnel";
import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { enumPassthruTransistorVariants, PassthruTransistorComponent } from "../components/passthru_transistor";
import { getMod, isModSafeRewardUnlocked } from "../utils";

const overlayMatrix = generateMatrixRotations([0, 1, 0, 1, 1, 1, 0, 1, 0]);

export function patchTransistor() {
    const wiresPlus = getMod("wires-plus");

    this.modInterface.addVariantToExistingBuilding(
        MetaTransistorBuilding,
        enumPassthruTransistorVariants.parallel,
        {
            name: "Parallel Transistor",
            description: "Forwards the bottom input if the side input is truthy (a shape, color or \"1\"). Side input passes through with no delay.",
            isUnlocked(root) {
                return isModSafeRewardUnlocked(root, enumHubGoalRewards.reward_logic_gates);
            },
        }
    );
    this.modInterface.addVariantToExistingBuilding(
        MetaTransistorBuilding,
        enumPassthruTransistorVariants.selector,
        {
            name: "Selector Transistor",
            description: "Forwards the side input if the bottom input is truthy (a shape, color or \"1\"). Side input passes through with no delay.",
            isUnlocked(root) {
                return isModSafeRewardUnlocked(root, enumHubGoalRewards.reward_logic_gates);
            },
        }
    );

    this.modInterface.extendClass(MetaTransistorBuilding, ({ $old }) => ({
        updateVariants(entity, rotationVariant, variant) {
            const pinComp = entity.components.WiredPins;

            if (entity.components.WireInsulator) {
                entity.removeComponent(WireTunnelComponent);
                entity.removeComponent(wiresPlus.WireInsulatorComponent);
            }

            switch (variant) {
                case enumPassthruTransistorVariants.parallel:
                case enumPassthruTransistorVariants.selector: {
                    if (entity.components.LogicGate) {
                        entity.removeComponent(LogicGateComponent);
                    }
                    if (!entity.components.PassthruTransistor) {
                        entity.addComponent(new PassthruTransistorComponent({}));
                    }
                    entity.components.PassthruTransistor.type = variant;

                    entity.addComponent(new WireTunnelComponent());
                    entity.addComponent(new wiresPlus.WireInsulatorComponent({
                        connections: [
                            [
                                {
                                    pos: new Vector(0, 0),
                                    direction: enumDirection.left,
                                },
                                {
                                    pos: new Vector(0, 0),
                                    direction: enumDirection.right,
                                },
                            ],
                        ]
                    }));
                    pinComp.setSlots([
                        {
                            pos: new Vector(0, 0),
                            direction: enumDirection.bottom,
                            type: enumPinSlotType.logicalAcceptor,
                        },
                        {
                            pos: new Vector(0, 0),
                            direction: enumDirection.left,
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
                    ]);
                    break;
                }
                default: {
                    pinComp.setSlots([
                        {
                            pos: new Vector(0, 0),
                            direction: enumDirection.top,
                            type: enumPinSlotType.logicalEjector,
                        },
                        {
                            pos: new Vector(0, 0),
                            direction: enumDirection.left,
                            type: enumPinSlotType.logicalAcceptor,
                        },
                        {
                            pos: new Vector(0, 0),
                            direction: enumDirection.bottom,
                            type: enumPinSlotType.logicalAcceptor,
                        },
                    ]);

                    if (entity.components.PassthruTransistor) {
                        entity.removeComponent(PassthruTransistorComponent);
                    }
                    if (!entity.components.LogicGate) {
                        entity.addComponent(new LogicGateComponent({ type: enumLogicGateType.transistor }));
                    }

                    $old.updateVariants(entity, rotationVariant, variant);
                    break;
                }
            }
        },
        getSpecialOverlayRenderMatrix(rotation, rotationVariant, variant, entity) {
            switch (variant) {
                case enumPassthruTransistorVariants.parallel:
                case enumPassthruTransistorVariants.selector:
                    return overlayMatrix[rotation];
                default:
                    return $old.getSpecialOverlayRenderMatrix(rotation, rotationVariant, variant, entity);
            }
        }
    }));
}