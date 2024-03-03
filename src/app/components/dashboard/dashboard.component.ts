import { Component, Input } from '@angular/core';
import { LineChartData } from 'src/app/models/currency.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  @Input() lineChartDatas!: LineChartData[][];

  @Input() selectedTab!: LineChartData[] | undefined;
}
