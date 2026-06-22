import { PageHero } from "@/components/page-hero";

export function LegalPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <section className="section">
        <article className="container legal">
          <div className="notice-box">
            Draft for platform development. This policy must be reviewed and
            approved by qualified Ugandan legal and privacy advisers before
            live payment operations.
          </div>
          {children}
        </article>
      </section>
    </>
  );
}
