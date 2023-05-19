import {
  Directive,
  OnInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

declare var $: any;

@Directive({
  selector: '[OnlyNumbers]',
})
export class OnlyNumbersDirective implements OnInit {
  @Input() ngModel;

  @Output() ngModelChange = new EventEmitter();

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const elem = $(this.el.nativeElement);
    elem.off('blur');
    elem.on('blur', (event) => {
      if (this.ngModel) {
        if (isNaN(+this.ngModel)) {
          this.ngModel = null;
        }
      }
      this.ngModelChange.emit(this.ngModel);
    });

    elem.off('keypress');
    elem.on('keypress', (event) => {
      return this.isNumber(event);
    });
  }

  isNumber(event): boolean {
    const value = event.key;
    // event.preventDefault();
    const reg = new RegExp(/^[0-9]+$/i);

    // Special keys, TAB, Backspace ... etc
    if (
      event.keyCode === 8 ||
      event.keyCode === 7 ||
      event.keyCode === 9 ||
      event.keyCode === 13
    ) {
      // validate before call add api.
      return true;
    } else if (!reg.test(value)) {
      return false;
    } else {
      return true;
    }
  }
}
