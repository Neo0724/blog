import GetPost from "../../_component/GetPost";
import { SearchPostType } from "../../_component/Enum";

export default function SearchPage({ params }: { params: any }) {
  const searchText = params.searchTitle.split("%20").join(" ");
  return (
    <>
      <GetPost
        searchPostType={SearchPostType.SEARCH_POST}
        searchText={searchText}
      />
    </>
  );
}
