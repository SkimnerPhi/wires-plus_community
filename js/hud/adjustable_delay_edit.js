import { DialogWithForm } from "shapez/core/modal_dialog_elements";
import { FormElementInput } from "shapez/core/modal_dialog_forms";
import { STOP_PROPAGATION } from "shapez/core/signal";
import { enumMouseButton } from "shapez/game/camera";
import { BaseHUDPart } from "shapez/game/hud/base_hud_part";

export class HUDAdjustableDelayEdit extends BaseHUDPart {
    initialize() {
        this.root.camera.downPreHandler.add(this.downPreHandler, this);
    }

    downPreHandler(pos, button) {
        if (this.root.currentLayer !== "wires") {
            return;
        }

        const tile = this.root.camera.screenToWorld(pos).toTileSpace();
        const contents = this.root.map.getLayerContentXY(tile.x, tile.y, "wires");
        if (contents) {
            const delayComp = contents.components.AdjustableDelay;
            if (delayComp) {
                if (button === enumMouseButton.left) {
                    this.editDelayText(contents, {
                        deleteOnCancel: false
                    });
                    return STOP_PROPAGATION;
                }
            }
        }
    }

    editDelayText(entity, { deleteOnCancel = true }) {
        const delayComp = entity.components.AdjustableDelay;
        if (!delayComp) {
            return;
        }

        const uid = entity.uid;

        const textInput = new FormElementInput({
            id: "delayAmount",
            placeholder: "",
            defaultValue: "" + delayComp.delay,
            validator: val => Number.parseInt(val) > 0,
        });

        const dialog = new DialogWithForm({
            app: this.root.app,
            title: "Delay amount",
            desc: "Number of ticks to delay the input signal:",
            formElements: [ textInput ],
            buttons: [ "cancel:bad:escape" , "ok:good:enter" ],
            closeButton: false,
        });
        this.root.hud.parts.dialogs.internalShowDialog(dialog);

        dialog.buttonSignals.ok.add(() => {
            if (!this.root?.entityMgr) {
                return;
            }

            const entityRef = this.root.entityMgr.findByUid(uid, false);
            if (!entityRef) {
                return;
            }

            const delayComp = entityRef.components.AdjustableDelay;
            if (!delayComp) {
                return;
            }

            delayComp.delay = Number.parseInt(textInput.getValue());
        });

        if (deleteOnCancel) {
            dialog.buttonSignals.cancel.add(() => {
                const entityRef = this.root?.entityMgr?.findByUid(uid, false);
                if (!entityRef) {
                    return;
                }

                const delayComp = entityRef.components.AdjustableDelay;
                if (!delayComp) {
                    return;
                }

                this.root.logic.tryDeleteBuilding(entityRef);
            })
        }
    }
}