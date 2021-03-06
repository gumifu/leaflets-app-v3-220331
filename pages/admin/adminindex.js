import { useRecoilState } from "recoil";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { CameraIcon } from "@heroicons/react/outline";
import { db, storage } from "../../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
// import { useSession } from "next-auth/react";
import { ref, getDownloadURL, uploadString } from "@firebase/storage";
import Image from "next/image";
import { useRouter } from "next/router";

export default function AdminIndex() {
  // const { data: session } = useSession();
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);
  const prefecRef = useRef(null);
  const placeRef = useRef(null);
  const shopNameRef = useRef(null);
  const classificationRef = useRef(null);
  const emailRef = useRef(null);
  const telRef = useRef(null);
  const homepageRef = useRef(null);
  const latRef = useRef(null);
  const lngRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter();

  // firebase post!!!
  const uploadPost = async () => {
    if (loading) return;

    setLoading(true);

    // 1)Create a post and add to firestore 'posts' collectuion
    // 2)get the post ID for the newly created post
    // 3)upload the image to firebase storage with the post ID
    // 4)get a download URL from fb storage and update to the original post with image

    const docRef = await addDoc(collection(db, "posts"), {
      // username: session.user.username,
      // accountName: session.user.name,
      caption: captionRef.current.value,
      prefectures: prefecRef.current.value,
      place: placeRef.current.value,
      shopName: shopNameRef.current.value,
      classification: classificationRef.current.value,
      shopEmail: emailRef.current.value,
      shopTel: telRef.current.value,
      shopHomepage: homepageRef.current.value,
      // profileImg: session.user.image,
      coordinates: {
        latitude: Number(latRef.current.value),
        longitude: Number(lngRef.current.value),
      },
      timestamp: serverTimestamp(),
    });
    // await addDoc(collection(db, "posts"), {
    //   coordinates: lesserGeopoint(latRef.current.value, lngRef.current.value)
    // });
    console.log("New doc added with ID", docRef.id);
    // img to Storage! & Store
    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snaphot) => {
        const downloadURL = await getDownloadURL(imageRef);

        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      }
    );
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
    console.log(reader);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-700 to-black h-screen overflow-y-scroll scrollbar-hide">
      <div className="flex flex-col items-center">
        <div
          onClick={() => router.push("/")}
          className="my-2  relative w-40 h-40 hidden lg:inline-grid cursor-pointer "
        >
          <Image
            src="/logo-main-white.svg"
            layout="fill"
            className=""
            objectFit="contain"
          />
        </div>
        <h1 className=" text-white text-2xl italic">Upload Page</h1>
      </div>
      {/* Modal????????? */}
      <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-10 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 overflow-y-scroll scrollbar-hide">
        <div>
          {selectedFile ? (
            <img
              src={selectedFile}
              onClick={() => setSelectedFile(null)}
              alt=""
              className="w-full object-contain cursor-pointer"
            />
          ) : (
            <div
              onClick={() => filePickerRef.current.click()}
              className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 cursor-pointer"
            >
              <CameraIcon
                className="h-6 w-6 text-blue-600"
                aria-hidden="true"
              />
            </div>
          )}
          <div className="mt-10">
            <div className="mt-10 text-center sm:mt-5 ">
              <div>
                <input
                  ref={filePickerRef}
                  type="file"
                  hidden
                  onChange={addImageToPost}
                  required
                />
              </div>
              {/* ??????????????? */}
              <div className="mt-2 border-b-2">
                <input
                  className="border-none focus:right-0 w-full text-center"
                  ref={shopNameRef}
                  type="text"
                  placeholder="???????????????"
                  required
                />
              </div>
              <div className="mt-2 border-b-2">
                <input
                  className="border-none focus:right-0 w-full text-center"
                  ref={latRef}
                  type="number"
                  placeholder="??????"
                  required
                />
                <input
                  className="border-none focus:right-0 w-full text-center"
                  ref={lngRef}
                  type="number"
                  placeholder="??????"
                  required
                />
              </div>
              <select
                ref={classificationRef}
                name="classification"
                className="border-none mr-1"
              >
                <option value="?????????">?????????</option>
                <option value="????????????">????????????</option>
                <option value="?????????">?????????</option>
                <option value="?????????">?????????</option>
                <option value="?????????">?????????</option>
                <option value="?????????">?????????</option>
              </select>
              {/* ??????????????????????????? */}
              <div className="mt-2 border-b-2">
                <input
                  className="border-none focus:right-0 w-full text-center"
                  ref={captionRef}
                  type="text"
                  placeholder="???????????????????????????"
                  required
                />
              </div>
              {/* <span class="p-country-name" style="display:none;">Japan</span> */}
              {/* <div className="flex items-center justify-center mt-5  border-b-2">
                    <p>???</p>
                      <input
                          className="border-none focus:right-0 w-18 text-center"
                          ref={placeRef}
                          type="text"
                      placeholder="????????????"
                      maxlength="8"
                        />
                    </div> */}
              {/* ??????????????? */}
              <div className="mt-5 flex items-center border-b-2">
                <select
                  ref={prefecRef}
                  name="prefectures"
                  className="border-none mr-1"
                >
                  <option value="?????????">?????????</option>
                  <option value="?????????">?????????</option>
                  <option value="?????????">?????????</option>
                  <option value="?????????">?????????</option>
                  <option value="?????????">?????????</option>
                </select>
                <input
                  className="border-none focus:right-0 w-full text-center"
                  ref={placeRef}
                  type="text"
                  placeholder="???????????????"
                />
              </div>
              {/* ????????????????????? */}
              <input
                className="mt-5 border-none focus:right-0 w-full text-center"
                ref={emailRef}
                type="email"
                placeholder="Email????????????"
              />
              {/* ????????????????????? */}
              <input
                className="mt-5 border-none focus:right-0 w-full text-center"
                ref={telRef}
                type="number"
                placeholder="????????????"
              />
              {/* ??????????????????????????????????????? */}
              <input
                className="mt-5 border-none focus:right-0 w-full text-center"
                ref={homepageRef}
                type="url"
                placeholder="??????????????????"
              />
            </div>
          </div>

          <div className="mt-5 sm:mt-6">
            {/* somewhere wrong? */}
            <button
              type="button"
              disabled={!selectedFile}
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus-within:ring-2 focus:ring-blue-600 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed  hover:disabled:bg-gray-300"
              onClick={uploadPost}
            >
              {loading ? "?????????????????????..." : "??????????????????"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
