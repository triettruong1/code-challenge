import { Navigate, Route, Routes } from "react-router";
import { UsersPage } from "./pages/UsersPage";
import { UserDetails } from "./components/UserDetails";
import { ConfigProvider, theme } from "antd";

function App() {
  const { darkAlgorithm } = theme;
  return (
    <ConfigProvider theme={{ algorithm: darkAlgorithm }}>
      <Routes>
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="users">
          <Route path="" element={<UsersPage />} />
          <Route path=":userId" element={<UserDetails />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
}

export default App;
