import { SearchPostType } from "@/app/post/_component/Enum";
import RenderPost from "@/app/post/_component/postComponent/RenderPost";
import { FollowerTab } from "@/app/_components/userRelationship/FollowerTab";
import { FollowingTab } from "@/app/_components/userRelationship/FollowingTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export const dynamic = "force-dynamic";
export default function UserPage({ params }: { params: { userId: string } }) {
  return (
    <div>
      <Tabs defaultValue="post" className="max-w-[800px]">
        <TabsList className="grid w-full grid-cols-3 bg-[rgb(36,37,38)] text-white">
          <TabsTrigger className="font-bold" value="post">
            Posts
          </TabsTrigger>
          <TabsTrigger className="font-bold" value="follower">
            Follower
          </TabsTrigger>
          <TabsTrigger className="font-bold" value="following">
            Following
          </TabsTrigger>
        </TabsList>
        <TabsContent value="post">
          <RenderPost
            searchPostType={SearchPostType.USER_POST}
            userId={params.userId}
          />
        </TabsContent>
        <TabsContent value="follower">
          <FollowerTab pageOwnerUserId={params.userId} />
        </TabsContent>
        <TabsContent value="following">
          <FollowingTab pageOwnerUserId={params.userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
