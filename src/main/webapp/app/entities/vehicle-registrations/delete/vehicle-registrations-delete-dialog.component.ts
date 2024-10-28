import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IVehicleRegistrations } from '../vehicle-registrations.model';
import { VehicleRegistrationsService } from '../service/vehicle-registrations.service';

@Component({
  standalone: true,
  templateUrl: './vehicle-registrations-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class VehicleRegistrationsDeleteDialogComponent {
  vehicleRegistrations?: IVehicleRegistrations;

  protected vehicleRegistrationsService = inject(VehicleRegistrationsService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.vehicleRegistrationsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
