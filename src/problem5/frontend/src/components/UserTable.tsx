import { Button, Modal, Space, Table, type TableProps } from "antd";
import type { User } from "../store/slices/userApi";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useRef, useState } from "react";

interface UsersTableProps {
  users: User[];
  onRowClick: (userId: string) => void;
  onDeleteRow: (userId: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
  loading?: boolean;
  currentPage?: number;
  pageSize?: number;
  total?: number;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onRowClick,
  onDeleteRow,
  onPageChange,
  loading = false,
  currentPage = 1,
  pageSize = 10,
  total,
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const recordToDelete = useRef<string | null>(null);

  const columns: TableProps<User>["columns"] = [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "age",
      title: "Age",
      dataIndex: "age",
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={
              <DeleteOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  recordToDelete.current = record._id;
                  setIsModalOpen(true);
                }}
              />
            }
          />
          <Button
            icon={
              <EditOutlined onClick={() => navigate(`/users/${record._id}`)} />
            }
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={users}
        columns={columns}
        onRow={(record) => ({
          onClick: () => onRowClick(record._id),
          style: { cursor: "pointer" },
        })}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total: total,
          onChange(page, pageSize) {
            onPageChange(page, pageSize);
          },
        }}
      />
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          if (recordToDelete.current) {
            onDeleteRow(recordToDelete.current);
            recordToDelete.current = null;
          }
          setIsModalOpen(false);
        }}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </>
  );
};
