// import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';

// import { fuseAnimations } from '@fuse/animations';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Roadway } from 'app/models/models';
// import { of } from 'rxjs';
// import { CommonValidators } from 'app/common/validators/common.validator';
// import { NeighborhoodsService } from 'app/services/neighborhoods.service';


// @Component({
//     selector: 'neighborhood',
//     templateUrl: './neighborhood.page.html',
//     encapsulation: ViewEncapsulation.None,
//     animations: fuseAnimations
// })
// export class NeighborhoodPage implements OnInit {
//     public form: FormGroup;
//     public isNew: boolean = false;

//     constructor(private _neighborhoodsService: NeighborhoodsService, private _formBuilder: FormBuilder, private _activatedRoute: ActivatedRoute, private _router: Router, private _matSnackBar: MatSnackBar) {
//     }

//     /**
//      * On init
//      */
//     public ngOnInit(): void {
//         let obs = of(new Roadway());
//         let id = this._activatedRoute.snapshot.queryParams["id"];
//         if (id) {
//             obs = this._neighborhoodsService.getNeighborhoodById(id);
//         };
//         obs.subscribe(result=> 
//             this.form = this.createForm(result)
//         );
//         this.isNew = id == null;
//     }
//     private createForm = (item: Roadway = null): FormGroup => {
//         return this._formBuilder.group({
//             id: [item.id],
//             name: [item.name, CommonValidators.required],
//         });
//     }

//     public save(): void {
//         if (this.form.valid) {
//             let data = <Roadway>this.form.getRawValue();
//             //Ompostare la sxection dai punti
//             this._neighborhoodsService.save(data).subscribe(s => {
//                 this._matSnackBar.open('Quartiere salvato', 'Chiudi', {
//                     verticalPosition: 'top',
//                     duration: 2000
//                 });
//                 this._router.navigateByUrl("/neighborhoods");
//             })
//         }

//     }


// }
