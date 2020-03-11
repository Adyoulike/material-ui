import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EventListener from 'react-event-listener';
import keycode from 'keycode';
import Clock from './Clock';
import Dialog from '../Dialog';
import FlatButton from '../FlatButton';

class TimePickerDialog extends Component {
  static propTypes = {
    autoOk: PropTypes.bool,
    bodyStyle: PropTypes.object,
    cancelLabel: PropTypes.node,
    format: PropTypes.oneOf(['ampm', '24hr']),
    initialTime: PropTypes.object,
    minutesStep: PropTypes.number,
    okLabel: PropTypes.node,
    onAccept: PropTypes.func,
    onDismiss: PropTypes.func,
    onShow: PropTypes.func,
    style: PropTypes.object,
    timeZone: PropTypes.string,
  };

  static defaultProps = {
    okLabel: 'OK',
    cancelLabel: 'Cancel',
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    open: false,
  };

  show() {
    if (this.props.onShow && !this.state.open) this.props.onShow();
    this.setState({
      open: true,
    });
  }

  dismiss() {
    if (this.props.onDismiss && this.state.open) this.props.onDismiss();
    this.setState({
      open: false,
    });
  }

  handleRequestClose = () => {
    this.dismiss();
  };

  handleClickCancel = () => {
    this.dismiss();
  };

  handleClickOK = () => {
    if (this.props.onAccept) {
      this.props.onAccept(this.refs.clock.getSelectedTime());
    }
    this.setState({
      open: false,
    });
  };

  handleKeyUp = (event) => {
    switch (keycode(event)) {
      case 'enter':
        this.handleClickOK();
        break;
    }
  };

  render() {
    const {
      bodyStyle,
      initialTime,
      onAccept, // eslint-disable-line no-unused-vars
      format,
      autoOk,
      okLabel,
      cancelLabel,
      style,
      minutesStep,
      timeZone,
      ...other
    } = this.props;

    const styles = {
      root: {
        fontSize: 14,
        color: this.context.muiTheme.timePicker.clockColor,
      },
      dialogContent: {
        width: 280,
      },
      body: {
        padding: 0,
      },
    };

    const actions = [
      <FlatButton
        key={0}
        label={cancelLabel}
        primary={true}
        onClick={this.handleClickCancel}
      />,
      <FlatButton
        key={1}
        label={okLabel}
        primary={true}
        onClick={this.handleClickOK}
      />,
    ];

    const onClockChangeMinutes = autoOk === true ? this.handleClickOK : undefined;
    const open = this.state.open;

    return (
      <Dialog
        {...other}
        style={Object.assign(styles.root, style)}
        bodyStyle={Object.assign(styles.body, bodyStyle)}
        actions={actions}
        contentStyle={styles.dialogContent}
        repositionOnUpdate={false}
        open={open}
        onRequestClose={this.handleRequestClose}
      >
        {open &&
          <EventListener target="window" onKeyUp={this.handleKeyUp} />
        }
        {open &&
          <Clock
            ref="clock"
            format={format}
            initialTime={initialTime}
            onChangeMinutes={onClockChangeMinutes}
            minutesStep={minutesStep}
            timeZone={timeZone}
          />
        }
      </Dialog>
    );
  }
}

export default TimePickerDialog;