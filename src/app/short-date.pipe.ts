import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortDate'
})
export class ShortDatePipe implements PipeTransform {

  transform(value: Date, args?: any): any {

    if (this.isToday(value)) {
      return this.leftPad(value.getHours()) + ':' + this.leftPad(value.getMinutes());
    } else {
      return this.leftPad(value.getDate()) + '.' + this.leftPad(value.getMonth() + 1);
    }
  }

  private isToday(date) {
    return (this.transformToFormattedDate(new Date()) === this.transformToFormattedDate(date));
  }

  private transformToFormattedDate(date) {
    return date.getDate + '.' + (date.getMonth + 1) + '.' + date.getFullYear();
  }

  private leftPad(text, symbol = '0', length = 2) {
    text = text + '';
    return symbol.repeat(length - text.length) + text;
  }

}
