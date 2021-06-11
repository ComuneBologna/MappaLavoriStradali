import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FeatureDetailsComponent } from './feature-details/feature-details.component';
import { ListSelectedFeatureComponent } from './list-selected-feature/list-selected-feature.component';
import { MapEditorComponent } from './my-components/map-editor/map-editor.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from "@angular/material/dialog";
import { AddDialogComponent } from './my-components/map-editor/add-dialog/add-dialog.component';
import { ConfirmDialogComponent } from './my-components/map-editor/confirm-dialog/confirm-dialog.component';
import { RenameDialogComponent } from './my-components/map-editor/rename-dialog/rename-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ItDateFormatPipe } from './it-date-format.pipe';
import { RoadWorksMapDetailComponent } from './my-components/dialog/road-works-map-detail.component';
import { HttpConfigInterceptor } from './interceptor/httpconfig.interceptor';
import { environment } from 'src/environments/environment';
import { Authority, Settings } from './models/models';
import { forkJoin, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InfoDialogComponent } from './my-components/dialog/info-dialog/info-dialog.component';

export function initializeAuthorities(httpClient: HttpClient) {
    return () => {
        return forkJoin([httpClient.get<Authority[]>(environment.authoritiesUrl), of(environment.customDomains)]).pipe(tap(results => {
            Settings.authorities = results[0];
            let host = window.location.host.toLowerCase();
            let customDomain = results[1].find(f => f.domain.toLowerCase() == host);
            let authority: Authority = null;
            if (customDomain != null) {
                authority = Settings.authorities.find(f => f.authorityId == customDomain.authorityId);
            }
            if (authority == null) {
                let queryParams = new URLSearchParams(window.location.search);
                let authorityId = queryParams.get("authority");
                if (authorityId) {
                    authority = Settings.authorities.find(f => f.authorityId == +authorityId);
                }
            }
            Settings.user.currentAuthority = authority;
        })).toPromise();
    };
}


@NgModule({
    declarations: [
        AppComponent,
        FeatureDetailsComponent,
        ListSelectedFeatureComponent,
        MapEditorComponent,
        AddDialogComponent,
        ConfirmDialogComponent,
        RenameDialogComponent,
        ItDateFormatPipe,
        RoadWorksMapDetailComponent,
        InfoDialogComponent
    ],
    imports: [
        HttpClientModule,
        FormsModule,
        BrowserModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        NoopAnimationsModule,
        MatTableModule,
        MatCheckboxModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatTooltipModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
        { provide: APP_INITIALIZER, useFactory: initializeAuthorities, deps: [HttpClient], multi: true }
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        AddDialogComponent,
        ConfirmDialogComponent,
        RoadWorksMapDetailComponent,
        RenameDialogComponent,
        InfoDialogComponent]
})
export class AppModule { }
