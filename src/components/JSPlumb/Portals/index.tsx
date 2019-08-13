import PropTypes from 'prop-types';
import React, {
  PureComponent
} from 'react';
import {
  generateConnectionId
} from '../util';
import { PortalsProps, Bridge } from 'jsplumb-react';

export default class Portals extends PureComponent<PortalsProps> {
  public static propTypes = {
    children: PropTypes.func.isRequired,
    connections: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      source: PropTypes.string.isRequired,
      target: PropTypes.string.isRequired
    })).isRequired,
    id: PropTypes.string.isRequired,
    onRemoveConnection: PropTypes.func.isRequired
  };

  public static defaultProps: PortalsProps = {
    //@ts-ignore
    children: undefined,
    connections: [],
    id: '',
    //@ts-ignore
    onRemoveConnection: undefined
  };

  public render() {

    //@ts-ignore
    return this.props.connections.map(({ id: connId, source, target }) => {
      const htmlId = generateConnectionId(this.props.id, connId);

      return (
        <Bridge
          id={htmlId}
          key={connId}
        >
          {this.props.children!(connId, source, target, this.props.onRemoveConnection)}
        </Bridge>
      );
    });
  }
}
