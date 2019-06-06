declare var TextTable: ITextTable;

export default TextTable;

interface ITextTable {
	parse(tableLikeString: string, decode?: boolean): { [key: string]: string }[];
	stringify(plainObjectArray: { [key: string]: string }[], encode?: boolean): string;
	validate(tableLikeString: string, decode?: boolean): { valid: boolean; message?: string };
}
