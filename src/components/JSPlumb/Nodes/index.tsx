import PropTypes from 'prop-types';
import {
  Children,
  cloneElement,
  PureComponent
} from 'react';
import { NodesProps } from 'jsplumb-react';

export default class Nodes extends PureComponent<NodesProps> {
  public static propTypes = {
    id: PropTypes.string.isRequired,
    jsPlumb: PropTypes.object.isRequired,
    onRender: PropTypes.func.isRequired,
    onSelect: PropTypes.func
  };

  public render() {
    return Children.map(
      this.props.children,
      (child: any) => {
        this.props.onRender(child.props.id);

        const props = {
          diagramId: this.props.id,
          jsPlumb: this.props.jsPlumb,
          onSelect: child.props.onSelect || this.props.onSelect
        };

        return (cloneElement(child, props));
      }
    );
  }
}