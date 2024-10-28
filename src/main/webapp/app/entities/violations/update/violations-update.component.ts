import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IVehicleRegistrations } from 'app/entities/vehicle-registrations/vehicle-registrations.model';
import { VehicleRegistrationsService } from 'app/entities/vehicle-registrations/service/vehicle-registrations.service';
import { IViolations } from '../violations.model';
import { ViolationsService } from '../service/violations.service';
import { ViolationsFormGroup, ViolationsFormService } from './violations-form.service';

@Component({
  standalone: true,
  selector: 'jhi-violations-update',
  templateUrl: './violations-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ViolationsUpdateComponent implements OnInit {
  isSaving = false;
  violations: IViolations | null = null;

  vehicleRegistrationsSharedCollection: IVehicleRegistrations[] = [];

  protected violationsService = inject(ViolationsService);
  protected violationsFormService = inject(ViolationsFormService);
  protected vehicleRegistrationsService = inject(VehicleRegistrationsService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ViolationsFormGroup = this.violationsFormService.createViolationsFormGroup();

  compareVehicleRegistrations = (o1: IVehicleRegistrations | null, o2: IVehicleRegistrations | null): boolean =>
    this.vehicleRegistrationsService.compareVehicleRegistrations(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ violations }) => {
      this.violations = violations;
      if (violations) {
        this.updateForm(violations);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const violations = this.violationsFormService.getViolations(this.editForm);
    if (violations.id !== null) {
      this.subscribeToSaveResponse(this.violationsService.update(violations));
    } else {
      this.subscribeToSaveResponse(this.violationsService.create(violations));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IViolations>>): void {
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

  protected updateForm(violations: IViolations): void {
    this.violations = violations;
    this.violationsFormService.resetForm(this.editForm, violations);

    this.vehicleRegistrationsSharedCollection =
      this.vehicleRegistrationsService.addVehicleRegistrationsToCollectionIfMissing<IVehicleRegistrations>(
        this.vehicleRegistrationsSharedCollection,
        ...(violations.vehicleRegistrations ?? []),
      );
  }

  protected loadRelationshipsOptions(): void {
    this.vehicleRegistrationsService
      .query()
      .pipe(map((res: HttpResponse<IVehicleRegistrations[]>) => res.body ?? []))
      .pipe(
        map((vehicleRegistrations: IVehicleRegistrations[]) =>
          this.vehicleRegistrationsService.addVehicleRegistrationsToCollectionIfMissing<IVehicleRegistrations>(
            vehicleRegistrations,
            ...(this.violations?.vehicleRegistrations ?? []),
          ),
        ),
      )
      .subscribe((vehicleRegistrations: IVehicleRegistrations[]) => (this.vehicleRegistrationsSharedCollection = vehicleRegistrations));
  }
}
