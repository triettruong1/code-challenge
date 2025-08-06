import { Form, Input, InputNumber } from "antd";

export const UserForm = () => {
  return (
    <>
      <Form.Item
        label="Name"
        name="name"
        rules={[
          { required: true, type: "string" },
          {
            min: 3,
            message: "Name must be at least 3 characters long",
          },
          {
            max: 50,
            message: "Name must be at most 50 characters long",
          },
          {
            pattern: /^[a-zA-Z\s]+$/,
            message: "Name must contain only letters and spaces",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: "email" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Age"
        name="age"
        rules={[
          { required: true, type: "number" },
          {
            validator: (_, value) => {
              if (value < 1 || value > 120) {
                return Promise.reject(
                  new Error("Age must be between 1 and 120"),
                );
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber min={1} max={120} />
      </Form.Item>
    </>
  );
};
