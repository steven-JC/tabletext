declare namespace TextTable {
    export function parse(tableLikeString: string): { [key: string]: string }[]
    export function stringify(
        plainObjectArray: { [key: string]: string }[]
    ): string
    export function validate(
        tableLikeString: string
    ): { valid: boolean; message?: string }
}
