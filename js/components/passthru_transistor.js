import { Component } from "shapez/game/component";

export const enumPassthruTransistorVariants = {
    "parallel": "parallel",
    "selector": "selector",
}

export class PassthruTransistorComponent extends Component {
    static getId() {
        return "PassthruTransistor";
    }

    constructor({ type = "parallel" }) {
        super();

        this.type = type;
    }
}