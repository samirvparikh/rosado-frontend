import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";

export function NotFoundPage() {
  return (
    <>
      <PageMeta title="Page not found" description="This ROSADO page does not exist." />
      <PageShell className="py-24 text-center">
        <h1 className="font-display text-5xl">This page does not exist.</h1>
        <div className="mt-8">
          <Link to="/">
            <Button>Return home</Button>
          </Link>
        </div>
      </PageShell>
    </>
  );
}
