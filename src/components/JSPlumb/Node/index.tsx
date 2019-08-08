import PropTypes from 'prop-types';
import React, {
  CSSProperties,
  PureComponent
} from 'react';
import { generateNodeId } from '../util';
import './index.css';
import { NodeProps, NodeState } from 'jsplumb-react';
import { Popover, Button, Descriptions, Tag } from 'antd';
import { OperatorModelProps } from '../../../modules/operator/OperatorProps';
import { FlowNodeProps } from '../../../modules/workflow/WorkflowProps';

const defaultDragSettings = {

};
const defaultSourceSettings = {
  anchor: 'BottomCenter',
  connector: ["Bezier", { curviness: 50 }],
  isSource: true,
  endpoint: "Dot",
  connectorStyle: {
    strokeWidth: 2,
    stroke: "#c4c4c4",
    joinstyle: "round",
    outlineStroke: "transparent",
    outlineWidth: 4
  },
  connectorHoverStyle: {
    strokeWidth: 3,
    stroke: "#216477",
  },
  paintStyle: {
    radius: 7,
    strokeWidth: 5
  },
  hoverPaintStyle: {
    fill: "#5C87FF",
    stroke: "#5C87FF"
  },
  maxConnections: -1,
  dragOptions: {},
};
const defaultTargetSettings = {
  anchor: 'TopCenter',
  isTarget: true,
  endpoint: "Dot",
  paintStyle: {
    radius: 7,
    strokeWidth: 5
  },
  hoverPaintStyle: {
    fill: "#5C87FF",
    stroke: "#5C87FF",
  }
};

type NodePropsFData = {
  selected: boolean
  type: 'both' | 'source' | 'target'
  icon: string
  label: string
};

type CustomNodeProps = {
  model: OperatorModelProps
  style: CSSProperties
  onSelect: (selectedNode: FlowNodeProps) => void
  onDelete: (nodeId: string) => void
};

export default class Node extends PureComponent<NodeProps & NodePropsFData & CustomNodeProps, NodeState> {
  public static propTypes = {
    allowLoopback: PropTypes.bool,
    children: PropTypes.func,
    className: PropTypes.string,
    diagramId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    jsPlumb: PropTypes.object,
    onDrag: PropTypes.func,
    onDrop: PropTypes.func,
    onSelect: PropTypes.func,
    onDelete: PropTypes.func,
    style: PropTypes.object,
    styleName: PropTypes.string,
    targetSettings: PropTypes.object,
    label: PropTypes.string,
    icon: PropTypes.string,
    selected: PropTypes.bool,
    type: PropTypes.oneOf([
      'both',
      'source',
      'target'
    ])
  };

  public static defaultProps: NodeProps = {
    allowLoopback: false,
    children: () => (<div />),
    className: 'jsplumb-react-node',
    diagramId: '',
    dragSettings: defaultDragSettings,
    id: '',
    sourceSettings: defaultSourceSettings,
    style: {
      left: 0,
      top: 0
    },
    styleName: '',
    targetSettings: defaultTargetSettings,
    type: 'both',
  };

  public state = {
    drag: true
  };

  private connectionFilter = ':not(.jsplumb-react-node)';
  private dragFilter = ':not(.jsplumb-react-node)';
  //@ts-ignore
  private timeout: NodeJS.Timer;
  private style: CSSProperties = {};
  private drop: boolean = false;
  //@ts-ignore
  private node: HTMLElement;

  public componentDidMount() {
    const { type } = this.props;

    if (type === 'both' || type === 'source') { this.addSourceEndPoints(); }
    if (type === 'both' || type === 'target') { this.addTargetEndPoints(); }

    this.makeNodeDraggable();
    //@ts-ignore
    this.style = this.props.style;
  }

  public componentWillUnmount() {
    clearTimeout(this.timeout);
    this.handleDeselect();
    this.props.jsPlumb!.removeAllEndpoints(this.node);
    //@ts-ignore
    this.node = undefined;
  }

