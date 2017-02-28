import React, { PropTypes, PureComponent } from 'react'
import { Link } from 'react-router';
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

// This is a component for Bootstrap clickable nav tabs. They need to be inside an <ul className="nav nav-tabs nav-justified"> tag (containing any desired Bootstrap classes). They may also contain Bootstrap tooltips as long as these are passed as props.

export default class Tab extends PureComponent {

  getPathName() {
    if (this.context.router.location.pathname) {
      console.log(this.context.router.location.pathname);
    }
  }

  render() {

    // determine if the route is active
    const isActive = this.context.router.location.pathname.startsWith(this.props.to);


    // add the bootstrap active class to the active links containing <li>
    const className = isActive ? 'active' : '';


    if (this.props.tooltip) {
      const toolTip = (
        <Tooltip id={this.props.tooltip}><strong>{this.props.tooltip}</strong></Tooltip>
      );
      return (
        <li className={className}>
          <OverlayTrigger placement="right" overlay={toolTip}>
            <Link to={this.props.to}>{this.props.children}</Link>
          </OverlayTrigger>
        </li>
      );
    } else {
      return (
        <li className={className}>
          <Link to={this.props.to}>{this.props.children}</Link>
        </li>
      );
    }
  }
}

Tab.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  tooltip: PropTypes.string
};

Tab.contextTypes = {
  router: PropTypes.object.isRequired
};
