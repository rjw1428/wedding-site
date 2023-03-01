import { FormControl } from "@angular/forms";

export interface GuestInfo {
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


export type GuestSearch = {
    id: string;
    primary: GuestInfo,
    secondary: GuestInfo,
    hasResponded: boolean
}