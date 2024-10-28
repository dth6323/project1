import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IVehicleRegistrations } from '../vehicle-registrations.model';

@Component({
  standalone: true,
  selector: 'jhi-vehicle-registrations-detail',
  templateUrl: './vehicle-registrations-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class VehicleRegistrationsDetailComponent {
  vehicleRegistrations = input<IVehicleRegistrations | null>(null);

  previousState(): void {
    window.history.back();
  }
}
