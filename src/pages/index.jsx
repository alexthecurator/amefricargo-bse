import Card from "@/components/cards";
import Navbar from "@/components/navbar";
import Placeholder from "@/components/placeholder";

export default function Home() {
  return (
    <main className={`space-y-8`}>
      <Navbar />
      {/* <Placeholder /> */}
      <Issues />
    </main>
  );
}

const Issues = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <span className="w-1/2 flex flex-col items-center justify-center space-y-2">
        {[
          {
            title: "Looking for new speaker adapters",
            caption: "This cards from ...",
            details: "I have this issue with my device since yesterday",
          },
          {
            title: "Replacing Ipad screen",
            caption: "This cards from ...",
            details: "I have this issue with my device since yesterday",
          },
          {
            title: "Certain problem with my macbook",
            caption: "This cards from ...",
            details: "I have this issue with my device since yesterday",
          },
          {
            title: "Certain problem with my macbook",
            caption: "This cards from ...",
            details: "I have this issue with my device since yesterday",
          },
          {
            title: "Certain problem with my macbook",
            caption: "This cards from ...",
            details: "I have this issue with my device since yesterday",
          },
        ].map((issue, index) => {
          return <Card key={index} {...issue} />;
        })}
      </span>
    </div>
  );
};
