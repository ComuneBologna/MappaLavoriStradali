import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Settings } from '../models/models';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authorityId = Settings.user && Settings.user.currentAuthority ? Settings.user.currentAuthority.authorityId : 0;
        request = request.clone({ headers: request.headers.set('AuthorityId', authorityId.toString()) });
        return next.handle(request);
    }
}