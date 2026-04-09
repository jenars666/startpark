import RegisterPageClient from './RegisterPageClient';
import { getSingleSearchParam, sanitizeInternalPath } from '../../lib/internalPaths';

type RegisterPageProps = {
  searchParams: Promise<{
    redirect?: string | string[] | undefined;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const resolvedSearchParams = await searchParams;
  const redirectTo = sanitizeInternalPath(
    getSingleSearchParam(resolvedSearchParams.redirect),
    '/profile'
  );

  return <RegisterPageClient redirectTo={redirectTo} />;
}
