jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { VehicleRegistrationsService } from '../service/vehicle-registrations.service';

import { VehicleRegistrationsDeleteDialogComponent } from './vehicle-registrations-delete-dialog.component';

describe('VehicleRegistrations Management Delete Component', () => {
  let comp: VehicleRegistrationsDeleteDialogComponent;
  let fixture: ComponentFixture<VehicleRegistrationsDeleteDialogComponent>;
  let service: VehicleRegistrationsService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VehicleRegistrationsDeleteDialogComponent],
      providers: [provideHttpClient(), NgbActiveModal],
    })
      .overrideTemplate(VehicleRegistrationsDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VehicleRegistrationsDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VehicleRegistrationsService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      }),
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
