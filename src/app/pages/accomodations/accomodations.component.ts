import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accomodations',
  templateUrl: './accomodations.component.html',
  styleUrls: ['./accomodations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccomodationsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
