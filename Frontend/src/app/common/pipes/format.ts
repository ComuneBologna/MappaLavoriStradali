import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'format' })
export class FormatPipe implements PipeTransform {
    transform(label: string,parameters:string[]): string {
        return label.format(parameters);
    }
}