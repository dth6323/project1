import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ICCCD } from '../cccd.model';

@Component({
  standalone: true,
  selector: 'jhi-cccd-detail',
  templateUrl: './cccd-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class CCCDDetailComponent {
  cCCD = input<ICCCD | null>(null);

  previousState(): void {
    window.history.back();
  }
}
