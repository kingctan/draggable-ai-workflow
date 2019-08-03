import React, { useState, useEffect, CSSProperties, SyntheticEvent, Children, cloneElement, PureComponent } from 'react';
import { jsPlumbInstance, } from 'jsplumb';
import panAndZoomHoc from 'react-pan-and-zoom-hoc';

type Props = {
  id: string
  jsPlumb: jsPlumbInstance
  onRender: (id: string) => void
  onSelect?: (args: any) => void
};

export default class Nodes extends PureComponent<Props> {
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
};


// //@ts-ignore
// const Nodes: PureComponent<Props, any> = ({ props, state }: any) => {

//   const { id, jsPlumb, onRender, onSelect, children } = props;

//   useEffect(() => {

//   }, []);

//   return Children.map(
//     children,
//     (child: any) => {
//       onRender(child.props.id);

//       const props = {
//         diagramId: id,
//         jsPlumb,
//         onSelect: child.props.onSelect || onSelect
//       };

//       return (cloneElement(child, props));
//     }
//   );
// };

// export default Nodes;