import RenderPost from "../../_component/postComponent/RenderPost";
import { SearchPostType } from "../../_component/Enum";

export default function SearchPage({ params }: { params: any }) {
  const searchText = params.searchTitle.split("%20").join(" ");
  return (
    <>
      <RenderPost
        searchPostType={SearchPostType.SEARCH_POST}
        searchText={searchText}
      />
    </>
  );
}
