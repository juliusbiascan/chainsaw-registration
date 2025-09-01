import { auth } from "@/auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth()

  if (!session?.user) {
    return redirect('/auth/login');
  } else {
    redirect('/dashboard/overview');
  }

}

export default DashboardPage;