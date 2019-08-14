import { FlowNodesProps } from './WorkflowProps';

export const ADD_NODE = 'ADD_NODE';
export const UPDATE_NODE_PARAM = 'UPDATE_NODE_PARAM';
export const NEW_CONNECTION = 'NEW_CONNECTION';
export const REMOVE_CONNECTION = 'REMOVE_CONNECTION';
export const UPDATE_NODE_STYLE = 'UPDATE_NODE_STYLE';
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
      const newNodes = { ...state };

      newNodes[nodeId].model.params[paramKey].default = paramValue;

      return newNodes;
    }

    case NEW_CONNECTION: {
      const { sourceId, targetId, sourceOutput, targetInput } = action;
      const newNodes = { ...state };

      const targetNode = newNodes[targetId];

      if (!targetNode.deps) {
        targetNode.deps = [sourceId];
      } else {
        if (!targetNode.deps.includes(sourceId)) {
          targetNode.deps!.push(sourceId);
        }
      }

      targetNode.inputRuntime = {
        [targetInput]: {
          id: sourceId,
          type: targetNode.model.inputs[targetInput].type,
          name: sourceOutput,
        }
      }

      return newNodes;
    }

    case REMOVE_CONNECTION: {
      const { sourceId, targetId } = action;
      const newNodes = { ...state };

      if (newNodes[targetId].inputRuntime) {
        Object.keys(newNodes[targetId].inputRuntime!).forEach((inputKey: string) => {
          if (newNodes[targetId].inputRuntime![inputKey].id === sourceId) {
            delete newNodes[targetId].inputRuntime![inputKey];
          }
        });
      }

      newNodes[targetId].deps = newNodes[targetId].deps!.filter((dep: string) => dep !== sourceId);

      return newNodes;
    }

    case UPDATE_NODE_STYLE: {
      const { nodeId, left, top } = action;
      const newNodes = { ...state };

      newNodes[nodeId].style = { left, top }

      return newNodes;
    }

    case REMOVE_NODE: {
      const { nodeId } = action;
      const newNodes = { ...state };

      Object.keys(newNodes).forEach((key: string) => {
        const node = newNodes[key];

        if (node.deps && node.deps!.includes(nodeId)) {
          node.deps = node.deps!.filter((dep: string) => dep !== nodeId);
        }

        if (node.inputRuntime) {
          Object.keys(node.inputRuntime).forEach((inputKey: string) => {
            if (node.inputRuntime![inputKey].id === nodeId) {
              delete node.inputRuntime![inputKey];
            }
          });
        }
      });

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