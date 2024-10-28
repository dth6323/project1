import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IViolations } from 'app/entities/violations/violations.model';
import { ViolationsService } from 'app/entities/violations/service/violations.service';
import { TypeViolationService } from '../service/type-violation.service';
import { ITypeViolation } from '../type-violation.model';
import { TypeViolationFormService } from './type-violation-form.service';

import { TypeViolationUpdateComponent } from './type-violation-update.component';

describe('TypeViolation Management Update Component', () => {
  let comp: TypeViolationUpdateComponent;
  let fixture: ComponentFixture<TypeViolationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typeViolationFormService: TypeViolationFormService;
  let typeViolationService: TypeViolationService;
  let violationsService: ViolationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TypeViolationUpdateComponent],
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
      .overrideTemplate(TypeViolationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeViolationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typeViolationFormService = TestBed.inject(TypeViolationFormService);
    typeViolationService = TestBed.inject(TypeViolationService);
    violationsService = TestBed.inject(ViolationsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Violations query and add missing value', () => {
      const typeViolation: ITypeViolation = { id: 456 };
      const violations: IViolations = { id: 9054 };
      typeViolation.violations = violations;

      const violationsCollection: IViolations[] = [{ id: 8519 }];
      jest.spyOn(violationsService, 'query').mockReturnValue(of(new HttpResponse({ body: violationsCollection })));
      const additionalViolations = [violations];
      const expectedCollection: IViolations[] = [...additionalViolations, ...violationsCollection];
      jest.spyOn(violationsService, 'addViolationsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ typeViolation });
      comp.ngOnInit();

      expect(violationsService.query).toHaveBeenCalled();
      expect(violationsService.addViolationsToCollectionIfMissing).toHaveBeenCalledWith(
        violationsCollection,
        ...additionalViolations.map(expect.objectContaining),
      );
      expect(comp.violationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const typeViolation: ITypeViolation = { id: 456 };
      const violations: IViolations = { id: 26288 };
      typeViolation.violations = violations;

      activatedRoute.data = of({ typeViolation });
      comp.ngOnInit();

      expect(comp.violationsSharedCollection).toContain(violations);
      expect(comp.typeViolation).toEqual(typeViolation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypeViolation>>();
      const typeViolation = { id: 123 };
      jest.spyOn(typeViolationFormService, 'getTypeViolation').mockReturnValue(typeViolation);
      jest.spyOn(typeViolationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeViolation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeViolation }));
      saveSubject.complete();

      // THEN
      expect(typeViolationFormService.getTypeViolation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(typeViolationService.update).toHaveBeenCalledWith(expect.objectContaining(typeViolation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypeViolation>>();
      const typeViolation = { id: 123 };
      jest.spyOn(typeViolationFormService, 'getTypeViolation').mockReturnValue({ id: null });
      jest.spyOn(typeViolationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeViolation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeViolation }));
      saveSubject.complete();

      // THEN
      expect(typeViolationFormService.getTypeViolation).toHaveBeenCalled();
      expect(typeViolationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypeViolation>>();
      const typeViolation = { id: 123 };
      jest.spyOn(typeViolationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeViolation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typeViolationService.update).toHaveBeenCalled();
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
