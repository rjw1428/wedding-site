import { ChangeDetectionStrategy, Component, ContentChild, OnInit, Attribute } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleComponent implements OnInit {
  titleArr: string[] = []
  constructor(@Attribute('title') title: string) {
    this.titleArr = title ? title.split(' ') : []
  }

  ngOnInit(): void {
  }

}
