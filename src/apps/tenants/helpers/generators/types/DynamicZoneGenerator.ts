import { BaseGenerator } from "./BaseGenerator";
import { registry } from "../registry";
import { GenericRecord } from "~/types";

class DynamicZoneGenerator extends BaseGenerator<GenericRecord | null> {
    public type = "dynamicZone";
    public multipleValues = false;

    public generate(): GenericRecord | null {
        return null;
    }
}

class MultiDynamicZoneGenerator extends BaseGenerator<GenericRecord[] | null> {
    public type = "dynamicZone";
    public multipleValues = true;

    public generate(): GenericRecord[] | null {
        return [];
    }
}

registry.registerGenerator(DynamicZoneGenerator);
registry.registerGenerator(MultiDynamicZoneGenerator);
