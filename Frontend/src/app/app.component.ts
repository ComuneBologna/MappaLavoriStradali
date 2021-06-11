import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { navigation } from 'app/navigation/navigation';
import { locale as navigationItalian } from 'app/common/localizations/it';
import { locale as navigationEnglish } from 'app/common/localizations/en';
import { locale as navigationTurkish } from 'app/common/localizations/tr';
import { PermissionCodes, Settings } from './models/models';
import { FuseNavigation, FuseNavigationItem } from '@fuse/types';


@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     * @param {TranslateService} _translateService
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform
    ) {
        this.navigation = this.adjustNavigationPermissions(navigation);


        // Register the navigation to the service
        this._fuseNavigationService.register("", []);
        let validPermission: PermissionCodes = null;
        for (let permission in PermissionCodes) {
            let clonedNavigation = JSON.parse(JSON.stringify(this.navigation));
            let navigation = this.createNavigationByRole(clonedNavigation, <PermissionCodes>permission);
            this._fuseNavigationService.register(permission, navigation);
            if (validPermission == null && Settings.user.permissions.indexOf(<PermissionCodes>permission) >= 0) {
                validPermission = <PermissionCodes>permission;
            }
        }

        this._fuseNavigationService.setCurrentNavigation(validPermission || "");


        // Add languages
        this._translateService.addLangs(['it', 'en', 'tr']);

        // Set the default language
        this._translateService.setDefaultLang('it');

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(navigationItalian, navigationEnglish, navigationTurkish);

        // Use a language
        this._translateService.use('it');

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ----------------------------------------------------------------------------------------------------
         */

        /**
         * If you are using a language other than the default one, i.e. Turkish in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         **/

        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        /**
         setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('tr');
         });
         */

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix End
         * ----------------------------------------------------------------------------------------------------
         */

        // Add is-mobile class to the body if the platform is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    private adjustNavigationPermissions = (navigations: FuseNavigation[]): FuseNavigation[] => {

        for (let i = 0; i < navigations.length; i++) {
            navigations[i].permissions = [...this.getPermission(navigations[i]).distinct(d => d)];
        }
        return navigations;
    }

    private getPermission = (navigationItem: FuseNavigationItem): PermissionCodes[] => {
        navigationItem.permissions = navigationItem.permissions || [];
        navigationItem.children = navigationItem.children || [];
        let ret = navigationItem.permissions as PermissionCodes[];
        if (navigationItem.type == 'group' || navigationItem.type == 'collapsable') {
            for (let i = 0; i < navigationItem.children.length; i++) {
                let permissions = this.getPermission(navigationItem.children[i]);
                ret.push(...permissions);
            }
        }
        else {
            if (ret.length == 0) {
                ret.push(...Object.keys(PermissionCodes).map(m => PermissionCodes[m]))
            }
        }
        return ret.distinct(d => d);
    }

    private createNavigationByRole = (navigations: FuseNavigation[], permissionCode: PermissionCodes): FuseNavigation[] => {

        for (let i = 0; i < navigations.length; i++) {
            navigations[i].children = this.filterByPermissions(navigations[i].children, permissionCode);
        }
        navigations = navigations.filter(f => f.children.length > 0 || f.permissions.indexOf(permissionCode) >= 0);
        return navigations;
    }

    private filterByPermissions = (navigationItems: FuseNavigationItem[], permissionCode?: PermissionCodes): FuseNavigationItem[] => {
        let ret: FuseNavigationItem[] = [];
        for (let i = 0; i < navigationItems.length; i++) {
            let navigationItem = navigationItems[i];
            if (navigationItem.permissions.indexOf(permissionCode) >= 0) {
                ret.push(navigationItem);
            }
            navigationItem.children = this.filterByPermissions(navigationItem.children, permissionCode);
        }
        return ret;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                this.fuseConfig = config;

                // Boxed
                if (this.fuseConfig.layout.width === 'boxed') {
                    this.document.body.classList.add('boxed');
                }
                else {
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                for (let i = 0; i < this.document.body.classList.length; i++) {
                    const className = this.document.body.classList[i];

                    if (className.startsWith('theme-')) {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
}
