import { v4 } from 'uuid';
import { FlowNodeProps } from './WorkflowProps';

export const ADD_NODE = 'ADD_NODE';
export const REMOVE_NODE = 'REMOVE_NODE';

const initialState: FlowNodeProps = {
  [v4()]: {
    label: '数据',
    icon: 'icon-database',
    type: 'source',
    style: {
      left: 272.5,
      top: 233
    },
  },
  [v4()]: {
    label: '模型',
    icon: 'icon-ziyuanshezhi',
    type: 'target',
    style: {
      left: 372.5,
      top: 233
    }
  }
};

function workflowReducer(state: FlowNodeProps = initialState, action: any) {
  switch (action.type) {
    case ADD_NODE:
      const { label, icon, type, style } = action;
      const newNode = {
        [v4()]: {
          label,
          icon,
          type,
          style,
        }
      };
      return {
        ...state,
        ...newNode,
      };
    case REMOVE_NODE:
      console.log('remove');
      return state;
    default:
      return state;
  }
};

export default workflowReducer;