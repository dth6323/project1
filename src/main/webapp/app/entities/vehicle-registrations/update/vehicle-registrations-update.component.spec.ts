import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IViolations } from 'app/entities/violations/violations.model';
import { ViolationsService } from 'app/entities/violations/service/violations.service';
import { VehicleRegistrationsService } from '../service/vehicle-registrations.service';
import { IVehicleRegistrations } from '../vehicle-registrations.model';
import { VehicleRegistrationsFormService } from './vehicle-registrations-form.service';

import { VehicleRegistrationsUpdateComponent } from './vehicle-registrations-update.component';

describe('VehicleRegistrations Management Update Component', () => {
  let comp: VehicleRegistrationsUpdateComponent;
  let fixture: ComponentFixture<VehicleRegistrationsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vehicleRegistrationsFormService: VehicleRegistrationsFormService;
  let vehicleRegistrationsService: VehicleRegistrationsService;
  let violationsService: ViolationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VehicleRegistrationsUpdateComponent],
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
      .overrideTemplate(VehicleRegistrationsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VehicleRegistrationsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vehicleRegistrationsFormService = TestBed.inject(VehicleRegistrationsFormService);
    vehicleRegistrationsService = TestBed.inject(VehicleRegistrationsService);
    violationsService = TestBed.inject(ViolationsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Violations query and add missing value', () => {
      const vehicleRegistrations: IVehicleRegistrations = { id: 456 };
      const violations: IViolations[] = [{ id: 9599 }];
      vehicleRegistrations.violations = violations;

      const violationsCollection: IViolations[] = [{ id: 8212 }];
      jest.spyOn(violationsService, 'query').mockReturnValue(of(new HttpResponse({ body: violationsCollection })));
      const additionalViolations = [...violations];
      const expectedCollection: IViolations[] = [...additionalViolations, ...violationsCollection];
      jest.spyOn(violationsService, 'addViolationsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ vehicleRegistrations });
      comp.ngOnInit();

      expect(violationsService.query).toHaveBeenCalled();
      expect(violationsService.addViolationsToCollectionIfMissing).toHaveBeenCalledWith(
        violationsCollection,
        ...additionalViolations.map(expect.objectContaining),
      );
      expect(comp.violationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const vehicleRegistrations: IVehicleRegistrations = { id: 456 };
      const violations: IViolations = { id: 6954 };
      vehicleRegistrations.violations = [violations];

      activatedRoute.data = of({ vehicleRegistrations });
      comp.ngOnInit();

      expect(comp.violationsSharedCollection).toContain(violations);
      expect(comp.vehicleRegistrations).toEqual(vehicleRegistrations);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehicleRegistrations>>();
      const vehicleRegistrations = { id: 123 };
      jest.spyOn(vehicleRegistrationsFormService, 'getVehicleRegistrations').mockReturnValue(vehicleRegistrations);
      jest.spyOn(vehicleRegistrationsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehicleRegistrations });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vehicleRegistrations }));
      saveSubject.complete();

      // THEN
      expect(vehicleRegistrationsFormService.getVehicleRegistrations).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(vehicleRegistrationsService.update).toHaveBeenCalledWith(expect.objectContaining(vehicleRegistrations));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehicleRegistrations>>();
      const vehicleRegistrations = { id: 123 };
      jest.spyOn(vehicleRegistrationsFormService, 'getVehicleRegistrations').mockReturnValue({ id: null });
      jest.spyOn(vehicleRegistrationsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehicleRegistrations: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vehicleRegistrations }));
      saveSubject.complete();

      // THEN
      expect(vehicleRegistrationsFormService.getVehicleRegistrations).toHaveBeenCalled();
      expect(vehicleRegistrationsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehicleRegistrations>>();
      const vehicleRegistrations = { id: 123 };
      jest.spyOn(vehicleRegistrationsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehicleRegistrations });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vehicleRegistrationsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareViolations', () => {
      it('Should forward to violationsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(violationsService, 'compareViolations');
        comp.compareViolations(entity, entity2);
        expect(violationsService.compareViolations).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
