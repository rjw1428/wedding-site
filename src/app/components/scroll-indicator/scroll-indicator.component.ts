import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { filter, fromEvent, map, startWith, Subject, switchMap, takeUntil, tap, throttleTime, timer } from 'rxjs';

@Component({
  selector: 'app-scroll-indicator',
  templateUrl: './scroll-indicator.component.html',
  styleUrls: ['./scroll-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollIndicatorComponent implements OnInit, OnDestroy {
  restartTimer$ = new Subject<void>()
  show$ = this.restartTimer$.pipe(
    startWith('hide'),
    switchMap(() => timer(8 * 1000).pipe(
      filter(() => !this.isNearBottom()),
      map(() => 'show'),
      startWith('hide'),
    )),
  )
  destroy$ = new Subject<void>()
  constructor() { }

  ngOnInit(): void {
    fromEvent(window, 'scroll').pipe(
      throttleTime(1000),
      takeUntil(this.destroy$)
    ).subscribe(() => this.restartTimer$.next())
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  isNearBottom() {
    const currentY = window.pageYOffset + document.documentElement.clientHeight
    const totalY = document.body.clientHeight
    const wiggleRoom = 500
    return totalY <= currentY + wiggleRoom
  }

  onClick() {
    console.log("SCROLL TO NEXT")
  }
}
