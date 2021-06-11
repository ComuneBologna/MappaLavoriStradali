import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { RoadWorkService } from 'app/services/road-works.service';
import { RoadWaysService } from 'app/services/roadways.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseSharedModule } from '@fuse/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DashboardPage } from './dashboard/dashboard.page';
import { AuthGuard } from 'app/services/auth.guard';
import { LoginPage } from './security/login.page';
import { LoggedinPage } from './security/logged-in.page';
import { ComponentsModule } from 'app/components/component.module';
import { HttpService } from 'app/services/http.service';
import { OnlyDatePipe } from 'app/common/pipes/only-date.pipe';
import { DateTimePipe } from 'app/common/pipes/datetime.pipe';
import { FormatPipe } from 'app/common/pipes/format';
import { RoundPipe } from 'app/common/pipes/round.pipe';
import { TimePipe } from 'app/common/pipes/time.pipe';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { CompaniesService } from 'app/services/companies.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { RoadWaysPage } from './roadways/roadways.page';
import { RoadWayPage } from './roadways/roadway.page';
import { CompanyPage } from './companies/company.page';
import { CompaniesPage } from './companies/companies.page';
import { OperationalUnitsPage } from './companies/operational-units.page';
import { OperationalUnitPage } from './companies/operational-unit.page';
import { NeighborhoodsService } from 'app/services/neighborhoods.service';
//import { NeighborhoodPage } from './neighborhoods/neighborhood.page';
import { NeighborhoodsPage } from './neighborhoods/neighborhoods.page';
import { MatAutocompleteModule, MatGridListModule } from '@angular/material';
import { PeriodsPage } from './periods/periods.page';
import { PeriodPage } from './periods/period.page';
import { ConfigurationService } from 'app/services/configuration.service';
import { RoadWorksSearchComponent } from './roadworks/road-works-search.component';
import { ScheduledRoadWorksPage } from './roadworks/scheduled-road-work.page';
import { NoScheduledRoadWorksPage } from './roadworks/noscheduled-road-work.page';
import { RoadWorkUserPage } from './roadworks/road-work-user.page';
import { RoadWorkScheduledPage } from './roadworks/road-work-scheduled.page';
import { RoadWorkNonScheduledPage } from './roadworks/road-work-non-scheduled.page';
import { RoadWorksMapPage } from './roadworks/road-works-map.page';
import { AuthUserGuard } from 'app/services/auth-user.guard';
import { RoadWorksMapDetailComponent } from './roadworks/road-works-map-detail.component';
import { ClickAttachmentDirective } from 'app/common/directives/attachment.directive';
import { CompanyComponent } from './roadworks/company.component';
import { ImportWorkComponent } from './roadworks/importWork.component';
import { RoadWorkPlannedPage } from './roadworks/road-work-planned.page';
import { PlannedRoadWorksPage } from './roadworks/planned-road-work.page';
import { ImportLogPage } from './import-logs/import-log.page';
import { LogSearchComponent } from './import-logs/log-search.component';
import { UsersPage } from './users/users.page';
import { UserComponent } from './users/user.component';
import { TranslateModule } from '@ngx-translate/core';
import { UsersService } from 'app/services/users.service';
import {MatChipsModule} from '@angular/material/chips';

const appRoutes: Routes = [
    { path: 'roadworks', component: ScheduledRoadWorksPage, canActivate: [AuthGuard] },
    { path: 'roadwork/user', component: RoadWorkUserPage, canActivate: [AuthUserGuard] },
    { path: 'roadwork/scheduled', component: RoadWorkScheduledPage, canActivate: [AuthGuard] },
    { path: 'roadwork/noscheduled', component: RoadWorkNonScheduledPage, canActivate: [AuthGuard] },
    { path: 'roadwork/planned', component: RoadWorkPlannedPage, canActivate: [AuthGuard]},
    { path: 'roadworks/map/:scheduled', component: RoadWorksMapPage, canActivate: [AuthGuard] },
    { path: 'roadways', component: RoadWaysPage, canActivate: [AuthGuard] },
    { path: 'roadway', component: RoadWayPage, canActivate: [AuthGuard] },
    { path: 'companies', component: CompaniesPage, canActivate: [AuthGuard] },
    { path: 'company', component: CompanyPage, canActivate: [AuthGuard] },
    { path: 'neighborhoods', component: NeighborhoodsPage, canActivate: [AuthGuard] },
    { path: 'periods', component: PeriodsPage, canActivate: [AuthGuard] },
    { path: 'period', component: PeriodPage, canActivate: [AuthGuard] },
    { path: 'operational-units', component: OperationalUnitsPage, canActivate: [AuthGuard] },
    { path: 'operational-unit', component: OperationalUnitPage, canActivate: [AuthGuard] },
    { path: 'import-log', component: ImportLogPage, canActivate: [AuthGuard] },
    { path: 'home', component: DashboardPage, canActivate: [AuthGuard] },
    { path: 'users', component: UsersPage, canActivate: [AuthGuard]},
    { path: 'login', component: LoginPage },
    { path: 'loggedin', component: LoggedinPage },

];


@NgModule({
    declarations: [
        ClickAttachmentDirective,
        RoadWorksSearchComponent,
        RoadWorksMapDetailComponent,
        LogSearchComponent,

        CompaniesPage,
        CompanyPage,
        CompanyComponent,
        DashboardPage,
        ImportWorkComponent,
        LoginPage,
        LoggedinPage,
        NeighborhoodsPage,
        NoScheduledRoadWorksPage,
        OperationalUnitsPage,
        OperationalUnitPage,
        PeriodPage,
        PeriodsPage,
        PlannedRoadWorksPage,
        RoadWaysPage,
        RoadWayPage,
        RoadWorksMapPage,
        RoadWorkScheduledPage,        
        RoadWorkNonScheduledPage,        
        RoadWorkUserPage,        
        ScheduledRoadWorksPage,
        RoadWorkPlannedPage,
        ImportLogPage,
        UsersPage,
        UserComponent,

        OnlyDatePipe,
        DateTimePipe,
        FormatPipe,
        RoundPipe,
        TimePipe
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ComponentsModule,
        FlexLayoutModule,
        FormsModule,
        FuseSharedModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatSortModule,
        MatAutocompleteModule,
        MatTabsModule,
        MatDialogModule,
        MatSnackBarModule,
        MatDividerModule,
        MatExpansionModule,
        ReactiveFormsModule,
        MatChipsModule,
        RouterModule.forRoot(appRoutes)

    ],
    providers: [
        CompaniesService,
        ConfigurationService,
        HttpService,
        NeighborhoodsService,
        RoadWorkService,
        RoadWaysService,
        UsersService
    ],
    entryComponents:[
        RoadWorksMapDetailComponent,
        CompanyComponent,
        ImportWorkComponent,
        UserComponent
    ]
})
export class PagesModule {
}
