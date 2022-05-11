import { Mod } from "shapez/mods/mod";

import { isModLoaded } from "./utils";
import { patchAdder } from "./patches/adder";

import { AdjustableDelayComponent } from "./components/adjustable_delay";

import { MetaAdjustableDelayBuilding } from "./buildings/adjustable_delay";

import { AdjustableDelaySystem } from "./systems/adjustable_delay";

import { HUDAdjustableDelayEdit } from "./hud/adjustable_delay_edit";

import adjustableDelayIcon from "../res/sprites/building_icons/adjustableDelay.png";
import { patchTransistor } from "./patches/transistor";
import { PassthruTransistorComponent } from "./components/passthru_transistor";
import { PassthruTransistorSystem } from "./systems/passthru_transistor";

class ModImpl extends Mod {
    init() {
        if (isModLoaded("wires-plus")) {
            patchAdder.call(this);
            patchTransistor.call(this);
        }

        this.component(AdjustableDelayComponent);
        this.component(PassthruTransistorComponent);

        this.building(MetaAdjustableDelayBuilding, {
            icon: adjustableDelayIcon
        }, "AdjustableDelay");

        this.system(AdjustableDelaySystem, "AdjustableDelay");
        this.system(PassthruTransistorSystem, "PassthruTransistor");

        this.hudElement("adjustableDelayEdit", HUDAdjustableDelayEdit);
    }

    component(component) {
        const name = component.getId() + "Component";
        this[name] = component;
        this.modInterface.registerComponent(component);
    }
    building(metaClass, { icon, toolbar = "wires", location = "primary" }, name) {
        this[`Meta${name}Building`] = metaClass;
        this.modInterface.registerNewBuilding({
            metaClass,
            buildingIconBase64: icon,
        });
        this.modInterface.addNewBuildingToToolbar({
            toolbar,
            location,
            metaClass,
        });
    }
    system(systemClass, name, before = "end") {
        const id = name.charAt(0).toLowerCase() + name.slice(1);
        this[name + "System"] = systemClass;
        this.modInterface.registerGameSystem({
            id,
            systemClass,
            before,
        });
    }
    hudElement(id, hudElement) {
        const name = "HUD" + id.charAt(0).toUpperCase() + id.slice(1);
        this[name] = hudElement;
        this.modInterface.registerHudElement(id, hudElement);
    }
}
