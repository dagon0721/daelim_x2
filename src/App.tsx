import React, { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Home from "./screens/home";
import Profile from "./screens/profile";
import SigninScreen from "./screens/signin-screen";
import SignupScreen from "./screens/signup-screen";
import reset from "styled-reset";
import { auth } from "./firebaseConfig";
import loadingScreen from "./screens/loading-screen";
import LoadingScreen from "./screens/loading-screen";
import ProtectedRouter from "./components/protected-router";
import Layout from "./screens/layout";
import ErrorRouterScreen from "./screens/error-router-screen";

// react-router-dom을 활용한 Page 관리
// - Page : home, profile, signin, signup
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRouter>
        <Layout />
      </ProtectedRouter>
    ),
    errorElement: <ErrorRouterScreen />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/signin",
    element: <SigninScreen />,
  },
  {
    path: "/signup",
    element: <SignupScreen />,
  },
]);

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
`;

function App() {
  // 로딩 여부
  const [loading, setLoading] = useState<boolean>(true);

  // 로그인 여부를 파악하기 위한 함수
  // -> Firebase(Server)를 통해서 로그인 여부를 확인
  const isLogin = async () => {
    // 1. 로딩 시작
    // 2. Firebase를 통해서 로그인했는지 여부를 확인
    await auth.authStateReady();
    // 3. 로딩 종료
    setLoading(false);
  };

  // App.tsx(브라우저,앱)이 실행되면 호출
  useEffect(() => {
    // 초기화 (initialize)
    // - 로그인 여부를 확인
    isLogin();
  }, []);

  // 로딩이 종료된 후에, 로그인 여부에 따라 페이지를 보여줌
  // +로딩 중일 때 보여줄 페이지 필요
  return loading ? (
    <LoadingScreen />
  ) : (
    <Container className="App">
      <GlobalStyle />
      <RouterProvider router={router}></RouterProvider>
    </Container>
  );
}

export default App;

// 전체 CSS 스타일을 Reset
const GlobalStyle = createGlobalStyle`
  ${reset}
  body{
    background-color: black;
    color : white;
  }
`;
