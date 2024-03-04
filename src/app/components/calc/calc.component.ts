import { SelectedId } from './../../models/currency.model';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.scss'],
})
export class CalcComponent implements OnInit, OnChanges, OnDestroy {
  @Input() selectedId!: SelectedId;
  calcForm!: FormGroup;
  rate!: number;
  fromSub!: Subscription | undefined;
  toSub!: Subscription | undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedId']) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    if (this.selectedId) {
      this.calcForm = new FormGroup({
        from: new FormControl(1),
        to: new FormControl(this.selectedId?.rate),
      });

      this.fromSub = this.calcForm
        .get('from')
        ?.valueChanges.subscribe((value) => {
          const convertedValue = value * this.selectedId.rate;
          this.calcForm
            .get('to')
            ?.setValue(convertedValue, { emitEvent: false });
        });

      this.toSub = this.calcForm.get('to')?.valueChanges.subscribe((value) => {
        const convertedValue = value / this.selectedId.rate;
        this.calcForm
          .get('from')
          ?.setValue(convertedValue, { emitEvent: false });
      });
    }
  }

  ngOnDestroy(): void {
    if (this.fromSub || this.toSub) {
      this.fromSub?.unsubscribe();
      this.toSub?.unsubscribe();
    }
  }
}
