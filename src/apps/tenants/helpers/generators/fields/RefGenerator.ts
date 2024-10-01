import { BaseGenerator } from "./BaseGenerator";
import { registry } from "../registry";

interface Ref {
    modelId: string;
    id: string;
    entryId: string;
}

class RefGenerator extends BaseGenerator<Ref | null> {
    public type = "ref";
    public multipleValues = false;

    public generate(): Ref | null {
        return null;
    }
}

class MultiRefGenerator extends BaseGenerator<Ref[]> {
    public type = "ref";
    public multipleValues = true;

    public generate(): Ref[] {
        return [];
    }
}

registry.registerGenerator(RefGenerator);
registry.registerGenerator(MultiRefGenerator);
