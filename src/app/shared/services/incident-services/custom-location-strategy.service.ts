import { Injectable } from '@angular/core';
import { HashLocationStrategy } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class CustomLocationStrategyService extends HashLocationStrategy {
  override prepareExternalUrl(internal: string): string {
        return this.getBaseHref() + '#' + internal;
    }
}
