import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ATTENDING, BRUNCH, MENU, REHERSAL } from './form.options';
import { GuestInfo, GuestInfoForm } from './guest-info';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit {
  @Input('guest') primaryGuest: GuestInfo
  attendanceForm = this.fb.group({
    guests: this.fb.array([])
  })

  foodSelectionForm = this.fb.group({})
  readonly menuOptions = MENU
  readonly weddingAttendance = ATTENDING
  readonly burnchAttendanceOptoins = BRUNCH
  readonly rehersalAttedanceOptions = REHERSAL
  constructor(
    private fb: FormBuilder
  ) {

  }
  get guestsFormArray() {
    return <FormArray>this.attendanceForm.get('guests')
  }

  get primaryGuestAttending() {
    return this.guestsFormArray.at(0).get('attendingWedding')!
  }

  ngOnInit(): void {
    this.guestsFormArray.push(this.createGuestForm(this.primaryGuest, true))

    // Listen if first person is attending and add/remove guest form
    this.primaryGuestAttending.valueChanges.subscribe(value => {
      if (value === 'true')
        this.guestsFormArray.push(this.createGuestForm(this.primaryGuest, false))
      else {
        this.removeGuestForm()
        this.clearRemovedOptions(this.primaryGuest.attendingRehersal !== undefined)
      }
    })
  }

  createGuestForm(guestInfo: GuestInfo, isPrimary: boolean) {
    const guestTemplate = Object.entries(guestInfo).reduce((form, [key, value]) => {
      const defaultValue = isPrimary ? value : ''
      return { 
        ...form, 
        [key]: new FormControl(defaultValue, [Validators.required]) 
      }
    }, {} as GuestInfoForm)
    const formGroup = guestInfo && guestInfo.attendingRehersal
      ? { ...guestTemplate, attendingRehersal: ['', [Validators.required]] }
      : guestTemplate
    return new FormGroup<GuestInfoForm>(formGroup)
  }

  removeGuestForm() {
    this.guestsFormArray.removeAt(1, { emitEvent: true })
  }

  clearRemovedOptions(hasRehersalOption: boolean) {
    const primaryGuestForm = this.guestsFormArray.at(0)
    primaryGuestForm.patchValue({
      mealChoice: null,
      attendingBrunch: null,
      attendingRehersal: hasRehersalOption ? null : undefined
    })
  }

  onSubmit() {
    console.log("EVENT:", this.attendanceForm.value)
  }

  track(i: number) {
    return i
  }
}
