import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItineraryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
