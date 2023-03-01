import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Firestore, setDoc, doc, updateDoc } from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, filter, Subject } from 'rxjs';
import { ATTENDING, BRUNCH, MENU, REHERSAL } from './form.options';
import { GuestInfo, GuestInfoForm } from '../../models/models';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnChanges {
  @Input('selection') guestSelection: { id: string, primary: GuestInfo, secondary: GuestInfo }
  attendanceForm = this.fb.group({
    guests: this.fb.array([])
  })

  foodSelectionForm = this.fb.group({})
  formComplete$ = new BehaviorSubject(false)
  readonly menuOptions = MENU
  readonly weddingAttendance = ATTENDING
  readonly burnchAttendanceOptoins = BRUNCH
  readonly rehersalAttedanceOptions = REHERSAL
  constructor(
    private fb: FormBuilder,
    private firestore: Firestore
  ) {

  }
  get guestsFormArray() {
    return <FormArray>this.attendanceForm.get('guests')
  }

  ngOnChanges(): void {
    if (this.guestsFormArray.length) {
      this.removeGuestForm(1)
      this.removeGuestForm(0)
    }

    this.guestsFormArray.push(this.createGuestForm(this.guestSelection.primary, true))
    const hasSecondary = !!this.guestSelection.secondary
    const formTemplate = hasSecondary
      ? this.guestSelection.secondary
      : this.guestSelection.primary
    const secondaryForm = this.createGuestForm(formTemplate, hasSecondary)
    this.guestsFormArray.push(secondaryForm)
  }

  createGuestForm(guestInfo: GuestInfo, useDefaults: boolean) {
    const guestTemplate = Object.entries(guestInfo).reduce((form, [key, value]) => {
      const defaultValue = useDefaults ? value : ''
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

  removeGuestForm(index: number) {
    this.guestsFormArray.removeAt(index, { emitEvent: true })
  }

  onSubmit() {
    if (this.attendanceForm.invalid) {
      console.log("INVALID")
      console.log(this.attendanceForm)
      return
    }

    // SET STATE TO LOADING?

    const { guests } = this.attendanceForm.value as { guests: GuestInfo[] }
    const [primary, secondary] = guests
    const update = {
      primary,
      secondary,
      hasResponded: true
    }
    const val = doc(this.firestore, 'guests', this.guestSelection.id)
    updateDoc(val, update)
      .then(() => this.formComplete$.next(true))
      .catch(err => console.log(err))
  }
}
