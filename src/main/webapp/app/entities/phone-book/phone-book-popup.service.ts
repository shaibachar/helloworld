import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { PhoneBook } from './phone-book.model';
import { PhoneBookService } from './phone-book.service';

@Injectable()
export class PhoneBookPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private phoneBookService: PhoneBookService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.phoneBookService.find(id)
                    .subscribe((phoneBookResponse: HttpResponse<PhoneBook>) => {
                        const phoneBook: PhoneBook = phoneBookResponse.body;
                        this.ngbModalRef = this.phoneBookModalRef(component, phoneBook);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.phoneBookModalRef(component, new PhoneBook());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    phoneBookModalRef(component: Component, phoneBook: PhoneBook): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.phoneBook = phoneBook;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
