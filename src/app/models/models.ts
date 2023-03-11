import { FormControl } from "@angular/forms";
export interface GuestInfo {
    prefix: string;
    firstName: string;
    lastName: string;
    attendingWedding: boolean | null;
    mealChoice: string | null;
    attendingBrunch: boolean | null;
    attendingRehersal?: boolean | null;
}

type GuestWithRehersal = Record<keyof GuestInfo, FormControl<string | null>>
type GuestWithoutRehersal = Record<keyof Omit<GuestInfo, 'attendingRehersal'>, FormControl<string | null>>

export type GuestInfoForm = GuestWithRehersal | GuestWithoutRehersal

export type GuestInfoMin = Pick<GuestInfo, 'firstName'> & Pick<GuestInfo, 'lastName'> & Pick<GuestInfo, 'prefix'>

export type GuestSearch = {
    id: string;
    primary: GuestInfoMin;
    secondary: GuestInfoMin;
    hasResponded: boolean;
    hasRehersalOption: boolean;
    selected?: boolean;
    displayName?: string;
}