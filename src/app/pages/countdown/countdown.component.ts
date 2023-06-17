import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { interval, map, shareReplay, startWith } from 'rxjs';

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountdownComponent implements OnInit {
  date = new Date('2023-06-24T20:30:00Z').getTime() //+4 for EST
  delta$ = interval(1000).pipe(
    startWith(this.date - Date.now()),
    map(() => this.date - Date.now()),
    shareReplay(1)
  )
  target$ = this.delta$.pipe(map(this.getDiff))
  constructor() { }

  ngOnInit(): void {
  }

  getDiff(millis: number) {
    let isAfter = false
    if (millis < 0) {
      millis = Math.abs(millis)
      isAfter = true
    }
    let result = []
    let rest = millis
    const days = Math.floor(rest / DAY)
    rest = rest % DAY
    const hours = Math.floor(rest / HOUR)
    rest = rest % HOUR
    const min = Math.floor(rest / MINUTE)
    rest = rest % MINUTE
    const sec = Math.floor(rest / SECOND)
    
    if (days < 100)
      result.push(0)

    if (days < 10)
      result.push(0)
    result.push(...days.toString().split(''))

    if (hours < 10)
      result.push(0)
    result.push(...hours.toString().split(''))

    if (min < 10)
      result.push(0)
    result.push(...min.toString().split(''))

    if (sec < 10)
      result.push(0)
    result.push(...sec.toString().split(''))

    result.push(isAfter ? 1 : 0)
    return result
  }

}
