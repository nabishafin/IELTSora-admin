import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="surface flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="label-xs">Error 404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">The admin page you are looking for does not exist or has been moved.</p>
      <Button asChild className="mt-6">
        <Link to="/">
          <ArrowLeft /> Back to overview
        </Link>
      </Button>
    </div>
  );
}
