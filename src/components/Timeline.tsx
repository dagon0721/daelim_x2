// 작성된 게시글을 시간 순으로 불러와 보여주는 컴포넌트

import { useEffect, useState } from "react";
import styled from "styled-components";
import { IPost } from "../types/PostInput";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import Post from "./Post";
import { Unsubscribe } from "firebase/auth";
import { unsubscribe } from "diagnostics_channel";

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
      const { userId, nickname, post, createdAt, email } = doc.data() as IPost;
      // 내가 쓸 수 있도록 형태를 수정
      return {
        createdAt: createdAt,
        email: email,
        nickname: nickname,
        post: post,
        userId: userId,
        id: doc.id,
      };
    });
    // 4. 불러와서 재가공한 데이터를 State에 저장
    setPosts(timelinePosts);
  };

  // Timeline 컴포넌트 실행하는 순간,
  useEffect(() => {
    // 게시글 불러오기
    // getPosts();

    // 1. listener 등록을 위한 구독장치 생성
    let unSubscribe: Unsubscribe | null = null;

    // (선언)realtime으로 게시글을 불러오기
    const getPostsRealtime = async () => {
      // 2. Firebase DB에서 게시글 가져올 쿼리 생성
      const path = collection(firestore, "posts");
      const condition = orderBy("createdAt", "desc");
      const postsQuery = query(path, condition);
      // 4. 받아온 게시글을 구독장치에 등록하여 실시간 체크
      unSubscribe = await onSnapshot(postsQuery, (snapshot) => {
        // 3. 쿼리를 통해 게시글 받아오기 => 가공
        const timelinePosts = snapshot.docs.map((doc) => {
          const { createdAt, email, nickname, post, userId } =
            doc.data() as IPost;
          return {
            createdAt,
            email,
            nickname,
            post,
            userId,
            id: doc.id,
          };
        });
        setPosts(timelinePosts);
      });
    };

    getPostsRealtime(); //(사용)
    // 5. Timeline 페이지에서 나가면
    return () => {
      // 구독해제(=실시간체크 해제)
      unSubscribe && unSubscribe();
      // alert("페이지 나감");
    };
  }, []);

  // Page Design Rendering
  return (
    <Container>
      {posts.map((post) => {
        // posts에서 가져온 post를 보여주기
        return (
          <Post
            id={post.id}
            email={post.email}
            nickname={post.nickname}
            createdAt={post.createdAt}
            userId={post.userId}
            post={post.post}
          />
        );
      })}
    </Container>
  );
};
