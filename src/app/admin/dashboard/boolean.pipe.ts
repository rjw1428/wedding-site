import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolean'
})
export class BooleanPipe implements PipeTransform {

  transform(value: boolean | null | undefined): unknown {
    if (value === null || value === undefined) {
      return value
    }
    return value ? 'Yes' : 'No';
  }

}
