import { animate, style, transition, trigger, query as queryAnmiate, stagger } from '@angular/animations';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Firestore, collectionData, getDoc } from '@angular/fire/firestore'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { collection, query, where, getDocs } from "firebase/firestore";
import { debounceTime, finalize, from, map, mergeMap, Observable, of, startWith, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { GuestInfo, GuestSearch } from '../../models/models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, 
    useValue: { displayDefaultIndicatorType: false, showError: true }
  }],
  animations: [
    trigger('fade', [
      transition('* => *', [
        queryAnmiate(':enter', [
          style({ opacity: 0, transform: 'translateY(25%)' }),
          stagger(500, [animate('0.5s', style({ opacity: 1, transform: 'translateY(0)' }))])
        ], { optional: true }),
        queryAnmiate(':leave', [
          style({ opacity: 1, transform: 'translateY(0)' }),
          stagger(200, [animate('0.5s', style({ opacity: 0 }))])
        ], { optional: true })
      ])
    ])
  ]
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper: MatStepper
  readonly destroy$ = new Subject<void>()
  searchValue = new FormControl()
  selectedGuest = new FormControl<GuestSearch | null>(null, Validators.required)
  selectionMade$ = this.selectedGuest.valueChanges.pipe(
    map(val => !!val ? 't' : 'f'),
    startWith('f')
  )
  selectedGuest$ = this.selectedGuest.valueChanges
  search$ = new Subject<string>()
  guest$ = this.searchValue.valueChanges.pipe(
    switchMap(() => this.search$.pipe(
      take(1),
      switchMap(name => getDocs(
        query(
          collection(this.firestore, 'guests'),
          where('hasResponded', '==', false),
          where('search', "array-contains-any", name.toLowerCase().split(' '))
        ))
      ),
      map(query => query.docs.length
        ? query.docs.map(doc => {
          const data = doc.data() as GuestSearch
          const displayName = data['secondary']
            ? `${data.primary.firstName} ${data.primary.lastName}/${data.secondary.firstName} ${data.secondary.lastName}`
            : `${data.primary.firstName} ${data.primary.lastName}/Guest`
          return { ...data, id: doc.id, displayName }
        })
        : [{ id: 0, displayName: "No Results Found" }]
      ),
      switchMap(results => this.selectedGuest$.pipe(
        startWith(null),
        map(selected => results.map(result => ({
          ...result,
          selected: result.id === selected?.id
        })))
      )),
      startWith([]),
      takeUntil(this.destroy$)
    ))
  )
  weddingAttendanceForm = new FormGroup({
    
  })
  constructor(private firestore: Firestore) { }

  ngOnInit(): void {
    this.searchValue.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.selectedGuest.setValue(null))
  }

  ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
  }

  onSelection(option: any) {
    this.selectedGuest.setValue(option)
    this.stepper.next()
  }

}
