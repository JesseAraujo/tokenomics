import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Only5OfBnbRaisedComponent } from './shared/only-5-of-bnb-raised/only-5-of-bnb-raised.component';
import { FormsModule } from '@angular/forms';
import {
  CURRENCY_MASK_CONFIG,
  CurrencyMaskConfig,
  CurrencyMaskModule,
} from 'ng2-currency-mask';
import { OnlyNumbersDirective } from 'src/services/only-numbers.directive';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  decimal: ',',
  precision: 4,
  prefix: '',
  suffix: '',
  thousands: '.',
};

@NgModule({
  declarations: [AppComponent, Only5OfBnbRaisedComponent, OnlyNumbersDirective],
  imports: [BrowserModule, AppRoutingModule, FormsModule, CurrencyMaskModule],
  providers: [
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: CustomCurrencyMaskConfig,
    },
  ],
  exports: [OnlyNumbersDirective],
  bootstrap: [AppComponent],
})
export class AppModule {}
