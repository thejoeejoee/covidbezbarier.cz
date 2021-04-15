export class BaseState {
    toJSON() {
        return Object.getOwnPropertyNames(this).reduce((a, b) => {
            // @ts-ignore
            a[b] = this[b];
            return a;
        }, {});
    }
}
