// 작성된 게시글을 시간 순으로 불러와 보여주는 컴포넌트

import { useEffect, useState } from "react";
import styled from "styled-components";
import { IPost } from "../types/PostInput";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import Post from "./Post";

const Container = styled.div``;

export default () => {
  // 게시글'들'을 저장할 State
  const [posts, setPosts] = useState<IPost[]>([]);

  // 게시글들을 시간 순으로 불러와 보여주기
  const getPosts = async () => {
    // 1. 게시글을 불러오기 from Firebase(Server)
    const path = collection(firestore, "posts");
    const condition = orderBy("createdAt", "desc");
    // 2. 불러온 게시글을 시간 순으로 정렬
    const postsQuery = query(path, condition);
    // 3. 실제 Qeury(조건)에 맞는 데이터(Docs)들을 받아오기
    const result = await getDocs(postsQuery);
    // 4. 어떤 형태로 보여줄 지? => 재구성
    const timelinePosts = result.docs.map((doc) => {
      // 닉네임,작성시간,게시글내용,유저ID,프로필이미지
      const { userId, nickname, post, createdAt } = doc.data() as IPost;
      // 내가 쓸 수 있도록 형태를 수정
      return {
        userId: userId,
        nickname: nickname,
        post: post,
        createdAt: createdAt,
      };
    });
    // 4. 불러와서 재가공한 데이터를 State에 저장
    setPosts(timelinePosts);
  };

  // Timeline 컴포넌트 실행하는 순간,
  useEffect(() => {
    // 게시글 불러오기
    getPosts();
  }, []);

  // Page Design Rendering
  return (
    <Container>
      {posts.map((post) => {
        // posts에서 가져온 post를 보여주기
        return <Post />;
      })}
    </Container>
  );
};
