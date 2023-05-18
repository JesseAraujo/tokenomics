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
}
