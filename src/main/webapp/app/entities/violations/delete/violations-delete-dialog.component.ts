import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IViolations } from '../violations.model';
import { ViolationsService } from '../service/violations.service';

@Component({
  standalone: true,
  templateUrl: './violations-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ViolationsDeleteDialogComponent {
  violations?: IViolations;

  protected violationsService = inject(ViolationsService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.violationsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
