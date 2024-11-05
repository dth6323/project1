import { Component } from '@angular/core';
import { ViolationsService } from '../service/violations.service';
import { IViolations } from '../violations.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'jhi-violations-search',
  templateUrl: './violations-search.component.html',
  standalone: true,
  imports: [FormsModule],
})
export class YourSearchComponent {
  licensePlate = ''; // Biến để lưu biển số nhập vào
  violations: IViolations[] = []; // Danh sách vi phạm tìm thấy
  isLoading = false; // Để hiển thị trạng thái loading
  constructor(private violationsService: ViolationsService) {}
  trackId = (item: IViolations): number => this.violationsService.getViolationsIdentifier(item);

  searchViolations(): void {
    if (!this.licensePlate) return;

    this.isLoading = true;
    this.violationsService.searchByLicensePlate(this.licensePlate).subscribe({
      next: data => {
        this.violations = data;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching violations:', err);
        this.isLoading = false;
      },
    });
  }
}
