export class GraphQLError extends Error {
    public readonly code: number;
    public readonly data: any;

    public constructor(message: string, code: number, data: any) {
        super();
        this.message = message;
        this.code = code;
        this.data = data;
    }
}
