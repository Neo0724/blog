import GetPost from "../_component/GetPost";
import { SearchPostType } from "../_component/Enum";

export default function AllPostsPage() {
  return (
    <>
      <GetPost searchPostType={SearchPostType.ALL_POST} />
    </>
  );
}
