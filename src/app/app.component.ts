import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FunctionService } from 'src/services/function.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public stepTokenomics = 1;
  public isDark = false;
  public subscription: Subscription[] = [];

  constructor(private functionServce: FunctionService) {}

  ngOnInit() {
    this.isDark = localStorage.getItem('Theme') === 'Dark';

    if (this.isDark) {
      const $html = document.querySelector('html');
      $html?.classList.toggle('dark-mode');
      this.functionServce.themeObservable();
    }
  }

  handleSetStepTokenomics(step: number) {
    this.stepTokenomics = step;
  }

  handleSetTheme(isDark = false) {
    if (isDark !== this.isDark) {
      this.isDark = isDark;
      const $html = document.querySelector('html');
      $html?.classList.toggle('dark-mode');

      if (this.isDark) {
        localStorage.setItem('Theme', 'Dark');
      } else {
        localStorage.setItem('Theme', 'Light');
      }
    }

    this.functionServce.themeObservable();
  }
}
