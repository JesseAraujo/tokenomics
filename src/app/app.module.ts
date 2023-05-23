import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import {
  CURRENCY_MASK_CONFIG,
  CurrencyMaskConfig,
  CurrencyMaskModule,
} from 'ng2-currency-mask';
import { OnlyNumbersDirective } from 'src/services/only-numbers.directive';
import { PresaleComponent } from './shared/presale/presale.component';
import { PresaleWhiteListComponent } from './shared/presale-whiteList/presale-whiteList.component';
import { SubscriptionComponent } from './shared/subscription/subscription.component';
import { FairLaunchComponent } from './shared/fairlaunch/fairlaunch.component';
import { PopoverModule } from './shared/popover/popover.module';
import { FunctionService } from 'src/services/function.service';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'left',
  allowNegative: true,
  decimal: '.',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: ',',
};

@NgModule({
  declarations: [
    AppComponent,
    PresaleComponent,
    PresaleWhiteListComponent,
    OnlyNumbersDirective,
    SubscriptionComponent,
    FairLaunchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CurrencyMaskModule,
    PopoverModule,
  ],
  providers: [
    FunctionService,
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: CustomCurrencyMaskConfig,
    },
  ],
  exports: [OnlyNumbersDirective],
  bootstrap: [AppComponent],
})
export class AppModule {}
