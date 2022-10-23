import { ChangeDetectionStrategy, Component, OnInit, Attribute } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {
  title = ''
  constructor(@Attribute('title') title: string) { 
    this.title = title
  }

  ngOnInit(): void {
  }

}
