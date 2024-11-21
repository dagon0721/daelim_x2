// 로그인 되어있지 않은 상태에서 User가 Home/Profile 접근 막음

import { Navigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

type Props = {
  children: React.ReactNode;
};

export default ({ children }: Props) => {
  // 1. 현재 유저가 로그인 했는지 안했는지 여부를 알아야한다.
  // user 안의 값이 존재한다면 1-A로, 없다면 1-B로 이동
  const user = auth.currentUser;

  // 1-A : 로그인을 한 상태라면?
  if (user) {
    // 그대로 진행하면 됨(Home화면에 머물면됨)
    return <>{children}</>;
  }
  // 1-B : 로그인을 안한 상태라면?
  else {
    // 로그인 화면으로 이동
    // useNavigator 사용 시        : 사용자의 코드에 따라 실행될 때 사용
    // <Navigate/> 컴포넌트 사용 시 : Redirect, 코드와 상관없이 특정 분기 상황에서
    return <Navigate to={"/signin"} />;
  }
};
