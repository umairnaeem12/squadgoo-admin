import ProfileView from "@/components/user-profile/ProfileView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | SquadGoo Admin",
  description: "User profile details, reviews, feedback and assigned tasks.",
};

export default function Profile() {
  return <ProfileView />;
}
