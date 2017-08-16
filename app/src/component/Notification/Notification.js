'use strict';

/**
 * @official
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

/**
 * @inject
 */
import './Notification.stylus';

export default class Notification extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {
    type: PropTypes.string.isRequired,
    msg: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    callBack: PropTypes.func,
  };

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {}

  render() {
    const {msg, type} = this.props;
    return (
      <div className="notification-wrapper">
        <div className="body slideInDown animation">
          <div className="content">
            <i className={`icon icon-${type}`} />
            <span>
              {msg}
            </span>
          </div>
        </div>
      </div>
    );
  }
}