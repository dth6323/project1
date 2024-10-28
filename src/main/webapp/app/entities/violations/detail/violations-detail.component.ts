import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IViolations } from '../violations.model';

@Component({
  standalone: true,
  selector: 'jhi-violations-detail',
  templateUrl: './violations-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ViolationsDetailComponent {
  violations = input<IViolations | null>(null);

  previousState(): void {
    window.history.back();
  }
}
