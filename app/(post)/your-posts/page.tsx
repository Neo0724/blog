import GetPost from "../_component/GetPost";
import { SearchPostType } from "../_component/Enum";

export default function YourPostsPage() {
  return (
    <>
      <GetPost searchPostType={SearchPostType.OWN_POST} />
    </>
  );
}
