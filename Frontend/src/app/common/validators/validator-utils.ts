export class ValidatorUtils {
    public static required = (): CustomValidationErrors => {
        return { required: [] };
    }
    public static integer = (): CustomValidationErrors => {
        return { integer: [] };
    }
    public static decimal = (): CustomValidationErrors => {
        return { decimal: [] };
    }
    public static decimalInvalidDigits = (digits: number): CustomValidationErrors => {
        return { decimalInvalidDigits: [digits] };
    }
    public static minNumericValue = (minValue: number): CustomValidationErrors => {
        return { minNumericValue: [minValue] };
    }
    public static maxNumericValue = (maxValue: number): CustomValidationErrors => {
        return { maxNumericValue: [maxValue] };
    }
    public static minItems = (digits: number): CustomValidationErrors => {
        return { minItems: [digits] };
    }
    public static date = (): CustomValidationErrors => {
        return { date: [] };
    }
    

    public static getValidationMessage = (error: string): string => {
        switch (error) {
            case "required":
                return "{fieldName} é obbligatorio";
            case "integer":
                return "{fieldName} non è un numero intero";
            case "decimal":
                return "{fieldName} non è un numero";
            case "decimalInvalidDigits":
                return "{fieldName} deve essere un numero con {0} cifre decimali";
            case "minNumericValue":
                return "{fieldName} deve avere un valore maggiore o uguale a {0}";
            case "maxNumericValue":
                return "{fieldName} deve avere un valore minore o uguale a {0}";
            case "minItems":
                return "{fieldName} deve avere almeno {0} elemento selezionato";
            case "date":
                return "{fieldName} non è una data valida";
            default:
                return "";
        }
    }
}

export declare type CustomValidationErrors = {
    [key: string]: any[];
};