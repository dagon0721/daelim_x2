import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 20px;
  padding: 10px 20px;
  color: black;
  font-weight: bold;
  cursor: pointer;
  svg {
    fill: #2e72f0;
    width: 18px;
  }
`;
const Title = styled.p`
  color: black;
`;

export default () => {
  const naivation = useNavigate(); // Hook

  // Google 로그인 진행하기 feat.Server(Firebase)
  const onClick = async () => {
    try {
      // 1. provider 생성 (Google 로그인을 위한 제공자)
      const provider = new GoogleAuthProvider();
      // 2. Google 로그인 창 띄우기 (server,,, 시간 차.. 비동기화.. async-await)
      await signInWithPopup(auth, provider);
      // 3. 로그인 성공 시, Home 화면으로 이동
      naivation("/");
    } catch (e) {
      console.log(e);
      // 만일 Firebase 에러라면 알람
      if (e instanceof FirebaseError) {
        alert(e.message);
      }
    }
  };

  return (
    <Container onClick={onClick}>
      <svg
        className="w-6 h-6 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          fill-rule="evenodd"
          d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z"
          clip-rule="evenodd"
        />
      </svg>
      <Title>Google 계정으로 로그인하기</Title>
    </Container>
  );
};
