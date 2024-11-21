// 서버로부터 받아온 데이터를 예쁘게 포장해서 보여줌
import styled from "styled-components";
import { IPost } from "../types/PostInput";
import { auth } from "../firebaseConfig";

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
const DataBox = styled.div``;
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
export default ({ userId, nickname, post, createdAt, email }: IPost) => {
  return (
    <Container>
      {/* 프로필 이미지 */}
      <ProfileBox>
        <Photo />
      </ProfileBox>
      {/* 불러온 게시글 표시 */}
      <DataBox>
        <UserName>{nickname}</UserName>
        <UserEmail>{email}</UserEmail>
        <Content>{post}</Content>
        <CreateTime>{createdAt}</CreateTime>
      </DataBox>
    </Container>
  );
};
