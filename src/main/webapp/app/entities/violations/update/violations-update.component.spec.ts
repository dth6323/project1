import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IVehicleRegistrations } from 'app/entities/vehicle-registrations/vehicle-registrations.model';
import { VehicleRegistrationsService } from 'app/entities/vehicle-registrations/service/vehicle-registrations.service';
import { ViolationsService } from '../service/violations.service';
import { IViolations } from '../violations.model';
import { ViolationsFormService } from './violations-form.service';

import { ViolationsUpdateComponent } from './violations-update.component';

describe('Violations Management Update Component', () => {
  let comp: ViolationsUpdateComponent;
  let fixture: ComponentFixture<ViolationsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let violationsFormService: ViolationsFormService;
  let violationsService: ViolationsService;
  let vehicleRegistrationsService: VehicleRegistrationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ViolationsUpdateComponent],
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
      .overrideTemplate(ViolationsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ViolationsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    violationsFormService = TestBed.inject(ViolationsFormService);
    violationsService = TestBed.inject(ViolationsService);
    vehicleRegistrationsService = TestBed.inject(VehicleRegistrationsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call VehicleRegistrations query and add missing value', () => {
      const violations: IViolations = { id: 456 };
      const vehicleRegistrations: IVehicleRegistrations[] = [{ id: 7562 }];
      violations.vehicleRegistrations = vehicleRegistrations;

      const vehicleRegistrationsCollection: IVehicleRegistrations[] = [{ id: 16117 }];
      jest.spyOn(vehicleRegistrationsService, 'query').mockReturnValue(of(new HttpResponse({ body: vehicleRegistrationsCollection })));
      const additionalVehicleRegistrations = [...vehicleRegistrations];
      const expectedCollection: IVehicleRegistrations[] = [...additionalVehicleRegistrations, ...vehicleRegistrationsCollection];
      jest.spyOn(vehicleRegistrationsService, 'addVehicleRegistrationsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ violations });
      comp.ngOnInit();

      expect(vehicleRegistrationsService.query).toHaveBeenCalled();
      expect(vehicleRegistrationsService.addVehicleRegistrationsToCollectionIfMissing).toHaveBeenCalledWith(
        vehicleRegistrationsCollection,
        ...additionalVehicleRegistrations.map(expect.objectContaining),
      );
      expect(comp.vehicleRegistrationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const violations: IViolations = { id: 456 };
      const vehicleRegistrations: IVehicleRegistrations = { id: 10819 };
      violations.vehicleRegistrations = [vehicleRegistrations];

      activatedRoute.data = of({ violations });
      comp.ngOnInit();

      expect(comp.vehicleRegistrationsSharedCollection).toContain(vehicleRegistrations);
      expect(comp.violations).toEqual(violations);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IViolations>>();
      const violations = { id: 123 };
      jest.spyOn(violationsFormService, 'getViolations').mockReturnValue(violations);
      jest.spyOn(violationsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ violations });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: violations }));
      saveSubject.complete();

      // THEN
      expect(violationsFormService.getViolations).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(violationsService.update).toHaveBeenCalledWith(expect.objectContaining(violations));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IViolations>>();
      const violations = { id: 123 };
      jest.spyOn(violationsFormService, 'getViolations').mockReturnValue({ id: null });
      jest.spyOn(violationsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ violations: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: violations }));
      saveSubject.complete();

      // THEN
      expect(violationsFormService.getViolations).toHaveBeenCalled();
      expect(violationsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IViolations>>();
      const violations = { id: 123 };
      jest.spyOn(violationsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ violations });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(violationsService.update).toHaveBeenCalled();
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
