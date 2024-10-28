import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IViolations } from 'app/entities/violations/violations.model';
import { ViolationsService } from 'app/entities/violations/service/violations.service';
import { ITypeViolation } from '../type-violation.model';
import { TypeViolationService } from '../service/type-violation.service';
import { TypeViolationFormGroup, TypeViolationFormService } from './type-violation-form.service';

@Component({
  standalone: true,
  selector: 'jhi-type-violation-update',
  templateUrl: './type-violation-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TypeViolationUpdateComponent implements OnInit {
  isSaving = false;
  typeViolation: ITypeViolation | null = null;

  violationsSharedCollection: IViolations[] = [];

  protected typeViolationService = inject(TypeViolationService);
  protected typeViolationFormService = inject(TypeViolationFormService);
  protected violationsService = inject(ViolationsService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TypeViolationFormGroup = this.typeViolationFormService.createTypeViolationFormGroup();

  compareViolations = (o1: IViolations | null, o2: IViolations | null): boolean => this.violationsService.compareViolations(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeViolation }) => {
      this.typeViolation = typeViolation;
      if (typeViolation) {
        this.updateForm(typeViolation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typeViolation = this.typeViolationFormService.getTypeViolation(this.editForm);
    if (typeViolation.id !== null) {
      this.subscribeToSaveResponse(this.typeViolationService.update(typeViolation));
    } else {
      this.subscribeToSaveResponse(this.typeViolationService.create(typeViolation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypeViolation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(typeViolation: ITypeViolation): void {
    this.typeViolation = typeViolation;
    this.typeViolationFormService.resetForm(this.editForm, typeViolation);

    this.violationsSharedCollection = this.violationsService.addViolationsToCollectionIfMissing<IViolations>(
      this.violationsSharedCollection,
      typeViolation.violations,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.violationsService
      .query()
      .pipe(map((res: HttpResponse<IViolations[]>) => res.body ?? []))
      .pipe(
        map((violations: IViolations[]) =>
          this.violationsService.addViolationsToCollectionIfMissing<IViolations>(violations, this.typeViolation?.violations),
        ),
      )
      .subscribe((violations: IViolations[]) => (this.violationsSharedCollection = violations));
  }
}
