import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITypeViolation } from '../type-violation.model';
import { TypeViolationService } from '../service/type-violation.service';

@Component({
  standalone: true,
  templateUrl: './type-violation-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TypeViolationDeleteDialogComponent {
  typeViolation?: ITypeViolation;

  protected typeViolationService = inject(TypeViolationService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typeViolationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
