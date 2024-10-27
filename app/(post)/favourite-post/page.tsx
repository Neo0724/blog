import GetPost from "../_component/GetPost";
import { SearchPostType } from "../_component/Enum";

export default function FavouritePostPage() {
  return (
    <>
      <GetPost searchPostType={SearchPostType.FAVOURITE_POST} />
    </>
  );
}
