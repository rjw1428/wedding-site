import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { collection, Firestore, onSnapshot, query } from '@angular/fire/firestore';
import { MatSort, Sort } from '@angular/material/sort';
import { BehaviorSubject, map, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { GuestSearch } from 'src/app/models/models';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort
  displayedColumns = [
    'primaryName',
    'primaryAttending',
    'secondaryName',
    'secondaryAttending',
    'brunch',
    'rehersal',
    'filet',
    'fish',
    'veggie'
  ]
  guestData = new BehaviorSubject<GuestSearch[]>([])
  sort$ = new Subject<Sort>()
  tableData$ = this.sort$.pipe(
    startWith(null),
    switchMap(sort => this.guestData.pipe(
      map(data => sort
        ? data.sort((a: any, b: any) => {
          const one = a[sort.active]
          const two = b[sort.active]
          if (b[sort.active] === undefined)
            return -1
          if (typeof one === 'string') {
            if (sort.direction === 'asc')
              return one.localeCompare(two)
            return two.localeCompare(one)
          }
          if (sort.direction === 'asc')
            return +one - +two
          return -one + +two
        })
        : data
      ),
    ))
  )
  totals: {[x: string]: number} = {}
  totalCount = 0
  readonly destroy$ = new Subject<void>()
  constructor(
    private firestore: Firestore,
  ) { }

  ngOnInit(): void {
    onSnapshot(query(collection(this.firestore, 'guests')), (snapshot) => {
      this.totals = {} as {[x: string]: number}
      const guestSnapshot = snapshot.docs
        .map(doc => {
          const data = doc.data() as any
          const result = {
            primaryName: `${data.primary.lastName}, ${data.primary.firstName}`,
            secondaryName: data.secondary ? `${data.secondary.lastName}, ${data.secondary.firstName}` : 'Guest',
            hasResponded: data.hasResponded,
            responseCount: data.hasResponded ? 1 : 0,
            primaryAttending: data.primary.attendingWedding,
            secondaryAttending: data.secondary?.attendingWedding,
            attendingCount: this.getAttendanceCount('attendingWedding', data),
            brunch: this.getAttendanceCount('attendingBrunch', data),
            rehersal: data.hasRehersalOption ? +(data.primary.attendingRehersal || 0) + +(data.secondary?.attendingRehersal || 0) : undefined,
            filet: this.getMealCount(data, 'filet'),
            fish: this.getMealCount(data, 'branzino'),
            veggie: this.getMealCount(data, 'veggie'),
            id: doc.id
          } as any

          // Do a very bad job of getting totals
          Object.keys(result).filter(key => !['id'].includes(key)).map((key: any) => {
            if (!this.totals[key]) {
              this.totals[key] = 0
            } 
            this.totals[key] += result[key] || 0
          })
          return result
        })

      this.totalCount = guestSnapshot.length
      this.guestData.next(guestSnapshot)
    })
  }

  ngAfterViewInit() {
    this.sort.sortChange.pipe(
      takeUntil(this.destroy$),
    ).subscribe((sort) => this.sort$.next(sort))
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  getAttendanceCount(key: string, {primary, secondary, third, fourth, fifth}: {primary: any, secondary: any, third?: any, fourth?: any, fifth?: any}) {
    return +(primary?.[key] || 0) + +(secondary?.[key] || 0) + +(third?.[key] || 0) + +(fourth?.[key] || 0) + +(fifth?.[key] || 0)
  }

  getMealCount(data: { primary: { mealChoice?: string }, secondary: { mealChoice?: string },  third?: { mealChoice?: string },  fourth?: { mealChoice?: string },  fifth?: { mealChoice?: string } }, match: string) {
    const p = +(data.primary.mealChoice === match)
    const s = +(data.secondary?.mealChoice === match)
    const t = +(data.third?.mealChoice === match)
    const f = +(data.fourth?.mealChoice === match)
    const fi = +(data.fifth?.mealChoice === match)
    return p + s + t + f + fi
  }
}
