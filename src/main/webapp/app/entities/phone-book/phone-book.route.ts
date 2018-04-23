import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { PhoneBookComponent } from './phone-book.component';
import { PhoneBookDetailComponent } from './phone-book-detail.component';
import { PhoneBookPopupComponent } from './phone-book-dialog.component';
import { PhoneBookDeletePopupComponent } from './phone-book-delete-dialog.component';

@Injectable()
export class PhoneBookResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const phoneBookRoute: Routes = [
    {
        path: 'phone-book',
        component: PhoneBookComponent,
        resolve: {
            'pagingParams': PhoneBookResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'PhoneBooks'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'phone-book/:id',
        component: PhoneBookDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'PhoneBooks'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const phoneBookPopupRoute: Routes = [
    {
        path: 'phone-book-new',
        component: PhoneBookPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'PhoneBooks'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'phone-book/:id/edit',
        component: PhoneBookPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'PhoneBooks'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'phone-book/:id/delete',
        component: PhoneBookDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'PhoneBooks'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
