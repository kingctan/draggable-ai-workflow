import React, { SFC, useEffect, useState } from 'react';
import { Modal, Button, Form, Input, Radio, DatePicker, Select, message, Tooltip, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayoutForModal } from '../utils/FormLayout';

type Props = {
  visible: boolean
  handleOk: (formValues: any) => void
  handleCancel: () => void
};

type TimedUnit = 'minute' | 'hour' | 'day';

interface TimedConfigFormProps extends FormComponentProps { };

const ModalTimedConfig: SFC<Props & TimedConfigFormProps> = (props) => {
  const { visible, handleOk, handleCancel } = props;

  const { getFieldDecorator, validateFields, getFieldValue, getFieldsValue, setFieldsValue } = props.form;

  const [timedType, setTimedType] = useState<1 | 2 | 3>(1);
  const [timedUnit, setTimedUnit] = useState<TimedUnit>('minute');

  const handleSubmit = () => {
    validateFields((error: any) => {
      if (error) return message.warning('请检查填写内容');
      const timedMap = { minute: 1, hour: 60, day: 1440 };
      const newValues = {
        targetTimeStamp: new Date(getFieldsValue().targetTimeStamp.format()).getTime(),
        ...(timedType === 1 ? { cycle: timedMap[timedUnit] * (getFieldsValue().cycle - 0) } : { cycle: 0 }),
        sync: timedType === 3,
      };
      handleOk(newValues);
    });
  };

  useEffect(() => {

  }, []);

  return (
    <Modal
      width={600}
      visible={visible}
      title="定时任务配置"
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          确认
        </Button>,
      ]}
    >
      <Form>
        <Form.Item label="任务形式"  {...formItemLayoutForModal}>
          <Radio.Group onChange={(e) => { setTimedType(e.target.value) }} value={timedType}>
            <Radio value={1}>周期重复</Radio>
            <Radio value={2}>延时</Radio>
            <Radio value={3}>
              同步{` `}
              <Tooltip title="任务运行结束后再运行下一个任务">
                <Icon type="question-circle-o" />
              </Tooltip>
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="运行时间" {...formItemLayoutForModal}>
          {getFieldDecorator('targetTimeStamp', {
            rules: [{ required: true, message: '请选择运行时间' }],
          })(
            <DatePicker
              placeholder="选择日期"
              // disabledDate={disabledStartDate}
              showToday={false}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: 300 }}
            />
          )}
        </Form.Item>
        {
          timedType === 1 &&
          <Form.Item label="运行周期" {...formItemLayoutForModal}>
            {getFieldDecorator('cycle', {
              initialValue: 10,
              rules: [
                { required: true, message: '请填写周期' },
                {
                  validator: (rule: any, value: number, callback: any) => {
                    if (value.toString() === '0') callback("此处不能填0")
                    callback();
                  }
                }]
            })(<Input
              addonAfter={
                <Select defaultValue="minute" onChange={(val: TimedUnit) => setTimedUnit(val)}>
                  <Select.Option value="minute" >分钟 / 次</Select.Option>
                  <Select.Option value="hour">小时 / 次</Select.Option>
                  <Select.Option value="day">天 / 次</Select.Option>
                </Select>
              }
              type="number"
              style={{ width: 300 }}
            />)}

          </Form.Item>
        }
      </Form>
    </Modal>
  )
};

export default Form.create<TimedConfigFormProps>({
  name: 'ModalTimedConfig',
})(ModalTimedConfig);