import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<any>();

  filters = {
    location: '',
    dateDebut: '',
    dateFin: ''
  };

  onSearch(): void {
    this.search.emit(this.filters);
  }
}

