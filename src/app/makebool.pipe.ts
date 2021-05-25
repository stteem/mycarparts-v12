import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'makebool'
})
export class MakeBooleanPipe implements PipeTransform {

  constructor() {}
  
  transform(value: any, arg1?: any): any {
    return value === 'true' ? true : false;
  }
}
