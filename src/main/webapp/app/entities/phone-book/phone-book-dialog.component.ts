import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { PhoneBook } from './phone-book.model';
import { PhoneBookPopupService } from './phone-book-popup.service';
import { PhoneBookService } from './phone-book.service';
import { Client, ClientService } from '../client';

@Component({
    selector: 'jhi-phone-book-dialog',
    templateUrl: './phone-book-dialog.component.html'
})
export class PhoneBookDialogComponent implements OnInit {

    phoneBook: PhoneBook;
    isSaving: boolean;

    clients: Client[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private phoneBookService: PhoneBookService,
        private clientService: ClientService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.clientService.query()
            .subscribe((res: HttpResponse<Client[]>) => { this.clients = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.phoneBook.id !== undefined) {
            this.subscribeToSaveResponse(
                this.phoneBookService.update(this.phoneBook));
        } else {
            this.subscribeToSaveResponse(
                this.phoneBookService.create(this.phoneBook));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<PhoneBook>>) {
        result.subscribe((res: HttpResponse<PhoneBook>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: PhoneBook) {
        this.eventManager.broadcast({ name: 'phoneBookListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackClientById(index: number, item: Client) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-phone-book-popup',
    template: ''
})
export class PhoneBookPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private phoneBookPopupService: PhoneBookPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.phoneBookPopupService
                    .open(PhoneBookDialogComponent as Component, params['id']);
            } else {
                this.phoneBookPopupService
                    .open(PhoneBookDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
