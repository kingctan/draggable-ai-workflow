import { v4 } from 'uuid';
import { FlowNodesProps } from './WorkflowProps';

export const ADD_NODE = 'ADD_NODE';
export const UPDATE_NODE_PARAM = 'UPDATE_NODE_PARAM';
export const UPDATE_NODE_BY_CONNECTION = 'UPDATE_NODE_BY_CONNECTION';
export const UPDATE_NODE_INPUTS_RUNTIME = 'UPDATE_NODE_INPUTS_RUNTIME';
export const UPDATE_NODE_OUTPUTS_RUNTIME = 'UPDATE_NODE_OUTPUTS_RUNTIME';
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
      const willUpdateNode = { ...state };

      willUpdateNode[nodeId].model.params[paramKey].default = paramValue;

      return willUpdateNode;
    }
    case UPDATE_NODE_BY_CONNECTION: {
      const { sourceId, targetId } = action;
      const willUpdateNodes = { ...state };

      const sourceNode = willUpdateNodes[sourceId];
      const targetNode = willUpdateNodes[targetId];

      if (!targetNode.deps) {
        targetNode.deps = [sourceId];
      } else {
        if (!targetNode.deps.includes(sourceId)) {
          targetNode.deps!.push(sourceId);
        }
      }

      const outputRuntimeKey = Object.keys(sourceNode.model.outputs)[0];
      if (outputRuntimeKey) {
        sourceNode.outputRuntime = {
          [outputRuntimeKey]: {
            type: sourceNode.model.outputs[outputRuntimeKey].type
          }
        }
      }

      const inputRuntimeKey = Object.keys(targetNode.model.inputs)[0];
      if (inputRuntimeKey) {
        targetNode.inputRuntime = {
          [inputRuntimeKey]: {
            id: sourceId,
            type: targetNode.model.inputs[inputRuntimeKey].type,
            name: outputRuntimeKey,
          }
        }
      }

      return willUpdateNodes;
    }
    case REMOVE_NODE: {
      const { nodeId } = action;
      const willUpdateNodes = { ...state };

      Object.keys(willUpdateNodes).forEach((key: string) => {
        const node = willUpdateNodes[key];
        if (node.deps && node.deps!.includes(nodeId)) {
          node.deps = node.deps!.filter((dep: string) => dep !== nodeId);
        }
      });

      delete willUpdateNodes[nodeId];

      return willUpdateNodes;
    }
    case CLEAR_NODES: {
      return {};
    }
    default:
      return state;
  }
};

export default workflowReducer;