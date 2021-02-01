import { FormControl} from "@angular/forms";
 
export class Validation 
{

static  confirmPassword(control: FormControl, compareStr:string) :boolean{     
  let formInvalid = control.dirty && (control.value != compareStr);
  return formInvalid;
}


static checkLimit(control: FormControl, min: number, max: number, isNumber:boolean=false): boolean 
{  
    if((!isNumber|| !Number(isNumber)) && control.dirty  && control.value &&(control.value.length < min || control.value.length > max)) 
    {
      return true;
    }
    return null; 
}

static checkEmail(control: FormControl): boolean
 {  
  let regexPattern: RegExp= /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,150}))$/; 
    if(control.dirty && control.value  && !regexPattern.test(control.value)) 
    {
      return true;
    }       
    return null; 
}

static checkPassword(control: FormControl): boolean
 {  
  let regexPattern: RegExp=/^(?=.*?[A-Z])(?=.*?[a-z]).{10,}$/; 
    if(control.dirty && !regexPattern.test(control.value)) 
    {
      return true;
    }       
    return null; 
}
static onlyDigit(control: FormControl): boolean
 {  
  let regexPattern: RegExp=/[0-9]{10}/; 
    if(control.dirty   && control.value  && !regexPattern.test(control.value)) 
    {
      return true;
    }       
    return null; 
}

}