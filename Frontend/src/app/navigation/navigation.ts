import { FuseNavigation } from '@fuse/types';
import { PermissionCodes } from 'app/models/models';

export const navigation: FuseNavigation[] = [
    {
        id: 'home',
        title: 'Home',
        translate: 'Home',
        type: 'item',
        icon: "home",
        url: '/home',
        permissions: []
    },
    {
        id: 'roadworks',
        title: 'Lavori stradali',
        translate: 'Lavori stradali',
        type: 'item',
        icon: "all_out",
        url: '/roadworks',
        permissions: [PermissionCodes.RoadWorks_Admin, PermissionCodes.RoadWorks_Operator, PermissionCodes.RoadWorks_PressOffice]
    },
    {
        id: 'import-log',
        title: 'Log importazione lavori',
        translate: 'Log importazione lavori',
        type: 'item',
        icon: "assessment",
        url: '/import-log',
        permissions: [PermissionCodes.RoadWorks_Admin]
    },
    {
        id: 'roadways',
        title: 'Sedi',
        translate: 'Sedi',
        type: 'item',
        icon: "category",
        url: '/roadways',
        permissions: [PermissionCodes.RoadWorks_Admin]
    },
    {
        id: 'companies',
        title: 'Ditte',
        translate: 'Ditte',
        type: 'item',
        icon: "grain",
        url: '/companies',
        permissions: [PermissionCodes.RoadWorks_Admin]
    },
    {
        id: 'uo',
        title: 'Unità operative',
        translate: 'Unità operative',
        type: 'item',
        icon: "settings_input_component",
        url: '/operational-units',
        permissions: [PermissionCodes.RoadWorks_Admin]
    },
    {
        id: 'neighborhood',
        title: 'Quartieri',
        translate: 'Quartieri',
        type: 'item',
        icon: "map",
        url: '/neighborhoods',
        permissions: [PermissionCodes.RoadWorks_Admin]
    },
    {
        id: 'periods',
        title: 'Periodi',
        translate: 'Periodi',
        type: 'item',
        icon: "settings_applications",
        url: '/periods',
        permissions: [PermissionCodes.RoadWorks_Admin]
    },
    {
        id: 'users',
        title: 'Utenti',
        translate: 'Utenti',
        type: 'item',
        icon: "supervisor_account",
        url: '/users',
        permissions: [PermissionCodes.RoadWorks_Admin, PermissionCodes.Tenant_Admin]
    }
];
