import { v4 } from 'uuid';
import { generateConnectionId } from './util';

const COLOR_ENDPOINT = '#5C87FF';

const EndpointStyleSource = {
  radius: 7,
  strokeWidth: 5,
};

const EndpointStyleTarget = {
  radius: 7,
  strokeWidth: 5
};

const EndpointHoverStyleSource = {
  ...EndpointStyleSource,
  fill: COLOR_ENDPOINT,
  stroke: COLOR_ENDPOINT,
};

const EndpointHoverStyleTarget = {
  ...EndpointStyleTarget,
  fill: COLOR_ENDPOINT,
  stroke: COLOR_ENDPOINT,
};

// const PaintStyle = {
//   lineWidth: 3,
//   radius: 5,
//   stroke: 'black',
//   strokeWidth: 1
// };

// const HoverPaintStyle = {
//   stroke: 'red',
//   strokeWidth: 2
// };

const renderOverlay = (component: any) => {
  component._jsPlumb.parameters.id = component._jsPlumb.parameters.id || v4();
  const el = document.createElement('div');
  el.setAttribute(
    'id',
    generateConnectionId(
      component.source.parentElement.parentElement.id,
      component._jsPlumb.parameters.id || v4()
    )
  );
  return el;
};

export default {
  Anchor: ['Continuous', {}],
  Anchors: [['Continuous', {}], ['Continuous', {}]],
  ConnectionOverlays: [
    ["Arrow", {
      location: 1,
      visible: true,
      width: 11,
      length: 11,
      id: "ARROW",
    }],
    [
      "Label", {
        location: 0.5,
        id: "label-connector",
        label: '<span class="error-icon-connect green-icon">i</span>',
        cssClass: "workflow-node-label",
        visible: false,
      }],
    [
      "Label", {
        location: 0.6,
        label: '<span class="delete-icon-connect iconfont icon-delete"></span>',
        id: "delete-connector",
        cssClass: "workflow-node-delete",
        visible: false,
        events: {
          tap: function (e: any) {
            // //@ts-ignore
            // const plumb = this._jsPlumb.instance;
            // //@ts-ignore
            // plumb.deleteConnection(this.component)
            // console.log(this);
          }
        },
      }]
  ],
  Endpoint: ['Dot', { radius: 5 }],
  EndpointHoverStyle: EndpointHoverStyleSource,
  EndpointHoverStyles: [EndpointHoverStyleSource, EndpointHoverStyleTarget],
  EndpointStyle: EndpointStyleSource,
  EndpointStyles: [EndpointStyleSource, EndpointStyleTarget],
  // HoverPaintStyle,
  // PaintStyle
};
