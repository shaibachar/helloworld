/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HelloworldTestModule } from '../../../test.module';
import { PhoneBookComponent } from '../../../../../../main/webapp/app/entities/phone-book/phone-book.component';
import { PhoneBookService } from '../../../../../../main/webapp/app/entities/phone-book/phone-book.service';
import { PhoneBook } from '../../../../../../main/webapp/app/entities/phone-book/phone-book.model';

describe('Component Tests', () => {

    describe('PhoneBook Management Component', () => {
        let comp: PhoneBookComponent;
        let fixture: ComponentFixture<PhoneBookComponent>;
        let service: PhoneBookService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HelloworldTestModule],
                declarations: [PhoneBookComponent],
                providers: [
                    PhoneBookService
                ]
            })
            .overrideTemplate(PhoneBookComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PhoneBookComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PhoneBookService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new PhoneBook(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.phoneBooks[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