  public render() {
    const { children, className, diagramId, id, style, styleName, type, label, icon, model, onDelete } = this.props;
    // const { drag } = this.state;

    return (
      <div
        className={`${className} ${styleName ? styleName : ''}`}
        id={generateNodeId(diagramId!, id)}
        onPointerUp={this.handlePrevent}
        onPointerDown={this.handlePointerDown}
        ref={this.ref}
        style={style}
      >
        <div className="node-anchor-disabled">
          {(type === 'target' || type === 'both') && <div className="dot-rect-top"></div>}
          {(type === 'source' || type === 'both') && <div className="dot-rect-bottom"></div>}
          <div>
            {children}
          </div>
          <strong>
            <i className={`iconfont ${icon} node-icon`}></i>
            <span>{label}</span>
          </strong>
        </div>
        <Popover
          placement="rightBottom"
          title={label}
          content={
            <div style={{ maxWidth: 240 }}>
              <Descriptions title="" column={1} size="small">
                <Descriptions.Item label="输入">
                  {model && model.inputs && Object.keys(model.inputs).map((key: string) => <Tag >{key} ({model.inputs[key].type})</Tag>)}
                </Descriptions.Item>
                <Descriptions.Item label="输出">
                  {model && model.outputs && Object.keys(model.outputs).map((key: string) => <Tag >{key} ({model.outputs[key].type})</Tag>)}
                </Descriptions.Item>
                <Descriptions.Item label="操作">
                  <Button type="danger" size="small" onClick={() => onDelete(id)}>删除</Button>
                </Descriptions.Item>
              </Descriptions>
            </div>
          }
        >
          <span className="node-meta el-tooltip">
            ...
          </span>
        </Popover>
      </div>

    );
  }

  private ref = (node: HTMLDivElement) => (this.node = node);

  private handlePrevent = (event: any) => {
    if (
      // @ts-ignore
      !(
        event.ctrlKey ||
        (event.touches && event.targetTouches.length > 1)
      ) &&
      (
        !this.drop &&
        this.style.left === this.props.style!.left &&
        this.style.top === this.props.style!.top
      )
    ) {
      this.setState({ drag: false });
      clearTimeout(this.timeout);
      this.timeout = setTimeout(
        () => {
          return this.node && this.setState({ drag: true });
        },
        500
      );
    }
  }

  private handlePointerDown = (event: any) => {
    //@ts-ignore
    this.style = this.props.style;
    this.handleSelect(
      event.ctrlKey ||
      (event.touches && event.targetTouches.length > 1)
    );
  }

  private handleSelect = (multiSelect?: boolean) => {
    const { jsPlumb, id, style, type, label, icon, model, onSelect } = this.props;

    if (!multiSelect) {
      // @ts-ignore
      jsPlumb.clearDragSelection();
    }

    // @ts-ignore
    jsPlumb.addToDragSelection(this.node);

    if (onSelect) {
      // @ts-ignore
      const selections = jsPlumb._katavorio_main
        .getSelection()
        .map((node: any) => (
          node.params.id
        ));

      onSelect({ id, style, type, label, icon, model });
    }
  }

  private handleDeselect = () => {
    const { id, jsPlumb, onSelect } = this.props;

    // @ts-ignore
    jsPlumb.removeFromDragSelection(this.node);

    if (onSelect) {
      // @ts-ignore
      const selections: string[] = jsPlumb._katavorio_main
        .getSelection()
        .map((node: any) => (
          node.params.id
        ))
        .filter((nodeId: string) => {
          return (nodeId !== id);
        });

      onSelect(selections);
    }
  }

  private addSourceEndPoints = () => {
    const { sourceSettings, id, diagramId, jsPlumb } = this.props;

    // jsPlumb!.makeSource(this.node, {
    //   filter: this.connectionFilter,
    //   ...sourceSettings,
    //   parameters: {
    //     ...sourceSettings!.parameters,
    //     source: id
    //   }
    // });

    jsPlumb!.addEndpoint(
      generateNodeId(diagramId!, id),
      sourceSettings as any,
    )
  }

  private addTargetEndPoints = () => {
    const { allowLoopback, id, jsPlumb, targetSettings } = this.props;

    jsPlumb!.makeTarget(this.node, {
      allowLoopback,
      ...targetSettings,
      dropOptions: {
        hoverClass: 'dragHover',
        ...targetSettings!.dropOptions
      },
      parameters: {
        ...targetSettings!.parameters,
        target: id
      }
    });
  }

  private makeNodeDraggable = () => {
    const { dragSettings, id, jsPlumb } = this.props;
    jsPlumb!.draggable(this.node, {
      filter: this.dragFilter,
      ...dragSettings,
      drag: this.handleDrag,
      // Hacky, but only way found to pass id to `.getSelection()`
      // @ts-ignore
      id,
      stop: this.handleDrop
    });
  }

  private handleDrag = (params: Katavorio_DragEventOptions) => {
    this.drop = true;
    if (
      this.props.style!.left !== params.pos[0] ||
      this.props.style!.top !== params.pos[1]
    ) {
      if (this.props.onDrag) {
        this.props.onDrag(this.props.id, params.pos[0], params.pos[1]);
      }
    }
  }

  private handleDrop = (params: Katavorio_DragEventOptions) => {
    this.drop = false;
    if (
      this.props.style!.left !== params.pos[0] ||
      this.props.style!.top !== params.pos[1]
    ) {
      if (this.props.onDrop) {
        this.props.onDrop(this.props.id, params.pos[0], params.pos[1]);
      }
    }
  }
}