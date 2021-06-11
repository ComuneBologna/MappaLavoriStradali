import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'round' })
export class RoundPipe implements PipeTransform {
    transform(value: number, numOfDecimals:number = 0): string {
        if (value != null) {
            return value.toFixed(numOfDecimals);
        }
        return null;
    }
}