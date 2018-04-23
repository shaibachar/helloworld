/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HelloworldTestModule } from '../../../test.module';
import { PhoneBookDetailComponent } from '../../../../../../main/webapp/app/entities/phone-book/phone-book-detail.component';
import { PhoneBookService } from '../../../../../../main/webapp/app/entities/phone-book/phone-book.service';
import { PhoneBook } from '../../../../../../main/webapp/app/entities/phone-book/phone-book.model';

describe('Component Tests', () => {

    describe('PhoneBook Management Detail Component', () => {
        let comp: PhoneBookDetailComponent;
        let fixture: ComponentFixture<PhoneBookDetailComponent>;
        let service: PhoneBookService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HelloworldTestModule],
                declarations: [PhoneBookDetailComponent],
                providers: [
                    PhoneBookService
                ]
            })
            .overrideTemplate(PhoneBookDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PhoneBookDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PhoneBookService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new PhoneBook(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.phoneBook).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
