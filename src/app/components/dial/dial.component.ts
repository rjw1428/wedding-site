import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { BehaviorSubject, interval, map, Observable } from 'rxjs'

@Component({
  selector: 'app-dial',
  templateUrl: './dial.component.html',
  styleUrls: ['./dial.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialComponent implements OnInit, OnChanges {
  @Input() target: string | number | null = 0
  numbers = new Array(10).fill(0).map((_, i) => i)
  fontSize$ = new BehaviorSubject(10)
  offset$: Observable<string>

  constructor() { }

  ngOnInit(): void {
    this.setFontSizeByScreen()
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setFontSizeByScreen()
  }

  ngOnChanges(changes: SimpleChanges) {
    this.offset$ = this.fontSize$.pipe(
      map(fontSize => -1 * changes['target'].currentValue * fontSize + 'em')
    )
  }

  setFontSizeByScreen() {
    const scalledSize = Math.floor(document.documentElement.clientWidth / 60)
    this.fontSize$.next(Math.min(10, scalledSize))
  }

}
