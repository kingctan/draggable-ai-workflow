import { v4 } from 'uuid';
import { FlowNodesProps } from './WorkflowProps';

export const ADD_NODE = 'ADD_NODE';
export const REMOVE_NODE = 'REMOVE_NODE';

const initialState: FlowNodesProps = {};

function workflowReducer(state: FlowNodesProps = initialState, action: any) {
  switch (action.type) {
    case ADD_NODE: {
      const { nodeId, nodeInfo } = action;
      return {
        ...state,
        [nodeId]: nodeInfo
      };
    }
    case REMOVE_NODE: {
      const { nodeId } = action;
      const newNodes = { ...state };
      delete newNodes[nodeId];
      return newNodes;
    }
    default:
      return state;
  }
};

export default workflowReducer;