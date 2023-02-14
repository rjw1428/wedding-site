import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  guest = {
    firstName: 'Ryan',
    lastName: 'Wilk',
    attendingWedding: null,
    mealChoice: null,
    attendingBrunch: null,
    attendingRehersal: null
  }
  constructor() { }

  ngOnInit(): void {
  }

}
