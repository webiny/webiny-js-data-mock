import { BaseGenerator, BaseMultiGenerator } from "./BaseGenerator";
import { registry } from "../registry";
import { GenericRecord } from "~/types";

class DynamicZoneGenerator extends BaseGenerator<GenericRecord> {
    public type = "dynamicZone";
    public multipleValues = false;

    public async generate(): Promise<GenericRecord | null> {
        return null;
    }
}

class MultiDynamicZoneGenerator extends BaseMultiGenerator<GenericRecord> {
    public type = "dynamicZone";
    public multipleValues = true;

    public async generate(): Promise<GenericRecord[]> {
        return [];
    }
}

registry.registerGenerator(DynamicZoneGenerator);
registry.registerGenerator(MultiDynamicZoneGenerator);
