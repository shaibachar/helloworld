import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HelloworldSharedModule } from '../../shared';
import {
    PhoneBookService,
    PhoneBookPopupService,
    PhoneBookComponent,
    PhoneBookDetailComponent,
    PhoneBookDialogComponent,
    PhoneBookPopupComponent,
    PhoneBookDeletePopupComponent,
    PhoneBookDeleteDialogComponent,
    phoneBookRoute,
    phoneBookPopupRoute,
    PhoneBookResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...phoneBookRoute,
    ...phoneBookPopupRoute,
];

@NgModule({
    imports: [
        HelloworldSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        PhoneBookComponent,
        PhoneBookDetailComponent,
        PhoneBookDialogComponent,
        PhoneBookDeleteDialogComponent,
        PhoneBookPopupComponent,
        PhoneBookDeletePopupComponent,
    ],
    entryComponents: [
        PhoneBookComponent,
        PhoneBookDialogComponent,
        PhoneBookPopupComponent,
        PhoneBookDeleteDialogComponent,
        PhoneBookDeletePopupComponent,
    ],
    providers: [
        PhoneBookService,
        PhoneBookPopupService,
        PhoneBookResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HelloworldPhoneBookModule {}
