import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class QuotesComponent {}
