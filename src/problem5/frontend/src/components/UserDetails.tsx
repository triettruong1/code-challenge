import { Button, Flex, Form, Spin, Typography } from "antd";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
  type User,
} from "../store/slices/userApi";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useForm } from "antd/es/form/Form";
import { UserForm } from "./UserForm";

export const UserDetails = () => {
  const params = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const userId = params.userId || "";
  const [form] = useForm();

  const { data: userDetail, isLoading: isLoadingUserDetail } =
    useGetUserByIdQuery(userId);
  const [updateUser, { isLoading: isUpdating, status: updateUserStatus }] =
    useUpdateUserMutation();

  const handleUpdateUser = (values: Omit<User, "_id">) => {
    updateUser({ ...values, _id: userId });
  };

  if (isLoadingUserDetail) {
    return <Spin />;
  }

  return (
    <div className="form-wrapper">
      <h2>User Details</h2>
      <Form
        onFinish={handleUpdateUser}
        form={form}
        layout="vertical"
        initialValues={userDetail}
      >
        <UserForm />
        <Flex justify="space-between">
          <Button
            onClick={() => navigate("/users")}
            type="primary"
            icon={<ArrowLeftOutlined />}
            style={{ marginBottom: 16 }}
          />
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              Save
            </Button>
          </Form.Item>
        </Flex>
      </Form>
      <Typography.Text type="secondary">
        {updateUserStatus === "fulfilled"
          ? "User updated successfully!"
          : updateUserStatus === "rejected"
            ? "Failed to update user."
            : ""}
      </Typography.Text>
    </div>
  );
};
