import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class FunctionService {
  private theme = new Subject();
  public theme$ = this.theme.asObservable();

  donwloadImage(id: string, name: string) {
    const containerFile = document.getElementById(id)!;
    const fileName = `${name}.jpg`;

    html2canvas(containerFile, { allowTaint: true }).then(function (canvas) {
      var img = document.createElement('a');
      document.body.appendChild(img);
      img.download = fileName;
      img.href = canvas.toDataURL();
      img.target = '_blank';
      img.click();
    });
  }

  themeObservable() {
    this.theme.next(localStorage.getItem('Theme')!);
  }
}
