import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { fromEvent, map, startWith, distinctUntilChanged } from 'rxjs';

const IMG_COUNT = 4
const MAX_IMG_WIDTH = 500

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  imagePool = new Array(IMG_COUNT).fill(0).map((_, i) => `/assets/images/homepic${i+1}.jpg`).sort(() => Math.random() < .5 ? 1 : -1)
  image$ = fromEvent(window, 'resize').pipe(
    map(event => {
      const target = event.target as Window
      return target.innerWidth
    }),
    startWith(window.innerWidth),
    map(width => {
      const num = Math.ceil(width / MAX_IMG_WIDTH)
      return num > IMG_COUNT ? IMG_COUNT : num
    }),
    distinctUntilChanged(),
    map(numOfImages => this.imagePool.slice(0, numOfImages)),
  )
  constructor() { }

  ngOnInit(): void {
  }

  getImage(img: string) {
    return {backgroundImage: `url(${img})`};
  }
}
