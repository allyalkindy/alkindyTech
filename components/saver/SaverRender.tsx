import TikTokSaverCard from "./TikTokSaverCard";
import InstagramSaverCard from "./InstagramSaverCard";

type Props = {
  platform: string;
};

export default function SaverRenderer({ platform }: Props) {
  switch (platform) {
    case "tiktok":
      return <TikTokSaverCard />;
    case "instagram":
      return <InstagramSaverCard />;

    default:
      return <div className="text-gray-400">Platform not supported yet</div>;
  }
}
