import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { HelloworldPhoneBookModule } from './phone-book/phone-book.module';
import { HelloworldClientModule } from './client/client.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        HelloworldPhoneBookModule,
        HelloworldClientModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HelloworldEntityModule {}
