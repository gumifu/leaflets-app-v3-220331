import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Moment from "react-moment";
import { db } from "../../firebase";
import { Map } from "../../components/Map";
import { useRouter } from "next/router";
import Header from "../../components/Header";

const Post = ({ post }) => {
  const router = useRouter();
  const {
    id,
    accountName,
    profileImg,
    img,
    caption,
    prefectures,
    placeInfo,
    shopName,
    shopEmail,
    shopTel,
    shopHomepage,
  } = post;
  // console.log(post.image);
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  );

  //hasliked
  useEffect(
    () =>
      setHasLiked(
        likes.findIndex((like) => like.id === session?.user?.uid) !== -1
      ),
    [likes]
  );

  //Confirmation of like? or not?
  const likePost = async () => {
    if (hasLiked) {
      //delete!!!!!
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        //If you want to send more data
        accountName: session.user.name,
        timestamp: serverTimestamp(),
      });
    }
  };

  // console.log(hasLiked);

  // snapshot comment!
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );

  //send comment to firebase!
  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment("");

    await addDoc(collection(db, "posts", id, "comments"), {
      comment: commentToSend,
      username: session.user.name,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-gray-900 h-screen overflow-y-scroll scrollbar-hide">
      <Header />

      <button
        className="ml-15 pl-15 h-16 w-16 text-white bg-red-400 rounded-full"
        type="button"
        onClick={() => router.replace("/")}
      >
        X
      </button>
      <div className="bg-white my-7 border border-black rounded-3xl relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* img */}
          <div className="bg-gray-100 p-10 rounded-3xl md:col-span-1">
            <div className=" bg-white shadow-2xl shadow-gray-900">
              <img src={post.image} alt="" className="object-cover w-full" />
            </div>
          </div>
          <div className=" md:col-span-1">
            {/* Button */}
            {session && (
              <div className=" flex  justify-between px-4 pt-4 h-300">
                <div className="flex space-x-4 items-center">
                  {hasLiked ? (
                    <BookmarkIcon
                      onClick={likePost}
                      className="btn text-red-500"
                    />
                  ) : (
                    <BookmarkIcon onClick={likePost} className="btn" />
                  )}
                  <ChatIcon className="btn" />
                  <PaperAirplaneIcon className="btn rotate-45" />
                </div>
                {/* <BookmarkIcon className="btn" /> */}
                <p className="px-5 py-3 mr-5 md:px-0 rounded-full truncate text-red-400 w-40 text-center">
                  {prefectures}
                  {placeInfo}
                </p>
              </div>
            )}
            <div className="">
              {likes.length > 0 && (
                <p className="font-bold ml-1 ">{likes.length} post</p>
              )}
            </div>
            {/* header */}
            <div className="flex items-center p-5 truncate ">
              <img
                src={profileImg}
                alt=""
                className=" rounded-full h-12 w-12 object-contain border p-1 mr-3"
              />
              <p className="flex-1 font-bold">{accountName}</p>
              <DotsHorizontalIcon className="h-5" />
            </div>
            {/* caption */}
            <p className="px-10 py-5 truncate font-bold">
              <span>{caption}</span>
            </p>

            {/* comments */}
            {comments.length > 0 && (
              <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-center space-x-2 mb-3"
                  >
                    <img
                      src={comment.data().userImage}
                      alt=""
                      className="h-7 rounded-full"
                    />
                    <p className="flex-1 text-sm">
                      <span className="font-bold">
                        {comment.data().accountName}
                      </span>{" "}
                      {comment.data().comment}
                    </p>
                    <Moment fromNow className="pr-5 text-xs text-gray-600">
                      {comment.data().timestamp?.toDate()}
                    </Moment>
                  </div>
                ))}
              </div>
            )}

            {/* inputbox */}
            {session && (
              <form action="" className="flex items-center p-4">
                <EmojiHappyIcon className="h-7" />
                <input
                  type="text"
                  className=" border-none flex-1 focus:ring-0 outline-none"
                  placeholder="コメントを残す..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  onClick={sendComment}
                  className=" text-blue-400 font-semibold"
                >
                  送信
                </button>
              </form>
            )}
            <Map coordinates={post.coordinates} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;

export async function getStaticProps({ params }) {
  const id = params.id;
  const postSnapshot = await getDoc(doc(db, "posts", id));
  // const post = postSnapshot.data();
  const post1 = postSnapshot.data();
  const post = JSON.parse(JSON.stringify(post1));

  post.id = postSnapshot.id;
  //   console.log(jsonPost);
  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  const postCollection = collection(db, "posts");
  const postSnapshot = await getDocs(postCollection);
  const posts = postSnapshot.docs.map((doc) => {
    const data = doc.data();
    data.id = doc.id;
    return data;
  });
  const paths = posts.map((post) => ({
    params: {
      id: post.id,
    },
  }));
  return {
    paths,
    fallback: false,
  };
}
