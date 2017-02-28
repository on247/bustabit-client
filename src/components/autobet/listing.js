import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import browserSize from '../../core/browser-size'
import refresher from '../../refresher'

const { height } = browserSize;

let containerHeight = browserSize.isMobile() ?
	((height - (browserSize.topBarHeight() + browserSize.marginsHeight())) * browserSize.bottomWidgetHeight() ) - browserSize.previousCrashesHeight() - 60 + 'px' :
	((height - (browserSize.topBarHeight() + browserSize.marginsHeight()) ) * browserSize.betControlsHeight() ) - 106 +'px';
// Desktop: -41px from tabs (manual / auto) - 35px row (title and button) - 10px of internal margins -10px padding
// Mobile: 5px padding top, 10 px padding, 10px margin, 35px row title and button = 60

class Listing extends PureComponent {

	constructor() {
		super();
		this.state = {
			strategies: [
				{ id: 23, name: 'Martingale' },
				{ id: 24, name: 'Sniper' },
				{ id: 25, name: 'Pechino' },
				{ id: 26, name: 'Pechino' },
				{ id: 27, name: 'Pechino' },
				{ id: 28, name: 'Pechino' },
				{ id: 29, name: 'Pechino' },
				{ id: 30, name: 'Pechino' },
			]
		}
	}

	render() {
		const { strategies } = this.state;
		return (
			<div>
				<Row style={{paddingTop: '5px'}}>
					<Col xs={11} xsOffset={1}>
						<h5>Scripts:</h5>
					</Col>
					<Col xs={12}>
						<button className="btn btn-default" onClick={ this.props.onAdd }>
							<i className="fa fa-plus" aria-hidden="true"></i>
							Add
						</button>
					</Col>
				</Row>

				<div className="strategy-listing" style={{ height: containerHeight }}>
					<div className="list-group">
						{ strategies.map(strategy =>
							<Link className="list-group-item" to="" key={ strategy.id }>{ strategy.name }
								<span className="badge">Pro</span>
								<span style={{ float: 'right', marginLeft: '5px', marginRight: '5px'}}>
									<button className="btn btn-default btn-xs"><i className="fa fa-play" aria-hidden="true"></i></button>
									<button className="btn btn-info btn-xs"><i className="fa fa-edit" aria-hidden="true"></i></button>
									<button className="btn btn-danger btn-xs"><i className="fa fa-trash-o" aria-hidden="true"></i></button>
								</span>

							</Link>
							)
						}
					</div>
				</div>
			</div>
		);

	}

}

Listing.propTypes = {
	onAdd: PropTypes.func.isRequired
};


export default refresher(Listing,
	[browserSize, 'HEIGHT_CHANGED', 'WIDTH_CHANGED']
);