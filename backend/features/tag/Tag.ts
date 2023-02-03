export interface TagConstructorParams {
    name: string
}

export default class Tag {
    public name: string;

    constructor (tag: TagConstructorParams) {
        this.name = tag.name;
    }
}
