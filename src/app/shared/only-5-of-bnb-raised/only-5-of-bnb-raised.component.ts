import { Component } from '@angular/core';

@Component({
  selector: 'app-only-5-of-bnb-raised',
  templateUrl: './only-5-of-bnb-raised.component.html',
  styleUrls: [
    '../../app.component.scss',
    './only-5-of-bnb-raised.component.scss',
  ],
})
export class Only5OfBnbRaisedComponent {
  public totalSupply = 0;
  public hardcap = 0;
  public presaleRate = 0;
  public totalTokensForPresale = 0;
  public listingRate = 0;
  public liquidityPercentageOnPancake = 0;
  public totalTokensForLiquidity = 0;
  public tokenFee = 0;
  public totalTokensNeeded = 0;
  public youWillUseHowManyTotalSupply = 0;
  public totalBnbOwnerWallet = 0;
  public totalBnbPancakeSwap = 0;

  isWork = 0;

  handleCalcTotalTokensForPresale() {
    this.totalTokensForPresale = this.presaleRate * this.hardcap;
  }

  handleCalcTotalTokensForLiquidity() {
    this.totalTokensForLiquidity =
      this.hardcap *
      0.95 *
      this.listingRate *
      (this.liquidityPercentageOnPancake / 100);

    this.calcTotalTokensNeeded();
  }

  calcTotalTokensNeeded() {
    this.totalTokensNeeded =
      1 * (this.presaleRate * this.hardcap) +
      (0.95 *
        (this.listingRate * this.hardcap) *
        this.liquidityPercentageOnPancake) /
        100;

    this.calcIsWork();
    this.calcTotalBnb();
  }

  calcIsWork() {
    this.isWork = this.totalSupply - this.totalTokensNeeded;
    this.youWillUseHowManyTotalSupply =
      (this.totalTokensNeeded / this.totalSupply) * 100;
  }

  calcTotalBnb() {
    this.totalBnbOwnerWallet =
      this.hardcap * (1 - this.liquidityPercentageOnPancake / 100) * 0.95;
    this.totalBnbPancakeSwap =
      this.hardcap * (this.liquidityPercentageOnPancake / 100) * 0.95;
  }
}
