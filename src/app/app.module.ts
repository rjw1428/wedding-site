import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TitleComponent } from './components/title/title.component';
import { ScrollIndicatorComponent } from './components/scroll-indicator/scroll-indicator.component';
import { HomeComponent } from './pages/home/home.component';
import { StoryComponent } from './pages/story/story.component';
import { LocationComponent } from './pages/location/location.component';
import { AccomodationsComponent } from './pages/accomodations/accomodations.component';
import { ItineraryComponent } from './pages/itinerary/itinerary.component';
import { LinksComponent } from './pages/links/links.component';
import { CardComponent } from './components/card/card.component';
import { CountdownComponent } from './pages/countdown/countdown.component';
import { DialComponent } from './components/dial/dial.component';

@NgModule({
  declarations: [
    AppComponent,
    TitleComponent,
    ScrollIndicatorComponent,
    HomeComponent,
    StoryComponent,
    LocationComponent,
    AccomodationsComponent,
    ItineraryComponent,
    LinksComponent,
    CardComponent,
    CountdownComponent,
    DialComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
