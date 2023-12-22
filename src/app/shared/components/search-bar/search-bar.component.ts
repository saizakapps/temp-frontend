import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonService } from '../../services/common.services';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

  @Input() suggestions: string[] = [];

  @Output() selectionChange: any = new EventEmitter<any>();

  filteredSuggestions: string[] = [];

  searchText: string = '';

  selectedIndex: number = -1;

  constructor(private commonService: CommonService) {}

  /* Close dropdown when click outside */
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    this.filteredSuggestions = [];
  }

  filterSuggestions() {
    if (this.searchText !== '') {
      this.filteredSuggestions = this.suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(this.searchText.toLowerCase())
        // this.commonService.compareStringsCharByChar(this.searchText.toLowerCase(), suggestion.toLowerCase())
      ).slice(0, 5);
    } else {
      this.selectionChange.emit(this.searchText);
      this.filteredSuggestions = [];
    }
  }

  selectSuggestion(suggestion: string) {
    this.searchText = suggestion;
    this.selectionChange.emit(this.searchText);
    this.filteredSuggestions = [];
  }

  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredSuggestions.length - 1);
        break;
      case 'Enter':
        if (this.selectedIndex >= 0 && this.selectedIndex < this.filteredSuggestions.length) {
          this.selectSuggestion(this.filteredSuggestions[this.selectedIndex]);
        }
        break;
    }
  }
}
