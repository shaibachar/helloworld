/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HelloworldTestModule } from '../../../test.module';
import { PhoneBookDialogComponent } from '../../../../../../main/webapp/app/entities/phone-book/phone-book-dialog.component';
import { PhoneBookService } from '../../../../../../main/webapp/app/entities/phone-book/phone-book.service';
import { PhoneBook } from '../../../../../../main/webapp/app/entities/phone-book/phone-book.model';
import { ClientService } from '../../../../../../main/webapp/app/entities/client';

describe('Component Tests', () => {

    describe('PhoneBook Management Dialog Component', () => {
        let comp: PhoneBookDialogComponent;
        let fixture: ComponentFixture<PhoneBookDialogComponent>;
        let service: PhoneBookService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HelloworldTestModule],
                declarations: [PhoneBookDialogComponent],
                providers: [
                    ClientService,
                    PhoneBookService
                ]
            })
            .overrideTemplate(PhoneBookDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PhoneBookDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PhoneBookService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new PhoneBook(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.phoneBook = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'phoneBookListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new PhoneBook();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.phoneBook = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'phoneBookListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
