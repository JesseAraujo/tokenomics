import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Observable, Subscription } from 'rxjs';
import { FunctionService } from 'src/services/function.service';

@Component({
  selector: 'app-presale',
  templateUrl: './presale.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class PresaleComponent implements OnInit {
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
  public is5Bnb = true;
  public isWork = 0;
  public isDark = false;
  public subscription: Subscription[] = [];

  constructor(private functionService: FunctionService) {}

  ngOnInit() {
    this.setListTokenomics();
    this.isDark = localStorage.getItem('Theme') === 'Dark';

    this.subscription.push(
      this.functionService.theme$.subscribe((ret) => {
        this.isDark = ret === 'Dark';
      })
    );
  }

  handleCalcTotalTokensForPresale() {
    this.totalTokensForPresale = this.presaleRate * this.hardcap;
    this.softCap = (this.hardcap * 25) / 100;

    this.handleCalcTotalTokensForLiquidity();
  }

  handleCalcTotalTokensForLiquidity() {
    if (this.totalSupply) {
      if (this.safuContract && this.liquidityPercentageOnPancake < 60) {
        alert('Error: Allowed value greater than or equal to 60');
        this.liquidityPercentageOnPancake = 60;
        return;
      }

      this.totalTokensForLiquidity =
        this.hardcap *
        (this.is5Bnb ? 0.95 : 0.98) *
        this.listingRate *
        (this.liquidityPercentageOnPancake / 100);

      if (!this.is5Bnb) {
        this.tokenFee = this.presaleRate * this.hardcap * 0.02;
      }

      this.calcTotalTokensNeeded();
    }
  }

  calcTotalTokensNeeded() {
    this.totalTokensNeeded =
      (this.is5Bnb ? 1 : 1.02) * (this.presaleRate * this.hardcap) +
      ((this.is5Bnb ? 0.95 : 0.98) *
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
      this.hardcap *
      (1 - this.liquidityPercentageOnPancake / 100) *
      (this.is5Bnb ? 0.95 : 0.98);
    this.totalBnbPancakeSwap =
      this.hardcap *
      (this.liquidityPercentageOnPancake / 100) *
      (this.is5Bnb ? 0.95 : 0.98);
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
        Value: this.is5Bnb
          ? (this.totalTokensForLiquidity / this.totalSupply) * 100 || 0.0
          : this.youWillUseHowManyTotalSupply -
              (this.totalTokensForPresale / this.totalSupply) * 100 || 0.0,
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
        this.valueUnloked.toFixed(2) +
        '% available to distribute';
      alert(message);
      this.valueTokenomics = null;
    }
  }

  handleSelectSafuContract() {
    if (!this.safuContract) {
      this.liquidityPercentageOnPancake = 60;
      this.handleCalcTotalTokensForPresale();
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
        this.valueUnloked.toFixed(2) +
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

  handleSetBnb(is5Bnb = false) {
    this.is5Bnb = is5Bnb;
    this.handleCalcTotalTokensForPresale();
  }

  handleDonwloadImage() {
    this.functionService.donwloadImage(
      'presale',
      this.is5Bnb ? 'presale_5%_BNB' : 'presale_2%_BNB_+_2%_TOKEN'
    );
  }

  /////
  chartTotalSupplyPercentage(listTokenomics) {
    this.chartTotalSupplyPercentageToExport(listTokenomics);

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
          ${this.point.y?.toFixed(2)}%  <br>
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
            enabled: true,
            format:
              '<div class="name-pie">{point.name}</div><br><div class="value-pie">{point.percentage:.2f} %</div>',
            distance: -50,
            filter: {
              property: 'percentage',
              operator: '>',
              value: 4,
            },
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
    this.chartInTokenToExport(listTokenomics);

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
          ${this.point.y?.toLocaleString('ng-US')} <br>
          `;

          return ret;
        },
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            formatter: function () {
              const index = this.point.index;
              const ret = ` <div class="value-chart">
              ${this.point.y?.toLocaleString('ng-US')}</div>
              `;

              return ret;
            },
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
            y: (listTokenomics[i].Value.toFixed(2) * totalSupply) / 100,
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

  /////
  /////
  /////
  /////
  /////
  /////
  //-to-export------------------------------------------------------------------------------------------------
  chartTotalSupplyPercentageToExport(listTokenomics) {
    let count = listTokenomics.length;

    Highcharts.chart('chartTotalSupplyPercentageToExport', {
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
          ${this.point.y?.toFixed(2)}%  <br>
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
            enabled: true,
            format:
              '<div class="name-pie">{point.name}</div><br><div class="value-pie">{point.percentage:.2f} %</div>',
            distance: -50,
            filter: {
              property: 'percentage',
              operator: '>',
              value: 4,
            },
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

  chartInTokenToExport(listTokenomics) {
    let count = listTokenomics.length;
    let totalSupply = this.totalSupply;

    let valueCategories: any = [];
    listTokenomics.forEach((element) => {
      valueCategories.push(element.Name);
    });

    Highcharts.chart('chartInTokenToExport', {
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
          ${this.point.y?.toLocaleString('ng-US')} <br>
          `;

          return ret;
        },
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            formatter: function () {
              const index = this.point.index;
              const ret = ` <div class="value-chart">
              ${this.point.y?.toLocaleString('ng-US')}</div>
              `;

              return ret;
            },
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
            y: (listTokenomics[i].Value.toFixed(2) * totalSupply) / 100,
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
