// 게시글을 작성하고, Server(Firebase)에 업로드하는 컴포넌트

import { useRef, useState } from "react";
import styled from "styled-components";
import { auth, firestore } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { IPost } from "../types/PostInput";

const Form = styled.form`
  display: flex;
  gap: 10px;
  border: 1px solid #1d1d1d;
  padding: 20px 5px;
`;
const Profile = styled.div`
  background-color: tomato;
  /* width: 30px; */
`;
const PostArea = styled.div`
  flex: 1;
`;
const TextArea = styled.textarea`
  padding: 10px;
  resize: none;
  background-color: black;
  color: white;
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &:focus {
    outline: none;
    border-color: #3972f5;
  }
  &::placeholder {
    color: #1f1f1f;
  }
`;

const BottomMenu = styled.div`
  display: flex;
  justify-content: space-between;
`;
const AttachFileButton = styled.label`
  background-color: #175af4;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none;
`;
const SubmitButton = styled.input`
  background-color: #3972f5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

export default () => {
  // Page Logic Rendering
  // 1. 작성한 텍스트, 업로드한 이미지
  const [post, setPost] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState<boolean>(false);
  // 1-a. TextArea 의 정보를 담을 Ref 생성
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 2. 작성한/변경된 텍스트를 State에 저장
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 1.텍스트 변경 시 발생하는 Event에서 value값 가져옴
    // const { target: { value } } = e;
    const value = e.target.value;
    // 2.value 값을 State 에 저장
    setPost(value);
    // 3.텍스트를 개행 높이 부분을 통해 TextArea높이 자동조절
    if (textareaRef && textareaRef.current) {
      // - TextArea 높이 = 기본 설정
      textareaRef.current.style.height = "auto";
      // - TextArea 스크롤 높이 (=TextArea 높이)
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  // 3. 업로드한 이미지(File)를 State에 저장
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. 발생한 Event에서 File 정보를 가져옴
    // const { target : { files } } = e;
    const files = e.target.files;
    // 2. [방어코드] : 가져온 File 이 존재하는 경우
    // - 값이 들어가 있는지 확인 + 이미지가 1개만 선택된 경우
    if (files && files.length === 1) {
      // 3. File 정보를 State에 저장
      setFile(files[0]);
    }
  };
  // 4. 작성한 게시글 정보를 Server(Firebase)에 업로드
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // 페이지 랜더링을 막고, 제출가능하도록 페이지 유지
    e.preventDefault();
    // ------- Loading Start -------
    setLoading(true);
    try {
      // 0. [방어코드] : 로그인하지 않았거나, 게시글 내용이 없거나.. 실행X
      const user = auth.currentUser;
      if (user === null || post === "") {
        return;
      }
      // 1. Firebase에 전달할 정보를 담은 객체(Object) 생성
      const myPost: IPost = {
        post: post,
        createdAt: Date.now(),
        nickname: user.displayName || "익명",
        userId: user.uid,
        email: user.email || "",
      };
      // 3. Firebase에 전달
      await addDoc(collection(firestore, "posts"), myPost);
      // 4. 게시글 작성 후, 내가 작성한 게시글을 RESET
      setPost("");
    } catch (error) {
      // ------- Error 발생 시, 예외처리 -------
      console.error(error);
    } finally {
      // --- Loading End ---
      setLoading(false);
    }
  };

  // Page Design Rendering
  return (
    <Form onSubmit={(e) => onSubmit(e)}>
      {/* 프로필 이미지  */}
      <Profile></Profile>
      {/* 게시글 작성 영역 */}
      <PostArea>
        <TextArea
          ref={textareaRef}
          rows={5}
          value={post}
          onChange={(e) => onChange(e)}
          maxLength={200}
          placeholder="무슨 일이 일어나고 있나요?"
        />
        <BottomMenu>
          <AttachFileButton htmlFor="file">
            {file ? "업로드 완료" : "사진 업로드"}
          </AttachFileButton>
          <AttachFileInput
            onChange={(e) => onChangeFile(e)}
            type="file"
            id="file"
            accept="image/*"
          />
          <SubmitButton
            type={"submit"}
            value={loading ? "업로드 중..." : "작성하기"}
          />
        </BottomMenu>
      </PostArea>
    </Form>
  );
};
