import { animate, style, transition, trigger, query as queryAnmiate, stagger } from '@angular/animations';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Firestore, QuerySnapshot, updateDoc, doc, QueryDocumentSnapshot } from '@angular/fire/firestore'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { collection, query, where, getDocs, DocumentData } from "firebase/firestore";
import { BehaviorSubject, catchError, exhaustMap, map, Observable, of, shareReplay, startWith, Subject, switchMap, take, takeUntil, tap, timeout, timer } from 'rxjs';
import { GuestInfo, GuestInfoForm, GuestInfoMin, GuestSearch } from '../../models/models';
import { ATTENDING, BRUNCH, MENU, REHERSAL, SUBMISSION_RESPONSES } from './form.options';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

const INVALID = 'invalid search'
const COLLECTION = 'guests'
const searchByName = async (name: string, firestore: Firestore) => {
  const keywords = name.toLowerCase().trim().split(' ')
  if (keywords.length > 4) {
    throw new Error(INVALID)
  }
  const request = await getDocs(
    query(
      collection(firestore, COLLECTION),
      where('hasResponded', '==', false),
      where('search', "array-contains-any", keywords)
    ));
  return request.docs.length
    ? request.docs.filter(doc => {
      const searchTerms = doc.data()['search'] as string[];
      return keywords.every(word => searchTerms.includes(word))
    })
    : [];
}

