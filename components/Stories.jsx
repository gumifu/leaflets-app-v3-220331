import { faker } from "@faker-js/faker";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Story from "./Story";

const Stories = () => {
  const [suggestions, setSuggestions] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const suggestions = [...Array(20)].map((_, i) => ({
      ...faker.helpers.contextualCard(),
      id: i,
    }));
    // console.log(suggestions);
    setSuggestions(suggestions);
  }, []);

  return (
    <div>
      <div className="flex space-x-2 p-6 bg-white mt-8 border-gray-200 border rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-blue-100">
        {session && (
          <Story img={session.user.image} username={session.user.name} />
        )}
        {suggestions.map((profile) => (
          <Story
            key={profile.id}
            img={profile.avatar}
            username={profile.name}
          />
        ))}
      </div>
    </div>
  );
};

export default Stories;
