import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  lineChartData = [
    {
      name: 'Series 1',
      series: [
        { name: '2010', value: 100 },
        { name: '2011', value: 200 },
      ],
    },
    {
      name: 'Series 2',
      series: [
        { name: '2010', value: 200 },
        { name: '2011', value: 300 },
      ],
    },
  ];
}
