import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, interval, map, startWith } from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountdownComponent implements OnInit {
  date = new Date('2023-06-24T20:30:00Z').getTime() //+4 for EST
  target$ = interval(1000).pipe(
    startWith(this.getDiff(this.date - Date.now())),
    map(() => this.getDiff(this.date - Date.now()))
  )
  constructor() { }

  ngOnInit(): void {
  }

  getDiff(millis: number) {
    let result = []
    const SECOND = 1000
    const MINUTE = SECOND * 60
    const HOUR = MINUTE * 60
    const DAY = HOUR * 24

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
    return result
  }

}
