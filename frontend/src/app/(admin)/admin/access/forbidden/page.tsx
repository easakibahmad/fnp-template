import Link from "next/link";
import { ShieldOff } from "lucide-react";

export default function AccessForbiddenPage() {
  return (
    <div className="access-forbidden">
      <div className="access-forbidden-card">
        <ShieldOff size={28} strokeWidth={1.5} className="text-[var(--access-muted)]" />
        <h2 className="access-forbidden-title">Access denied</h2>
        <p className="access-forbidden-copy">
          You don&apos;t have permission to manage access rules. Contact an administrator
          if you need the <code className="access-code">RolesRead</code> permission.
        </p>
        <Link href="/dashboard" className="access-back-link mt-4 inline-flex">
          Return to operations app
        </Link>
      </div>
    </div>
  );
}
