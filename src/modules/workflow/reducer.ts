import { v4 } from 'uuid';
import { FlowNodesProps } from './WorkflowProps';

export const ADD_NODE = 'ADD_NODE';
export const REMOVE_NODE = 'REMOVE_NODE';

const initialState: FlowNodesProps = {};

function workflowReducer(state: FlowNodesProps = initialState, action: any) {
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