import { SearchPostType } from "@/app/post/_component/Enum";
import GetPost from "@/app/post/_component/GetPost";
import { FollowerTab } from "@/app/_components/FollowerTab";
import { FollowingTab } from "@/app/_components/FollowingTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UserPage({ params }: { params: { userId: string } }) {
  return (
    <div>
      <Tabs defaultValue="following" className="max-w-[800px]">
        <TabsList className="grid w-full grid-cols-3">
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
          <GetPost
            searchPostType={SearchPostType.USER_POST}
            userId={params.userId}
          />
        </TabsContent>
        <TabsContent value="follower">
          <FollowerTab userId={params.userId} />
        </TabsContent>
        <TabsContent value="following">
          <FollowingTab userId={params.userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
