export class KeyList {

    list: Array<string> = [];

    public getList(): Array<string>
    {
        return this.list;
    }

    public addName(name: string) {
        this.list.push(name);
    }
}
