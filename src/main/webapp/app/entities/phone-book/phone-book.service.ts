import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { PhoneBook } from './phone-book.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<PhoneBook>;

@Injectable()
export class PhoneBookService {

    private resourceUrl =  SERVER_API_URL + 'api/phone-books';

    constructor(private http: HttpClient) { }

    create(phoneBook: PhoneBook): Observable<EntityResponseType> {
        const copy = this.convert(phoneBook);
        return this.http.post<PhoneBook>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(phoneBook: PhoneBook): Observable<EntityResponseType> {
        const copy = this.convert(phoneBook);
        return this.http.put<PhoneBook>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<PhoneBook>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<PhoneBook[]>> {
        const options = createRequestOption(req);
        return this.http.get<PhoneBook[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<PhoneBook[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: PhoneBook = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<PhoneBook[]>): HttpResponse<PhoneBook[]> {
        const jsonResponse: PhoneBook[] = res.body;
        const body: PhoneBook[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to PhoneBook.
     */
    private convertItemFromServer(phoneBook: PhoneBook): PhoneBook {
        const copy: PhoneBook = Object.assign({}, phoneBook);
        return copy;
    }

    /**
     * Convert a PhoneBook to a JSON which can be sent to the server.
     */
    private convert(phoneBook: PhoneBook): PhoneBook {
        const copy: PhoneBook = Object.assign({}, phoneBook);
        return copy;
    }
}
