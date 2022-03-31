import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);

  // faker
  useEffect(() => {
    const suggestions = [...Array(5)].map((_, i) => ({
      ...faker.helpers.contextualCard(),
      id: i,
    }));
    // console.log(suggestions);
    setSuggestions(suggestions);
  }, []);

  return (
    <div className="mt-4 ml-10">
      <div className="flex justify-between text-sm mb-5 ">
        <h3 className="text-sm font-bold text-gray-200">おすすめ</h3>
        <button className="text-gray-300 font-semibold">すべて見る</button>
      </div>

      {suggestions.map((profile) => (
        <div
          className="flex items-center justify-between mt-3"
          key={profile.id}
        >
          <img
            className="w-10 h-10 rounded-full border p-[2px]"
            src={profile.avatar}
            alt=""
          />
          <div className="flex-1 ml-4">
            <h2 className="text-gray-100 font-smibold text-sm">
              {profile.username}
            </h2>
            <h3 className="text-gray-400 text-xs">
              Works at {profile.username}
            </h3>
          </div>
          <button className="text-blue-500 text-sm">フォローする</button>
        </div>
      ))}
    </div>
  );
};

export default Suggestions;
