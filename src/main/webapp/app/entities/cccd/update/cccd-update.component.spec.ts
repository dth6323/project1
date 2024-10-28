import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IVehicleRegistrations } from 'app/entities/vehicle-registrations/vehicle-registrations.model';
import { VehicleRegistrationsService } from 'app/entities/vehicle-registrations/service/vehicle-registrations.service';
import { CCCDService } from '../service/cccd.service';
import { ICCCD } from '../cccd.model';
import { CCCDFormService } from './cccd-form.service';

import { CCCDUpdateComponent } from './cccd-update.component';

describe('CCCD Management Update Component', () => {
  let comp: CCCDUpdateComponent;
  let fixture: ComponentFixture<CCCDUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let cCCDFormService: CCCDFormService;
  let cCCDService: CCCDService;
  let vehicleRegistrationsService: VehicleRegistrationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CCCDUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CCCDUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CCCDUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cCCDFormService = TestBed.inject(CCCDFormService);
    cCCDService = TestBed.inject(CCCDService);
    vehicleRegistrationsService = TestBed.inject(VehicleRegistrationsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call VehicleRegistrations query and add missing value', () => {
      const cCCD: ICCCD = { id: 456 };
      const vehicleRegistrations: IVehicleRegistrations = { id: 32095 };
      cCCD.vehicleRegistrations = vehicleRegistrations;

      const vehicleRegistrationsCollection: IVehicleRegistrations[] = [{ id: 2622 }];
      jest.spyOn(vehicleRegistrationsService, 'query').mockReturnValue(of(new HttpResponse({ body: vehicleRegistrationsCollection })));
      const additionalVehicleRegistrations = [vehicleRegistrations];
      const expectedCollection: IVehicleRegistrations[] = [...additionalVehicleRegistrations, ...vehicleRegistrationsCollection];
      jest.spyOn(vehicleRegistrationsService, 'addVehicleRegistrationsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ cCCD });
      comp.ngOnInit();

      expect(vehicleRegistrationsService.query).toHaveBeenCalled();
      expect(vehicleRegistrationsService.addVehicleRegistrationsToCollectionIfMissing).toHaveBeenCalledWith(
        vehicleRegistrationsCollection,
        ...additionalVehicleRegistrations.map(expect.objectContaining),
      );
      expect(comp.vehicleRegistrationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const cCCD: ICCCD = { id: 456 };
      const vehicleRegistrations: IVehicleRegistrations = { id: 7897 };
      cCCD.vehicleRegistrations = vehicleRegistrations;

      activatedRoute.data = of({ cCCD });
      comp.ngOnInit();

      expect(comp.vehicleRegistrationsSharedCollection).toContain(vehicleRegistrations);
      expect(comp.cCCD).toEqual(cCCD);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICCCD>>();
      const cCCD = { id: 123 };
      jest.spyOn(cCCDFormService, 'getCCCD').mockReturnValue(cCCD);
      jest.spyOn(cCCDService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cCCD });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cCCD }));
      saveSubject.complete();

      // THEN
      expect(cCCDFormService.getCCCD).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(cCCDService.update).toHaveBeenCalledWith(expect.objectContaining(cCCD));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICCCD>>();
      const cCCD = { id: 123 };
      jest.spyOn(cCCDFormService, 'getCCCD').mockReturnValue({ id: null });
      jest.spyOn(cCCDService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cCCD: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cCCD }));
      saveSubject.complete();

      // THEN
      expect(cCCDFormService.getCCCD).toHaveBeenCalled();
      expect(cCCDService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICCCD>>();
      const cCCD = { id: 123 };
      jest.spyOn(cCCDService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cCCD });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cCCDService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareVehicleRegistrations', () => {
      it('Should forward to vehicleRegistrationsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(vehicleRegistrationsService, 'compareVehicleRegistrations');
        comp.compareVehicleRegistrations(entity, entity2);
        expect(vehicleRegistrationsService.compareVehicleRegistrations).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
