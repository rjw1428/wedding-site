import { ChangeDetectionStrategy, Component, ContentChild, OnInit, Attribute, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleComponent implements OnInit {
  titleArr: string[] = []
  constructor(
    @Attribute('title') title: string,
    @Attribute('split') split: string
  ) {
    if (!title) {
      console.error('Missing title')
    }
    this.titleArr = title && split == '' ? title.split(' ') : [title]
  }

  ngOnInit(): void {
  }

}
