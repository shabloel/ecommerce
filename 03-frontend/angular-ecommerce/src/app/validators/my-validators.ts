import { FormControl, ValidationErrors } from "@angular/forms";

export class MyValidators {

    static validateWhiteSpaces(control: FormControl): ValidationErrors{
        if(control.value != null && control.value.trim().length === 0){
            return {'whiteSpace': true};
        }else{
            return null;
        }     
    }
}
