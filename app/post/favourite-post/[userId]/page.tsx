import GetPost from "../../_component/GetPost";
import { SearchPostType } from "../../_component/Enum";

export default function FavouritePostPage({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <>
      <GetPost
        searchPostType={SearchPostType.USER_FAVOURITE_POST}
        userId={params.userId}
      />
    </>
  );
}
