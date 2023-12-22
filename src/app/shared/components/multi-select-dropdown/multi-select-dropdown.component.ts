import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss']
})
export class MultiSelectDropdownComponent implements OnInit {

  @Input() items: any = [];

  @Input() bindLabel: string = '';

  @Input() bindKey: string = '';

  @Output() selectionChange: any = new EventEmitter<any>();

  @Input() isDisabled:any

  isDropdownOpen: boolean = false;

  selectedItems: any[] = [];

  tableCoumns: any[] = ['', 'Module', 'View', 'Create', 'Update'];
  constructor(private cdr: ChangeDetectorRef, private elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  /* Close dropdown when click outside */
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  /* Trigger dropdown */
  toggleDropdown(): void {
    const doc: any = document.getElementById("table");
    const preScrollHeight: any = doc.scrollHeight;
    this.isDropdownOpen = !this.isDropdownOpen;
    setTimeout(() => {
      const currentScrollHeight: any = doc.scrollHeight;
      if (currentScrollHeight > preScrollHeight) {
        doc.scrollTop = doc.scrollHeight + 30;
      }
    }, 100);
  }

  /* Update selected items when check box change */
  updateSelectedItems(): void {
    const clonedItems = cloneDeep(this.items); // Deep clone the items array
    this.selectedItems = clonedItems.filter(item => item.access);
    this.selectionChange.emit(this.items);
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  /* Clear all selected items */
  clearSelectedItems(): void {
    this.items.forEach(item => (item.access = false));
    this.selectionChange.emit(this.items);
  }

  /* Remove particular selected item */
  removeSelectedItem(item: any): void {
    item.access = false;
    this.items.forEach(ele => {
      if (ele[this.bindLabel] === item[this.bindLabel]) {
        ele.access = false;
      }
    });
    this.selectionChange.emit(this.items);
  }

  /* Get selected Items count */
  selectedItemsCount() {
    let items =  this.selectedItems = this.items.filter(item => item.access);
    return items.length;
  }

  selectAll(event: any) {
    this.items.forEach(ele => {
      if (event.checked) {
        ele.access = true;
      } else {
        ele.access = false;
      }
      this.onAccessChange(ele);
    });
    this.selectionChange.emit(this.items);
  }

  onAccessChange(item) {
    if (!item.access) {
      item.create = false;
      item.update = false;
    }
  }
}
