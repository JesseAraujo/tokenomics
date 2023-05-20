import { Component, Input, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  @Input() linkIcon = 'info-circle';
  @Input() iconColor = '#3276b1';
  @Input() linkText: string = '';

  constructor() {}

  ngOnInit() {}
}
