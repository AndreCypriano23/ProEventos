import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../util/Constants';

Pipe({
  name: 'DataFormatPipe'
})

export class DataTimeFormat extends DatePipe implements PipeTransform{
//Agora vou colocar um pipe em cima do pipe DatePipe que já existe no angular
  transform(value: any, args?: any): any{
    return super.transform(value, Constants.DATE_TIME_FMT);
  }

}