const formatQueryResponse = (docs: QueryDocumentSnapshot<DocumentData>[]) => docs.length
  ? docs.map(doc => {
    const data = doc.data() as GuestSearch
    const displayName = data['secondary']
      ? `${data.primary.prefix} ${data.primary.firstName} ${data.primary.lastName} / ${data.secondary.prefix} ${data.secondary.firstName} ${data.secondary.lastName}`
      : `${data.primary.prefix} ${data.primary.firstName} ${data.primary.lastName} / Guest`
    return { ...data, id: doc.id, displayName }
  })
  : [{ id: '0', displayName: "No Results Found" }] as GuestSearch[]
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { displayDefaultIndicatorType: false, showError: true },
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
  @ViewChild('step') step: MatStep
  readonly destroy$ = new Subject<void>()
  readonly menuOptions = MENU
  readonly weddingAttendance = ATTENDING
  readonly brunchAttendanceOptoins = BRUNCH
  readonly rehersalAttedanceOptions = REHERSAL
  readonly BREAKPOINTS = [Breakpoints.XSmall, Breakpoints.HandsetPortrait]
  searchValue = new FormControl()
  selectedGuest = new FormControl<GuestSearch | null>(null, Validators.required)
  selectedGuest$ = this.searchValue.valueChanges.pipe(
    switchMap(() => this.selectedGuest.valueChanges.pipe(
      startWith(null),
      tap(() => {
        this.step.interacted = false
        this.weddingAttendanceForm.removeControl('primary')
        this.weddingAttendanceForm.removeControl('secondary')
      }),
    )),
    shareReplay(1)
  )
  search$ = new Subject<string>()
  guestSearch$: Observable<GuestSearch[]> = this.searchValue.valueChanges.pipe(
    switchMap(() => this.search$.pipe(
      take(1),
      switchMap(name => searchByName(name, this.firestore)),
      map(formatQueryResponse),
      switchMap(results => this.selectedGuest$.pipe(
        startWith(null),
        map(selected => results.map(result => ({
          ...result,
          selected: result.id === selected?.id
        })))
      )),
      startWith([]),
      takeUntil(this.destroy$),
      catchError(err => {
        const message = err.message === INVALID
          ? "Please simplify your search"
          : "An error has occurred, try again"
        return of([{ id: '0', displayName: message }] as GuestSearch[])
      })
    ))
  )
  weddingAttendanceForm = new FormGroup({})
  mealForm = new FormGroup({})
  brunchForm = new FormGroup({})
  rehersalhForm = new FormGroup({})
  bothDecline$: Observable<boolean>
  submissionResponse$ = new BehaviorSubject<string[] | null>(null)
  isMobile$ = this.breakpointObserver.observe(this.BREAKPOINTS)
    .pipe(
      takeUntil(this.destroy$),
      tap(result => console.log(result.breakpoints)),
      map(result => result.matches),
    )
  loading$ = new Subject<boolean>()
  constructor(
    private firestore: Firestore,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  ngOnInit(): void {
    const onSelectedGuestChange = this.selectedGuest$.pipe(
      tap((option: GuestSearch | null) => {
        if (option === null) {
          return
        }
        this.weddingAttendanceForm.addControl('primary', this.createGuestAttendingForm(option.primary))
        this.weddingAttendanceForm.addControl('secondary', this.createGuestAttendingForm(option.secondary, !!option.secondary))

        if (option.third) {
          this.weddingAttendanceForm.addControl('third', this.createGuestAttendingForm(option.third, !!option.secondary))
          this.weddingAttendanceForm.addControl('fourth', this.createGuestAttendingForm(option.fourth, !!option.secondary))
          this.weddingAttendanceForm.addControl('fifth', this.createGuestAttendingForm(option.fifth, !!option.secondary))
        }
      }),
      shareReplay(1)
    )

    this.bothDecline$ = onSelectedGuestChange.pipe(
      switchMap(selectedGuest => this.weddingAttendanceForm.valueChanges.pipe(
        tap((forms: { primary?: GuestInfoForm, secondary?: GuestInfoForm }) =>
          this.updateFormControls(forms, selectedGuest)
        ),
        map((forms: { primary?: GuestInfoForm, secondary?: GuestInfoForm }) =>
          !forms.primary?.attendingWedding && !forms.secondary?.attendingWedding
        )
      )),
      takeUntil(this.destroy$),
      startWith(true)
    )
  }

  onSelection(option: GuestSearch) {
    this.selectedGuest.setValue(option)
    this.stepper.next()
  }

  getAll(key: string): GuestInfo {
    const resp = []
    if (this.weddingAttendanceForm.get(key)!.value.attendingWedding) {
      resp.push({
        mealChoice: this.mealForm.get(key)!.value,
        attendingBrunch: this.brunchForm.get(key)!.value
      })
      if (this.selectedGuest.value!.hasRehersalOption) {
        resp.push({ attendingRehersal: this.rehersalhForm.get(key)!.value })
      }
    }
    return resp.reduce((acc, formVal) => ({ ...acc, ...formVal }), { ...this.weddingAttendanceForm.get(key)!.value })
  }

  async submit() {
    if (this.weddingAttendanceForm.invalid) {
      this.weddingAttendanceForm.markAllAsTouched()
      return
    }
    console.info("SUBMITTED")

    const kids = this.weddingAttendanceForm.get('third')
      ? {
        third: this.getAll('third'),
        fourth: this.getAll('fourth'),
        fifth: this.getAll('fifth'),
      }
      : {}
    const data = {
      primary: this.getAll('primary'),
      secondary: this.getAll('secondary'),
      ...kids,
      hasResponded: true
    }
    try {
      this.loading$.next(true)
      await updateDoc(doc(this.firestore, `guests`, this.selectedGuest.value!.id), data)
      const message = !data.primary.attendingWedding && !data.secondary.attendingWedding
        ? SUBMISSION_RESPONSES.notComint
        : SUBMISSION_RESPONSES.success
      this.submissionResponse$.next(message)
    } catch (err) {
      console.error("oh Shit", err)
      this.submissionResponse$.next(SUBMISSION_RESPONSES.error)
    } finally {
      this.loading$.next(false)
    }
  }

  createGuestAttendingForm(guest?: GuestInfoMin, isRequired = true) {
    return new FormGroup({
      firstName: new FormControl(guest?.firstName || '', isRequired ? Validators.required : []),
      lastName: new FormControl(guest?.lastName || '', isRequired ? Validators.required : []),
      attendingWedding: new FormControl(null, Validators.required)
    })
  }

  createSimpleResponseForm(required = true, defaultValue?: string) {
    return new FormControl(defaultValue || null, required ? Validators.required : [])
  }

  updateFormControls(guestInfo: { [key: string]: GuestInfoForm }, selectedGuest: GuestSearch | null) {
    Object.keys(guestInfo).forEach(key => {
      if (guestInfo[key]?.attendingWedding) {
        this.mealForm.addControl(key, this.createSimpleResponseForm())
        this.brunchForm.addControl(key, this.createSimpleResponseForm())
        if (selectedGuest?.hasRehersalOption) {
          // kids are not invited to the rehersal
          this.rehersalhForm.addControl(key, this.createSimpleResponseForm(key === 'primary' || key === 'secondary'))
        }
        return
      }
      this.mealForm.removeControl(key)
      this.brunchForm.removeControl(key)
      if (selectedGuest?.hasRehersalOption) {
        this.rehersalhForm.removeControl(key)
      }
    })
  }
}


// TODO:
// - Loader should show up for a minimum of 3 seconds regardless of api delay
// - Should refactor from primary/secondary/kids -> to an array of guests per invite