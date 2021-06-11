import { Component, ViewEncapsulation, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent implements OnInit, OnDestroy {
    public code: number = null;
    public message: string = null;
    private _subscription: Subscription = null;
    constructor(private _activatedRoute: ActivatedRoute) {
    }
    ngOnInit(): void {
        this._subscription = this._activatedRoute.paramMap.subscribe(params => {
            this.code = +(params.get("code")  || 500)
            switch(this.code){
                case 404:
                    this.message="La risorsa che cercavi non è stata trovata!";
                    break;
                case 403:
                    this.message="Non hai accesso alla risorsa richiesta!";
                    break;
                default:
                    this.message="Errore nell'esecuzione della richiesta. Riprovare più tardi!";
                    break;
            }
        })
    }
    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
            this._subscription = null;
        }
    }
}
