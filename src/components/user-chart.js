import React, { Component, PropTypes } from 'react'
import ReactHighcharts from 'react-highcharts'
import socket from '../socket';
import { formatBalance } from '../util/belt'

const redColor = '#ff5a5f';
const greenColor = '#2ecc71';

export default class UserChart extends Component {

	constructor(props) {
		super(props);
		this.unmounted = false;
		this.state = {
			uname: this.props.uname,
			series: []
		};
	}

	componentWillMount() {
		socket.send('getUserBets', this.props.uname)
			.then(userBets => {
				//console.log('the info from server is: ',userBets);
				if (this.unmounted) return;
				let profitAccumulator = this.props.totalProfit;
				let numberOfBets = this.props.numberOfBets;
				let series = userBets.map(bet => {
					const profit = bet.wager * (bet.cashOut - 1);
					profitAccumulator -= profit;
					numberOfBets -= 1;


					return  {
						y: Math.round(profitAccumulator + profit)/100,
						x: (numberOfBets + 1),
						id: bet.id,
						gameId: bet.gameId,
						bet: formatBalance(bet.wager),
						cashOut: bet.cashOut,
						gameBust: bet.gameBust,
						profit,
						color: 'pink',
						marker: { fillColor: '#FF9933' }
					};
				});

				series.reverse();
				//console.log('series is: ',series);
				this.setState({ series })

			});
	}
	componentWillUnmount(){
		this.unmounted = true;
	}

	getConfig() {

		let { series } = this.state;

		for (let i = 0; i < series.length; i++) {
			series[i].color = series[i].profit > 0 ? greenColor : redColor;
			series[i].marker.fillColor = series[i].profit > 0 ? greenColor : redColor;
		}

		let zones = series.map(d => {
			let color = d.profit >= 0 ? greenColor : redColor;
			return {
				value: d.x,
				color
			}
		});

		return {
			chart: {
				backgroundColor: 'transparent',
			},
			title: {
				text: ''
			},
			xAxis: {
				categories: null,
				allowDecimals: false
			},
			yAxis: {
				title: {
					text: 'Cumulative Net Profit'
				}
			},
			tooltip: {
				shared: false,
				useHTML: true,
				headerFormat: '<small>{point.key}</small><table>',
				formatter: function(){
					return (
						'Game Id: <b>'+ this.point.gameId +'</b><br/>' +
						'Bet: <b>'+ this.point.bet +( this.point.bet < 2 ? ' bit' : ' bits' )+'</b><br/>' +
						'Bust: <b>'+ this.point.gameBust +'x </b><br/>' +
						'Cashed Out: <b>'+ (this.point.cashOut === 0 ? '-' : (this.point.cashOut+'x')) +'</b><br/>' +
						'Profit: <span style="color:'+this.point.color+'"><b>'+ formatBalance(this.point.profit) +
						( Math.abs(this.point.profit/100) < 2 ? ' bit' : ' bits' ) +'</b></span><br/>' +
						'Net Profit: <b>'+ this.y + ( Math.abs(this.y) < 2 ? ' bit' : ' bits' ) +' </b><br/>'
					)
				},
				borderColor: null,
			},
			series: [{
				data: series,
				zoneAxis: 'x',
				zones
			}],
			credits: {
				enabled: false
			},
			legend: {
				enabled: false
			}
		};
	}


  render() {

    return (
        <ReactHighcharts config={this.getConfig()}></ReactHighcharts>
    )
  }
}

UserChart.propTypes = {
	uname: PropTypes.string.isRequired,
	numberOfBets: PropTypes.number.isRequired,
	totalProfit: PropTypes.number.isRequired

};