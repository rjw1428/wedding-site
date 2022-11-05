import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  getImage() {
    const num = Math.ceil(Math.random()*4)
    return {backgroundImage: `url('/assets/images/homepic${num}.jpg')`};
  }

}
