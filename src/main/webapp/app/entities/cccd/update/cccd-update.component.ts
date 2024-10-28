import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IVehicleRegistrations } from 'app/entities/vehicle-registrations/vehicle-registrations.model';
import { VehicleRegistrationsService } from 'app/entities/vehicle-registrations/service/vehicle-registrations.service';
import { ICCCD } from '../cccd.model';
import { CCCDService } from '../service/cccd.service';
import { CCCDFormGroup, CCCDFormService } from './cccd-form.service';

@Component({
  standalone: true,
  selector: 'jhi-cccd-update',
  templateUrl: './cccd-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CCCDUpdateComponent implements OnInit {
  isSaving = false;
  cCCD: ICCCD | null = null;

  vehicleRegistrationsSharedCollection: IVehicleRegistrations[] = [];

  protected cCCDService = inject(CCCDService);
  protected cCCDFormService = inject(CCCDFormService);
  protected vehicleRegistrationsService = inject(VehicleRegistrationsService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CCCDFormGroup = this.cCCDFormService.createCCCDFormGroup();

  compareVehicleRegistrations = (o1: IVehicleRegistrations | null, o2: IVehicleRegistrations | null): boolean =>
    this.vehicleRegistrationsService.compareVehicleRegistrations(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cCCD }) => {
      this.cCCD = cCCD;
      if (cCCD) {
        this.updateForm(cCCD);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cCCD = this.cCCDFormService.getCCCD(this.editForm);
    if (cCCD.id !== null) {
      this.subscribeToSaveResponse(this.cCCDService.update(cCCD));
    } else {
      this.subscribeToSaveResponse(this.cCCDService.create(cCCD));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICCCD>>): void {
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

  protected updateForm(cCCD: ICCCD): void {
    this.cCCD = cCCD;
    this.cCCDFormService.resetForm(this.editForm, cCCD);

    this.vehicleRegistrationsSharedCollection =
      this.vehicleRegistrationsService.addVehicleRegistrationsToCollectionIfMissing<IVehicleRegistrations>(
        this.vehicleRegistrationsSharedCollection,
        cCCD.vehicleRegistrations,
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
            this.cCCD?.vehicleRegistrations,
          ),
        ),
      )
      .subscribe((vehicleRegistrations: IVehicleRegistrations[]) => (this.vehicleRegistrationsSharedCollection = vehicleRegistrations));
  }
}
