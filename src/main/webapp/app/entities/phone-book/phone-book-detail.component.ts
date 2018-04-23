import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { PhoneBook } from './phone-book.model';
import { PhoneBookService } from './phone-book.service';

@Component({
    selector: 'jhi-phone-book-detail',
    templateUrl: './phone-book-detail.component.html'
})
export class PhoneBookDetailComponent implements OnInit, OnDestroy {

    phoneBook: PhoneBook;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private phoneBookService: PhoneBookService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPhoneBooks();
    }

    load(id) {
        this.phoneBookService.find(id)
            .subscribe((phoneBookResponse: HttpResponse<PhoneBook>) => {
                this.phoneBook = phoneBookResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPhoneBooks() {
        this.eventSubscriber = this.eventManager.subscribe(
            'phoneBookListModification',
            (response) => this.load(this.phoneBook.id)
        );
    }
}
