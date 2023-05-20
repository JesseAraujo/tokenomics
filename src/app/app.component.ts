import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public stepTokenomics = 1;
  public isDark = false;

  ngOnInit() {
    this.isDark = localStorage.getItem('Theme') === 'Dark';

    if (this.isDark) {
      const $html = document.querySelector('html');
      $html?.classList.toggle('dark-mode');
    }
  }

  handleSetStepTokenomics(step: number) {
    this.stepTokenomics = step;
  }

  handleSetTheme() {
    this.isDark = !this.isDark;
    const $html = document.querySelector('html');
    $html?.classList.toggle('dark-mode');

    if (this.isDark) {
      localStorage.setItem('Theme', 'Dark');
    } else {
      localStorage.setItem('Theme', 'Light');
    }
  }
}
