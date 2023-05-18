import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
 public stepTokenomics = 1


 handleSetStepTokenomics(step: number) {
  this.stepTokenomics = step
 }
}
