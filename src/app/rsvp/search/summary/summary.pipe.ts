import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summary'
})
export class SummaryPipe implements PipeTransform {

  transform(value: string | boolean, options: {key: string | boolean, value: string}[]): string {
    const match = options.find(option => option.key === value)
    return match ? match.value : JSON.stringify(value)
  }

}
