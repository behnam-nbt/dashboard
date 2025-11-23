import Sidebar from "@/components/modules/Sidebar";
import { requireAdmin } from "@/lib/authHelpers";
import { redirect } from "next/navigation";

async function layout({ children }) {
    const session = await requireAdmin();

    if (!session) {
        redirect('/not-found');
    }

    if (session.user.role !== "admin") {
        redirect('/');
    }

    return (
        <div className='min-h-screen pt-[120px] grid grid-cols-[1fr_5fr] gap-4 px-4 md:px-20 lg:px-40 bg-zinc-200'>
            <Sidebar />
            {children}
        </div>
    )
}

export default layout