
import AdminUsersPanel from "../components/Admin/AdminUserPanel";
import ClubApprovalRequest from "../components/Admin/ClubApprovalRequest";

 



export default function AdminPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-black text-center">Admin Panel</h1>
      <AdminUsersPanel />
      <ClubApprovalRequest/>
    </div>
  );
}