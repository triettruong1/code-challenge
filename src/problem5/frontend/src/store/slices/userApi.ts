import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  _id: string;
  name: string;
  age: number;
  email: string;
}

interface UsersResponse {
  users: User[];
  page: number;
  size: number;
  total: number;
}

interface UserQueryParams {
  name?: string;
  page?: number;
  size?: number;
}

export const userApi = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1.0/users",
  }),
  tagTypes: ["Users"],
  endpoints: (build) => ({
    getUserById: build.query<User, string>({
      query: (id) => `/${id}`,
    }),
    getUsers: build.query<UsersResponse, UserQueryParams>({
      query: ({ name, page = 1, size = 10 }) => {
        const queryParams = new URLSearchParams();
        if (name) {
          queryParams.append("name", name);
        }

        if (page) {
          queryParams.append("page", page.toString());
        }

        if (size) {
          queryParams.append("size", size.toString());
        }

        return `?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
            ...result.users.map(({ _id }) => ({
              type: "Users" as const,
              _id,
            })),
            { type: "Users", _id: "PARTIAL-LIST" },
          ]
          : [{ type: "Users", _id: "PARTIAL-LIST" }],
    }),
    deleteUser: build.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Users", id },
        { type: "Users", id: "PARTIAL-LIST" },
      ],
    }),
    updateUser: build.mutation<User, Partial<User> & { _id: string }>({
      query: (user) => ({
        url: `/${user._id}`,
        method: "PUT",
        body: user,
      }),
    }),
    createUser: build.mutation<User, Omit<User, "_id">>({
      query: (user) => ({
        url: "/",
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useCreateUserMutation,
} = userApi;
