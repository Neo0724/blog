import RenderPost from "../../_component/postComponent/RenderPost";
import { SearchPostType } from "../../_component/Enum";
export const dynamic = "force-dynamic";

export default function FavouritePostPage({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <>
      <RenderPost
        searchPostType={SearchPostType.USER_FAVOURITE_POST}
        userId={params.userId}
      />
    </>
  );
}
