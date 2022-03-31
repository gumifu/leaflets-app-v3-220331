import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import Post from "./Post";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

// const posts = [
//     {
//         id: '123',
//         shopName: 'ジーズアカデミーFUKUOKA／エンジニア養成学校',
//         shopImg: '/gs-logo.png',
//         img: 'https://gsacademy.jp/uploads/og-3.png',
//         caption: '福岡市エンジニアフレンドリーシティに所属。エンジニアとしての就職だけでなく、フリーランスになるためのお仕事紹介や共同受託仲間探しまでサポート。',
//         placeInfo:'福岡県福岡市中央区大名 1-3-41 プリオ大名 1F・2F',
//         shopTel:'092-761-5777',
//         shopEmail:'fukuoka@gsacademy.jp',
//     },
// ]

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    [db]
  );
  // console.log(db);

  return (
    <>
      {/* // <div className="grid grid-cols-2 m-14 gap-5 md:grid-cols-4"> */}
      <Masonry
        className="flex animate-slide-fwd"
        breakpointCols={breakpointColumnsObj}
      >
        {/* Post */}
        {posts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            accountName={post.data().accountName}
            profileImg={post.data().profileImg}
            img={post.data().image}
            caption={post.data().caption}
            prefectures={post.data().prefectures}
            placeInfo={post.data().place}
            // shopName={ post.data().shopName}
            // shopEmail={ post.data().shopEmail}
            // shopTel={ post.data().shopTel}
            // shopHomepage={ post.data().shopHomepage}
          />
        ))}
      </Masonry>
    </>
  );
};

export default Posts;
