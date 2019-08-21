import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Icon, Input, Form, message, Spin } from 'antd';

import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, tailFormItemLayout } from '../../utils/FormLayout';

type Props = {};

interface ProjectDetailProps extends FormComponentProps { };

const ProjectDetail: React.FC<Props & ProjectDetailProps> = (props) => {
  // const { } = props;

  const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = props.form;
  const { projectId } = (props as any).match.params;

  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    validateFields((error: any) => {
      if (error) return message.warning('请检查填写的内容');
      const formValues = getFieldsValue();
      const finalObj: any = {
        ...formValues,
      };

      if (projectId) { // 更新模板
        finalObj.projectId = Number(projectId);
        axios.put(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/project/update`, finalObj, {
          withCredentials: true
        })
          .then((res) => {
            if (res.data.code === 200) {
              message.success('已更新');
              (props as any).history.push(`/project-list`);
            }
          }).catch((err) => {
            message.error('服务器被吃了..');
          });
      } else { // 新增模板
        axios.post(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/project/create`, finalObj, {
          withCredentials: true
        })
          .then((res) => {
            if (res.data.code === 200) {
              message.success('新增成功');
              (props as any).history.push(`/project-list`);
            }
          }).catch((err) => {
            message.error('服务器被吃了..');
          });
      }
    });
  };

  const getProjectInfo = () => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/project/get?projectID=${projectId}`, {
      withCredentials: true
    })
      .then((res) => {
        if (res.data.code === 200) {
          setLoading(false);
          setFieldsValue(res.data.data);
        }
      }).catch((err) => {
        message.error('服务器被吃了..');
      });
  };

  useEffect(() => {
    if (projectId) {
      getProjectInfo();
    }
  }, []);

  return (
    <div>
      {
        loading ? <Spin tip="加载中..." className="spin" style={{ color: '#fff' }} /> :
          <Form onSubmit={() => { }}>
            <Form.Item {...tailFormItemLayout} className="form-title">
              {projectId ? "编辑模板" : "创建模板"}
            </Form.Item>
            <Form.Item label="模板名称" required {...formItemLayout}>
              {getFieldDecorator('projectName', {
                rules: [{
                  required: true,
                  message: '请填写模板名称',
                }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="模板描述" {...formItemLayout}>
              {getFieldDecorator('note', {
              })(
                <Input.TextArea autosize={{ minRows: 3, maxRows: 8 }} />
              )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" onClick={handleSubmit}>
                <Icon type="check" /> 确认
                </Button>
              <Link to="/project-list">
                <Button className="form-btn">返回</Button>
              </Link>
            </Form.Item>
          </Form>
      }
    </div>
  );
};

export default Form.create<ProjectDetailProps>({
  name: 'ProjectDetail',
})(ProjectDetail);