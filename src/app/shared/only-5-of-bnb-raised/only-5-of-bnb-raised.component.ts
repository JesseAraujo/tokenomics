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
  public totalSupply: any = null;
  public hardcap: any = null;
  public presaleRate: any = null;
  public totalTokensForPresale = 0;
  public listingRate: any = null;
  public liquidityPercentageOnPancake: any = null;
  public totalTokensForLiquidity = 0;
  public tokenFee = 0;
  public totalTokensNeeded = 0;
  public youWillUseHowManyTotalSupply = 0;
  public totalBnbOwnerWallet = 0;
  public totalBnbPancakeSwap = 0;
  public presaleLiquidity: any = null;
  public team: any = null;
  public listTokenomics: any = [];
  public nameTokenomics: string = '';
  public valueTokenomics: any = null;
  public softCap = 0;
  public burnet = 0;
  public valueUnloked = 100;
  public safuContract = false;

  public isWork = 0;

  ngOnInit() {
    this.setListTokenomics();
  }

  handleCalcTotalTokensForPresale() {
    console.log('aaa');

    this.totalTokensForPresale = this.presaleRate * this.hardcap;

    this.softCap = (this.hardcap * 25) / 100;
  }

  handleCalcTotalTokensForLiquidity() {
    if (this.safuContract && this.liquidityPercentageOnPancake < 60) {
      alert('Error: Allowed value greater than or equal to 60');
      this.liquidityPercentageOnPancake = 60;
      return;
    }

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
        Name: 'Presale',
        Value: (this.totalTokensForPresale / this.totalSupply) * 100 || 0.0,
        IsEditable: false,
        Color: '#fd728f',
      },
      {
        Name: 'Liquidity',
        Value: (this.totalTokensForLiquidity / this.totalSupply) * 100 || 0.0,
        IsEditable: false,
        Color: '#039bfe',
      },
      {
        Name: 'Burnet',
        Value: this.burnet,
        IsEditable: true,
        Color: '#94a2af',
      },
      {
        Name: 'Unloked',
        Value: 100 - this.youWillUseHowManyTotalSupply,
        IsEditable: false,
        Color: '#ffcc56',
      },
    ];

    this.valueUnloked = 100 - this.youWillUseHowManyTotalSupply;

    this.chartTotalSupplyPercentage(this.listTokenomics);
    this.chartInToken(this.listTokenomics);
  }

  handleSetNewTokenomics(nameTokenomics: string, valueTokenomics: number) {
    if (valueTokenomics <= this.valueUnloked) {
      this.listTokenomics.push({
        Name: nameTokenomics,
        Value: valueTokenomics,
        IsEditable: true,
        Color: this.generateColor(),
      });

      this.listTokenomics
        .filter((n) => n.Name === 'Unloked')
        .map((element) => {
          element.Value = this.getTotalUnloked();
        });

      this.nameTokenomics = '';
      this.valueTokenomics = null;

      this.chartTotalSupplyPercentage(this.listTokenomics);
      this.chartInToken(this.listTokenomics);
    } else {
      let message =
        'Error: Informed value exceeds total allowed. There is only ' +
        this.valueUnloked.toFixed(4) +
        '% available to distribute';
      alert(message);
      this.valueTokenomics = null;
    }
  }

  handleSelectSafuContract() {
    if (!this.safuContract) {
      this.liquidityPercentageOnPancake = 60;
    } else {
      this.liquidityPercentageOnPancake = null;
    }
  }

  handleSetValue(tokenomics, value) {
    tokenomics.Value = value;

    this.listTokenomics
      .filter((n) => n.Name === 'Unloked')
      .map((element) => {
        element.Value = this.getTotalUnloked();
      });

    this.chartTotalSupplyPercentage(this.listTokenomics);
    this.chartInToken(this.listTokenomics);
  }

  getTotalUnloked() {
    let total = 0;
    let totalUnloked = 0;

    this.listTokenomics.forEach((element) => {
      if (element.Name !== 'Unloked') {
        total = total + element.Value;
        totalUnloked = 100 - total;
      }
    });

    if (totalUnloked < 0) {
      this.listTokenomics[2].Value = 0;
      let message =
        'Error: Informed value exceeds total allowed. There is only ' +
        this.valueUnloked.toFixed(4) +
        '% available to distribute';
      alert(message);
      return this.getTotalUnloked();
    } else {
      this.valueUnloked = totalUnloked;
      return totalUnloked;
    }
  }

  generateColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  /////
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
      tooltip: {
        formatter: function () {
          const index = this.point.index;
          const ret = `
          <b>${this.point.name}</b><br>
          ${this.point.y?.toFixed(4)}%  <br>
          `;

          return ret;
        },
      },
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
            color: listTokenomics[i].Color,
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
    let totalSupply = this.totalSupply;

    let valueCategories: any = [];
    listTokenomics.forEach((element) => {
      valueCategories.push(element.Name);
    });

    Highcharts.chart('chartInToken', {
      chart: {
        type: 'column',
        height: 300,
        backgroundColor: '#00000000',
      },
      title: {
        text: '',
      },
      yAxis: {
        min: 0,
        title: {
          text: '',
        },
      },
      xAxis: {
        categories: valueCategories,
      },
      tooltip: {
        formatter: function () {
          const index = this.point.index;
          const ret = `
          <b>${this.point.name}</b><br>
          ${this.point.y?.toLocaleString('pt-BR')} <br>
          `;

          return ret;
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
            y: listTokenomics[i].Value?.toFixed(4) * totalSupply,
            color: listTokenomics[i].Color,
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
