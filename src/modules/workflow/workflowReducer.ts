import { v4 } from 'uuid';
import { FlowNodesProps } from './WorkflowProps';

export const ADD_NODE = 'ADD_NODE';
export const UPDATE_NODE_PARAM = 'UPDATE_NODE_PARAM';
export const REMOVE_NODE = 'REMOVE_NODE';
export const CLEAR_NODES = 'CLEAR_NODES';

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
    case UPDATE_NODE_PARAM: {
      const { nodeId, paramKey, paramValue } = action;
      const willUpdateNode = state;
      willUpdateNode[nodeId].model.params[paramKey].default = paramValue;
      willUpdateNode[nodeId].model.params[paramKey].value = paramValue;
      return {
        ...willUpdateNode
      };
    }
    case REMOVE_NODE: {
      const { nodeId } = action;
      const newNodes = { ...state };
      delete newNodes[nodeId];
      return newNodes;
    }
    case CLEAR_NODES: {
      return {};
    }
    default:
      return state;
  }
};

export default workflowReducer;