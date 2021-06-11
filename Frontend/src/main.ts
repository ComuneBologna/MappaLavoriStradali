import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

let basePath = window.location.pathname.split("/")[1];
let baseElement = document.head.getElementsByTagName("base")[0];
baseElement.setAttribute("href", `/${basePath}/`);
//Ricalcolo il base Uri
from(fetch(`https://webclientsconfiguration.blob.core.windows.net/configuration/${window.location.host.replace(":", "_")}/${basePath}/environment.json`).then(function (response) {
    return response.json();
})).pipe(tap((config) => {
    Object.assign(environment, config);
    if (environment.production) {
        enableProdMode();
    }

    platformBrowserDynamic().bootstrapModule(AppModule)
        .catch(err => console.error(err));


})).toPromise();


