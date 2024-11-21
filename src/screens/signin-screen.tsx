// Profile 화면을 구성
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import React, { useState } from "react";
import styled from "styled-components";
import { auth } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import EmailSignUpBtn from "../components/EmailSignUpBtn";
import GoogleSignupBtn from "../components/GoogleSignupBtn";
// import LogoImg from "../assets/images/DaelimX_Title.png";

// styled-component 를 통한 css 구성
const Container = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  justify-items: center;
  padding: 30px;
  /* 특정 화면 너비가 되었을 때 실행 */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
// 화면 타이틀 텍스트
const Title = styled.h1`
  color: white;
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 30px;
`;
// 화면 타이틀 로고(이미지)
const Logo = styled.img`
  width: 100%;
  max-width: 550px;
  height: auto;
`;
// ID/PW 텍스트 Input Field(Form)
// ㄴ1. Form (텍스트 인풋 필드를 담을 공간)
const Form = styled.form`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  width: 400px;
`;
// ㄴ2. 각각(id,pw)의 Input Field
const Input = styled.input`
  padding: 10px 15px;
  border-radius: 10px;
  border: none;
  &::placeholder {
    font-size: 0.8em;
  }
  &[type="submit"] {
    margin-top: 30px;
    cursor: pointer;
  }
`;
const InputTitle = styled.p`
  color: white;
  font-size: 8px;
  margin-top: 10px;
  margin-bottom: 5px;
`;

// 회원가입 버튼
const SigninBtn = styled.div`
  padding: 10px 15px;
  background-color: #ffffff;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 25px;
  display: flex;
  justify-content: center;
  font-size: 13px;
  color: black;
  font-weight: bold;
`;
// 에러메시지 출력 컴포넌트
const ErrorMsg = styled.p`
  color: red;
  font-weight: 600;
  font-size: 10px;
  text-align: center;
`;
// 로그인 페이지 이동을 위한 Guide
const Guide = styled.div`
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  a {
    color: #49eb08;
    font-weight: bold;
  }
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
// 로그인 / 가입 버튼 구분
const Divider = styled.p`
  display: flex;
  color: #ffffff;
  align-items: center;
  text-align: center;
  font-size: 13px;
  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid white;
    margin: 30px 5px;
  }
`;
const GuideTtitle = styled.p`
  font-size: 13px;
  font-weight: 500;
  text-align: center;
`;

// 실제 페이지를 구성하는 code
export default () => {
  // 회원가입을 하기 위한 Process 코드작성
  // 페이지 이동을 위한 Hook
  const navigation = useNavigate();

  // A.회원정보를 저장할 데이터(State) - useStateHook
  const [email, setEmail] = useState(""); // Email
  const [password, setPassword] = useState(""); // Password
  const [loading, setLoading] = useState(false); // Loading
  const [error, setError] = useState(""); // Error
  // B.회원정보를 입력할 때 실행, (유저가 입력한 정보 가공/수정)
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 0.입력된 정보에서 값(입력위치,입력값)을 알아야한다.
    // const name = e.target.name; // ㄴ 입력위치
    // const value = e.target.value; // ㄴ 입력값
    // 1.어디서 입력된 정보(event)인지 알아야합니다.
    const {
      target: { name, value },
    } = e;
    // 2.입력된 장소(email,pw)에 따라 각각 데이터(state)를 저장
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
    // 3.저장한 데이터를 Page에 보여준다.
  };
  // C.로그인 버튼 눌렀을 때, 실행(입력한 정보 전달)
  const onSubmit = async () => {
    // A. 방어코드:: 아무것도 입력하지 않고 제출X(STOP)
    if (email === "" || password === "") {
      // 로그인 프로세스를 진행하지 않고 "종료"
      alert("회원 정보를 입력해주세요.");
      return;
    }
    // B. 로그인 프로세스 진행
    try {
      // b-1. 로딩 시작 ...
      setLoading(true);
      // b-2. 사용자가 입력한 전달할 데이터 확인
      // b-3. API를 통해서 Server(Firebase)에 값(입력한 회원정보)을 전달
      // b-4. 서버에서.... 로그인 정보 확인...
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // b-5. 저장이 완료되면,, 로그인 화면으로 이동 or 자동 로그인=>홈화면
      navigation("/");
    } catch (e) {
      console.log(e);
      // [Firebase erorr]--통신X,중복된이메일,잘못된PW...
      // 1.만일 발생한 에러가 Firebase Error라면?
      if (e instanceof FirebaseError) {
        // 2.Firebase 에러 메시지를 화면에 출력
        setError(e.code);
      }
    } finally {
      // ALWAYS 프로세스 끝나면, 로딩 종료
      setLoading(false);
    }
  };

  // 페이지 레이아웃(Design) 반환 --- Rendering
  return (
    <Container>
      <Logo src={`${process.env.PUBLIC_URL}/DaelimX_title.png`} />
      <Form>
        <Title>지금, 새로운 세계로</Title>
        <InputTitle>이메일*</InputTitle>
        <Input
          onChange={onChange}
          name="email"
          type="email"
          placeholder="예) Daelim@daelim.ac.kr"
          value={email}
        />
        <InputTitle>비밀번호*</InputTitle>
        <Input
          onChange={onChange}
          name="password"
          type="password"
          placeholder="*********"
          value={password}
        />
        <SigninBtn onClick={onSubmit}>
          {loading ? "로딩중..." : "로그인"}
        </SigninBtn>
        <Divider>또는</Divider>
        <ErrorMsg>{error}</ErrorMsg>
        <Guide>
          <GuideTtitle>아직 계정이 없으신가요?</GuideTtitle>
          <EmailSignUpBtn />
          <GoogleSignupBtn />
        </Guide>
      </Form>
    </Container>
  );
};
