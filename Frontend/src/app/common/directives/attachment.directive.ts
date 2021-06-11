import { Directive, HostListener, Input} from '@angular/core';
import { Observable } from 'rxjs';

@Directive({
    selector: '[click-attachment]'
})
export class ClickAttachmentDirective {
    @Input('click-attachment') clickAttachment: Observable<string>;

    @HostListener('click', ['$event'])
    public onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.clickAttachment) {
            this.clickAttachment.subscribe(result => {
                window.open(result, '_blank');
            });
        }
    }
}