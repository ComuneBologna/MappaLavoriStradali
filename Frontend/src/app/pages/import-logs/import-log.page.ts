import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { RoadWorkService } from 'app/services/road-works.service';
import { Log, LogFilter, PermissionCodes, Settings } from 'app/models/models';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { EnumUtils } from 'app/common/utils/enum.util';
import { fuseAnimations } from '@fuse/animations';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'import-log',
    templateUrl: 'import-log.page.html',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class ImportLogPage implements OnInit {

    public dataSource: MatTableDataSource<Log>;
    public enumUtils: EnumUtils = EnumUtils;
    private lastFilter: LogFilter = null;
    public totalCount: number = 0;


    public displayedColumns = ['fileName', 'companyName', 'migrationDate', 'actions'];


    @ViewChild(MatPaginator, { static: true })
    private paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(private _roadWorkService: RoadWorkService) { }

    ngOnInit() {
        this.dataSource = new MatTableDataSource([]);
        this.paginator.page.pipe(tap(() => this.loadData())).subscribe();
        this.dataSource.sort = this.sort;
        this.loadData();
    }

    public search = (searchData: LogFilter): void => {
        this.lastFilter = searchData;
        this.loadData();
    }

    private loadData = (): void => {
        let criteria = this.lastFilter;

        this._roadWorkService.getLogs(criteria).subscribe(s => {
            if (s) {
                this.totalCount = s.totalCount;
                this.dataSource.data = [...s.items];
            }
        });
    }

    public export = (id: number): void => {
        this._roadWorkService.getLogsById(id).subscribe(result => {
            this.createLink(result);
        });
    }

    private createLink = (url: string): void => {
        // var a = document.createElement('a');
        // a.href = url;
        window.open(url, "_download")
        // a.download = url;
        // document.body.appendChild(a);
        // a.click();
        // document.body.removeChild(a);
    }

    public get canManage() {
        return Settings.user.hasPermission(PermissionCodes.RoadWorks_Admin);
    }
}