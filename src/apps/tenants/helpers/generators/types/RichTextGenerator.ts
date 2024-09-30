import { faker } from "@faker-js/faker";
import { BaseGenerator } from "./BaseGenerator";
import { registry } from "../registry";
import { GenericRecord } from "~/types";

class RichTextGenerator extends BaseGenerator<GenericRecord> {
    public type = "rich-text";
    public multipleValues = false;

    public generate(): GenericRecord {
        return {
            type: "paragraph",
            children: [
                {
                    text: faker.lorem.words({
                        min: 1,
                        max: 3
                    })
                }
            ]
        };
    }
}

class MultiRichTextGenerator extends BaseGenerator<GenericRecord[]> {
    public type = "rich-text";
    public multipleValues = true;

    public generate(): GenericRecord[] {
        const total = faker.number.int({
            min: 1,
            max: 5
        });
        return Array(total)
            .fill(0)
            .map(() => {
                return this.getGenerator(RichTextGenerator).generate();
            });
    }
}

registry.registerGenerator(RichTextGenerator);
registry.registerGenerator(MultiRichTextGenerator);
