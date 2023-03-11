import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { GuestInfo } from 'src/app/models/models';
import { ATTENDING, BRUNCH, MENU, REHERSAL } from '../form.options';

@Component({
  selector: 'app-summary',
  template: `
  <div style="display: flex; align-items: center; flex-direction: column">
    <h4>{{guestData.firstName}} {{guestData.lastName}}</h4>
    <p><span style="font-weight: bold">Attending Wedding: </span>{{ guestData.attendingWedding! | summary : ceremonyOptions }}</p>
      <ng-container *ngIf="guestData.attendingWedding">
        <p><span style="font-weight: bold">Meal Selection: </span>{{ guestData.mealChoice! | summary : menuOptions }}</p>
        <p><span style="font-weight: bold">Attending Brunch: </span>{{ guestData.attendingBrunch! | summary : brunchOptions }}</p>
        <p *ngIf="guestData.attendingRehersal !== undefined"><span style="font-weight: bold">Attending Rehersal: </span>{{ guestData.attendingRehersal! | summary : rehersalOptions }}</p>
      </ng-container>
  </div>
  `,
  styles: [
    `.bold {
      font-weight: bold
    }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryComponent implements OnInit {
  @Input() guestData: GuestInfo
  readonly ceremonyOptions = ATTENDING
  readonly menuOptions = MENU
  readonly brunchOptions = BRUNCH
  readonly rehersalOptions = REHERSAL
  constructor() { }

  ngOnInit(): void {
  }

}
