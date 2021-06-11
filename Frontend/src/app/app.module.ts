import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { PagesModule } from './pages/pages.module';

import { SecurityService } from './services/security.service';
import { AuthGuard } from './services/auth.guard';
import { OAuthModule } from 'angular-oauth2-oidc';
import * as moment from 'moment/moment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthUserGuard } from './services/auth-user.guard';
import { ErrorComponent } from './pages/errors/error.component';
import { DateMomentPipe } from './pipes/date.pipe';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material';
import { EventBusService } from './services/event-bus.service';


const appRoutes: Routes = [
    { path: 'error/:code', component: ErrorComponent },
    { path: '**', redirectTo: 'home' }
];

export function loadSecurityConfiguration(securityService: SecurityService) {
    return () => securityService.initialize();
}
export function initialize() {
    return () => moment.locale('it');
}

@NgModule({
    declarations: [
        AppComponent,
        ErrorComponent,
        DateMomentPipe,
        SpinnerComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,


        // App modules
        LayoutModule,
        PagesModule,
        FormsModule,
        ReactiveFormsModule,

        OAuthModule.forRoot(),
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        SecurityService,
        AuthGuard,
        AuthUserGuard,
        EventBusService,
        { provide: APP_INITIALIZER, useFactory: loadSecurityConfiguration, deps: [SecurityService], multi: true },
        { provide: APP_INITIALIZER, useFactory: initialize, deps: [], multi: true }
    ]
})
export class AppModule {
}
