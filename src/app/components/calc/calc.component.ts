import { SelectedId } from './../../models/currency.model';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.scss'],
})
export class CalcComponent implements OnInit {
  @Input() selectedId!: SelectedId;
  calcForm!: FormGroup;
  ngOnInit(): void {
    this.calcForm = new FormGroup({
      from: new FormControl(1),
      to: new FormControl(this.selectedId.rate),
    });

    this.calcForm.
  }
  
}
