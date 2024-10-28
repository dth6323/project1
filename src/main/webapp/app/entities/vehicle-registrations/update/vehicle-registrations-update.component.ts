import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IViolations } from 'app/entities/violations/violations.model';
import { ViolationsService } from 'app/entities/violations/service/violations.service';
import { IVehicleRegistrations } from '../vehicle-registrations.model';
import { VehicleRegistrationsService } from '../service/vehicle-registrations.service';
import { VehicleRegistrationsFormGroup, VehicleRegistrationsFormService } from './vehicle-registrations-form.service';

@Component({
  standalone: true,
  selector: 'jhi-vehicle-registrations-update',
  templateUrl: './vehicle-registrations-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class VehicleRegistrationsUpdateComponent implements OnInit {
  isSaving = false;
  vehicleRegistrations: IVehicleRegistrations | null = null;

  violationsSharedCollection: IViolations[] = [];

  protected vehicleRegistrationsService = inject(VehicleRegistrationsService);
  protected vehicleRegistrationsFormService = inject(VehicleRegistrationsFormService);
  protected violationsService = inject(ViolationsService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: VehicleRegistrationsFormGroup = this.vehicleRegistrationsFormService.createVehicleRegistrationsFormGroup();

  compareViolations = (o1: IViolations | null, o2: IViolations | null): boolean => this.violationsService.compareViolations(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vehicleRegistrations }) => {
      this.vehicleRegistrations = vehicleRegistrations;
      if (vehicleRegistrations) {
        this.updateForm(vehicleRegistrations);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vehicleRegistrations = this.vehicleRegistrationsFormService.getVehicleRegistrations(this.editForm);
    if (vehicleRegistrations.id !== null) {
      this.subscribeToSaveResponse(this.vehicleRegistrationsService.update(vehicleRegistrations));
    } else {
      this.subscribeToSaveResponse(this.vehicleRegistrationsService.create(vehicleRegistrations));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVehicleRegistrations>>): void {
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

  protected updateForm(vehicleRegistrations: IVehicleRegistrations): void {
    this.vehicleRegistrations = vehicleRegistrations;
    this.vehicleRegistrationsFormService.resetForm(this.editForm, vehicleRegistrations);

    this.violationsSharedCollection = this.violationsService.addViolationsToCollectionIfMissing<IViolations>(
      this.violationsSharedCollection,
      ...(vehicleRegistrations.violations ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.violationsService
      .query()
      .pipe(map((res: HttpResponse<IViolations[]>) => res.body ?? []))
      .pipe(
        map((violations: IViolations[]) =>
          this.violationsService.addViolationsToCollectionIfMissing<IViolations>(
            violations,
            ...(this.vehicleRegistrations?.violations ?? []),
          ),
        ),
      )
      .subscribe((violations: IViolations[]) => (this.violationsSharedCollection = violations));
  }
}
