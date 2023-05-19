import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-only-5-of-bnb-raised',
  templateUrl: './only-5-of-bnb-raised.component.html',
  styleUrls: [
    '../../app.component.scss',
    './only-5-of-bnb-raised.component.scss',
  ],
})
export class Only5OfBnbRaisedComponent implements OnInit {
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
  public presaleLiquidity = 0;
  public team = 0;
  public listTokenomics: any = [];
  public nameTokenomics: string = '';
  public valueTokenomics = 0;

  isWork = 0;

  ngOnInit() {
    this.setListTokenomics();
  }

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
    this.setListTokenomics();
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

  setListTokenomics() {
    this.listTokenomics = [
      {
        Name: 'Presale + Liquidity',
        Value: this.youWillUseHowManyTotalSupply,
        IsEditable: false,
      },
      {
        Name: 'Team',
        Value: 100 - this.youWillUseHowManyTotalSupply,
        IsEditable: false,
      },
    ];

    this.chartTotalSupplyPercentage(this.listTokenomics);
    this.chartInToken(this.listTokenomics);
  }

  handleSetNewTokenomics(nameTokenomics: string, valueTokenomics: number) {
    this.listTokenomics.push({
      Name: nameTokenomics,
      Value: valueTokenomics,
      IsEditable: true,
    });

    this.listTokenomics
      .filter((n) => n.Name === 'Team')
      .map((element) => {
        element.Value = element.Value - this.valueTokenomics;
      });

    this.nameTokenomics = '';
    this.valueTokenomics = 0;

    this.chartTotalSupplyPercentage(this.listTokenomics);
    this.chartInToken(this.listTokenomics);
  }

  chartTotalSupplyPercentage(listTokenomics) {
    let count = listTokenomics.length;

    Highcharts.chart('chartTotalSupplyPercentage', {
      chart: {
        type: 'pie',
        height: 300,
        backgroundColor: '#00000000',
      },
      title: {
        text: '',
      },
      tooltip: {},
      accessibility: {
        point: {
          valueSuffix: '%',
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
          },
        },
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      series: (function () {
        var series: any = [];
        var data: any = [];
        for (var i = 0; i < count; i++) {
          series.push({
            name: listTokenomics[i].Name,
            y: listTokenomics[i].Value,
          });
        }

        data.push({
          data: series,
        });

        return data;
      })(),
    });
  }

  chartInToken(listTokenomics) {
    let count = listTokenomics.length;

    Highcharts.chart('chartInToken', {
      chart: {
        type: 'bar',
        height: 300,
        backgroundColor: '#00000000',
      },
      title: {
        text: '',
      },
      tooltip: {},
      accessibility: {
        point: {
          valueSuffix: '%',
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
          },
        },
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      series: (function () {
        var series: any = [];
        var data: any = [];
        for (var i = 0; i < count; i++) {
          series.push({
            name: listTokenomics[i].Name,
            y: listTokenomics[i].Value,
          });
        }

        data.push({
          data: series,
        });

        return data;
      })(),
    });
  }
}
