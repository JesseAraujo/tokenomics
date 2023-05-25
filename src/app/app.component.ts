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
  public isLoading = false;

  constructor(private functionServce: FunctionService) {}

  ngOnInit() {
    this.isDark = localStorage.getItem('Theme') === 'Dark';
    const video = <HTMLVideoElement>document.getElementById('idVideo');
    video?.play();

    if (this.isDark) {
      const $html = document.querySelector('html');
      $html?.classList.toggle('dark-mode');
      this.functionServce.themeObservable();
    }

    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
    }, 6000);
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
