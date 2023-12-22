import { Component, Input, OnInit } from '@angular/core';
import { ngxService } from '../../shared/services/incident-services/ngxservice';

@Component({
  selector: 'app-audit-shimmertable',
  templateUrl: './audit-shimmertable.component.html',
  styleUrls: ['./audit-shimmertable.component.css']
})
export class AuditShimmertableComponent implements OnInit {
  @Input() type:any;
  constructor(public ngxservice:ngxService) { }

  ngOnInit(): void {
  }

}
