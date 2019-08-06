import React, { useState, SyntheticEvent } from 'react';
import { Form, Radio, Input, Select, Tabs, Icon, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, tailFormItemLayout } from '../../utils/FormLayout';
import { Link } from 'react-router-dom';
import { OperatorConfigParam, OperatorConfigInputOutput } from './OperatorProps';

type Props = {

};


interface OperatorDetailProps extends FormComponentProps {

};

const componentTypes = ['数据', '数据处理', '算法', '评估', '报表'];


const OperatorDetail: React.FC<Props & OperatorDetailProps> = (props) => {
  const { } = props;
  const { getFieldDecorator, validateFields, getFieldValue, getFieldsValue, setFieldsValue } = props.form;

  const [tab, setTab] = useState('input');
  const [confInput, setConfInput] = useState<OperatorConfigInputOutput>({
    data: {
      type: '',
      note: '',
    },
  });
  const [confOutput, setConfOutput] = useState<OperatorConfigInputOutput>({
    data: {
      type: '',
      note: '',
    },
  });
  const [confParam, setConfParam] = useState<OperatorConfigParam>({});

  const handleChangeTab = (activeKey: string) => setTab(activeKey);

  return (
    <div>
      <div className="main-toolbar">
        <Link to="/operator-list">
          <Button>
            <Icon type="caret-left" /> 返回列表
          </Button>
        </Link>
      </div>
      <Form onSubmit={() => { }}>
        <Tabs activeKey={tab} onChange={handleChangeTab}>
          <Tabs.TabPane tab="基础属性" key="basic" style={styles.tabPaneStyle}>
            <Form.Item label="算子名称" required {...formItemLayout}>
              {getFieldDecorator('componentName', {
                rules: [{
                  required: true,
                  message: '请填写算子名称',
                }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="算子类型" required {...formItemLayout}>
              {getFieldDecorator('type', {
                rules: [{
                  required: true,
                  message: '请选择算子类型',
                }],
              })(
                <Select>
                  {componentTypes.map((item: any) => (
                    <Select.Option value={item} key={item}>{item}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="描述" {...formItemLayout}>
              {getFieldDecorator('note', {
              })(<Input.TextArea autosize={{ minRows: 3, maxRows: 8 }} />)}
            </Form.Item>
          </Tabs.TabPane>
          <Tabs.TabPane tab="输入配置" key="input" style={styles.tabPaneStyle}>
            {
              Object.entries(confInput).map(([key, item]: any) => (
                <>
                  <Form.Item label="类型" required {...formItemLayout}>
                    {getFieldDecorator(`input[${key}].type`, {
                      initialValue: item.type,
                      rules: [
                        { required: true, message: '请选择类型' },
                      ],
                    })(
                      <Input onChange={(e) => setConfInput({ ...confInput, [e.target.value]: { type: '', note: '' } })} />
                    )}
                  </Form.Item>
                </>
              ))
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="输出配置" key="output" style={styles.tabPaneStyle}>
            {
              Object.entries(confOutput).map(([key, item]: any) => (
                <>
                  <Form.Item label="类型" required {...formItemLayout}>
                    {getFieldDecorator(`input[${key}].type`, {
                      initialValue: item.type,
                      rules: [
                        { required: true, message: '请选择类型' },
                      ],
                    })(
                      <Input onChange={(e) => setConfOutput({ ...confOutput, [e.target.value]: { type: '', note: '' } })} />
                    )}
                  </Form.Item>
                </>
              ))
            }
          </Tabs.TabPane>
        </Tabs>
      </Form>
    </div>
  );
};

const styles = {
  tabPaneStyle: {
    paddingTop: 30
  },
  H3: {
    color: '#999',
  }
};

export default Form.create<OperatorDetailProps>({
  name: 'OperatorDetail',
})(OperatorDetail);