// 서버로부터 받아온 데이터를 예쁘게 포장해서 보여줌
import styled from "styled-components";
import { IPost } from "../types/PostInput";
import { auth, firestore } from "../firebaseConfig";
import moment from "moment";
import PostMenu from "./Post-Menu";
import { deleteDoc, doc } from "firebase/firestore";

const Container = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
  border: 1px solid #1d1d1d;
`;
const ProfileBox = styled.div``;
const Photo = styled.img`
  width: 33px;
  height: 33px;
  background-color: tomato;
`;
const DataBox = styled.div`
  width: 100%;
`;
const UserName = styled.span`
  font-size: 15px;
  font-weight: 700;
  margin-right: 5px;
`;
const UserEmail = styled.span`
  color: #51b4ff;
  font-size: 13px;
`;
const Content = styled.div`
  margin: 10px 0;
`;
const CreateTime = styled.div`
  font-size: 12px;
  color: #4d4d4d;
`;

const Footer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
`;
const UserBox = styled.div``;
const DeleteBtn = styled.button``;

export default ({ id, userId, nickname, post, createdAt, email }: IPost) => {
  //Logic
  const user = auth.currentUser;
  //게시글 삭제
  const onDelete = async () => {
    // 0. -- 방어 코드 --
    // ㄴ id 값이 없는 경우, 내 게시글이 아닌 경우
    if (id === undefined || user?.uid !== userId) {
      return;
    }
    // A. 진짜 삭제할 것인지 확인
    const isOK = window.confirm("정말 삭제하겠습니까?");
    // B. 삭제 진행
    try {
      if (isOK) {
        // b-1. 삭제할 게시글의 ID로 삭제할 doc 알아오기
        const removeDoc = await doc(firestore, "posts", id);
        // b-2. Firebase 통해서 해당 ID를 가진 게시글 삭제
        await deleteDoc(removeDoc);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container>
      {/* 프로필 이미지 */}
      <ProfileBox>
        <Photo />
      </ProfileBox>
      {/* 불러온 게시글 표시 */}
      <DataBox>
        <TopBar>
          <UserBox>
            <UserName>{nickname}</UserName>
            <UserEmail>{email}</UserEmail>
          </UserBox>
          {user?.uid === userId && (
            <DeleteBtn onClick={onDelete}>delete</DeleteBtn>
          )}
        </TopBar>
        <Content>{post}</Content>
        <CreateTime>{moment(createdAt).fromNow()}</CreateTime>
        <Footer>
          <PostMenu menu="view" count={99} />
          <PostMenu menu="likes" count={23} />
          <PostMenu menu="comments" count={50} />
        </Footer>
      </DataBox>
    </Container>
  );
};
