import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICCCD } from '../cccd.model';
import { CCCDService } from '../service/cccd.service';

@Component({
  standalone: true,
  templateUrl: './cccd-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CCCDDeleteDialogComponent {
  cCCD?: ICCCD;

  protected cCCDService = inject(CCCDService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.cCCDService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
