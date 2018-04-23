import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { PhoneBook } from './phone-book.model';
import { PhoneBookPopupService } from './phone-book-popup.service';
import { PhoneBookService } from './phone-book.service';

@Component({
    selector: 'jhi-phone-book-delete-dialog',
    templateUrl: './phone-book-delete-dialog.component.html'
})
export class PhoneBookDeleteDialogComponent {

    phoneBook: PhoneBook;

    constructor(
        private phoneBookService: PhoneBookService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.phoneBookService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'phoneBookListModification',
                content: 'Deleted an phoneBook'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-phone-book-delete-popup',
    template: ''
})
export class PhoneBookDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private phoneBookPopupService: PhoneBookPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.phoneBookPopupService
                .open(PhoneBookDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
