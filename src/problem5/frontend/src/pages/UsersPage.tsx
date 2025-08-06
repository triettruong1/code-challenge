import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useLazyGetUsersQuery,
  type User,
} from "../store/slices/userApi";
import { Button, Flex, Space, Spin, Form } from "antd";
import { UsersTable } from "../components/UserTable";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import Search from "antd/es/input/Search";
import { useDebounce } from "../utils/use-debounce";
import Modal from "antd/es/modal/Modal";
import { useForm } from "antd/es/form/Form";
import { UserForm } from "../components/UserForm";

export const UsersPage = () => {
  const navigate = useNavigate();
  const [form] = useForm();
  const searchValue = useRef<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [getUsers, { data, isLoading }] = useLazyGetUsersQuery();

  const [deleteUser, { isLoading: isDeleting, status: deleteStatus }] =
    useDeleteUserMutation();

  const [createUser, { isLoading: isCreating, status: createUserStatus }] =
    useCreateUserMutation();

  const isTableLoading = isLoading || isDeleting;

  const handleSearch = (value: string) => {
    searchValue.current = value;
    getUsers({ name: value });
  };

  const handleCreateUser = (values: Omit<User, "_id">) => {
    createUser(values);
    setIsModalOpen(false);
  };

  const debouncedSearch = useDebounce(handleSearch, 500);

  useEffect(() => {
    if (deleteStatus === "fulfilled") {
      getUsers({ name: "" });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteStatus]);

  useEffect(() => {
    if (createUserStatus === "fulfilled") {
      getUsers({ name: "" });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createUserStatus]);

  useEffect(() => {
    getUsers({ name: "" });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading || !data ? (
    <Spin />
  ) : (
    <div style={{ width: "70%" }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Space>
          <Search
            onChange={(e) => {
              debouncedSearch(e.target.value);
            }}
          />
        </Space>
        <Button onClick={() => setIsModalOpen(true)}>Create User</Button>
      </Flex>
      <UsersTable
        users={data?.users || []}
        onRowClick={(userId: string) => navigate(`/users/${userId}`)}
        onDeleteRow={(userId: string) => {
          deleteUser(userId);
        }}
        onPageChange={(page: number, pageSize: number) => {
          getUsers({ name: searchValue.current, page, size: pageSize });
        }}
        loading={isTableLoading}
        pageSize={data?.size || 10}
        currentPage={data?.page || 1}
        total={data!.total || 0}
      />
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateUser}>
          <UserForm />
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isCreating}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
