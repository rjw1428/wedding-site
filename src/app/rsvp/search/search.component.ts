import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Firestore, collectionData, getDoc } from '@angular/fire/firestore'
import { FormControl } from '@angular/forms';
import { collection, query, where, getDocs } from "firebase/firestore";
import { debounceTime, finalize, from, map, mergeMap, Observable, of, startWith, Subject, switchMap, take, tap } from 'rxjs';
import { GuestInfo } from '../form/guest-info';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  name = new FormControl()
  selectedGuest = new FormControl()
  search$ = new Subject<string>()
  guest$ = this.name.valueChanges.pipe(
    switchMap(() => this.search$.pipe(
      take(1),
      switchMap(name => getDocs(
        query(
          collection(this.firestore, 'guests'),
          where('hasResponded', '==', false),
          where('search', "array-contains-any", name.toLowerCase().split(' '))
        ))
      ),
      map(query => query.docs.map(doc => {
        const data = doc.data() as { primary: GuestInfo, secondary: GuestInfo }
        const displayName = data['secondary']
          ? `${data.primary.firstName} ${data.primary.lastName}/${data.secondary.firstName} ${data.secondary.lastName}`
          : `${data.primary.firstName} ${data.primary.lastName}/Guest`
        return { ...data, id: doc.id, displayName }
      })),
      startWith([]),
    ))
  )

  constructor(private firestore: Firestore) { }

  ngOnInit(): void {
    this.name.valueChanges.subscribe(val => {
      this.selectedGuest.setValue(null)
    })
  }

}
