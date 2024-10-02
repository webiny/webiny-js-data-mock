import { BaseGenerator, BaseMultiGenerator } from "./BaseGenerator";
import { registry } from "../registry";

interface Ref {
    modelId: string;
    id: string;
    entryId: string;
}

class RefGenerator extends BaseGenerator<Ref> {
    public type = "ref";
    public multipleValues = false;

    public async generate(): Promise<Ref | null> {
        return null;
    }
}

class MultiRefGenerator extends BaseMultiGenerator<Ref> {
    public type = "ref";
    public multipleValues = true;

    public async generate(): Promise<Ref[] | null> {
        return null;
    }
}

registry.registerGenerator(RefGenerator);
registry.registerGenerator(MultiRefGenerator);
