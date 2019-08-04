import PropTypes from 'prop-types';
import React, {
  PureComponent,
  SyntheticEvent
} from 'react';
import './index.css';
import { CloseProps } from 'jsplumb-react';

export default class Close extends PureComponent<CloseProps> {
  public static propTypes = {
    id: PropTypes.string,
    onClose: PropTypes.func,
    source: PropTypes.string,
    target: PropTypes.string
  };

  public static defaultProps: CloseProps = {
    id: undefined,
    source: undefined,
    target: undefined
  };

  //@ts-ignore
  private overlay: HTMLElement;

  public render() {
    const { id } = this.props;

    this.overlay = this.overlay || document.getElementById(id!);

    return (
      <div
        className='close-conn'
        onClick={this.handleClose}
        title={id || 'UNKNOWN'}
      >
        &#10005;
      </div>
    );
  }

  private handleClose = (event: SyntheticEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (this.props.onClose) {
      this.props.onClose(this.props.id!, this.props.source, this.props.target);
    }
  }
};