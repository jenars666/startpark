import LoginPageClient from './LoginPageClient';
import { getSingleSearchParam, sanitizeInternalPath } from '../../lib/internalPaths';

type LoginPageProps = {
  searchParams: Promise<{
    redirect?: string | string[] | undefined;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const redirectTo = sanitizeInternalPath(
    getSingleSearchParam(resolvedSearchParams.redirect),
    '/'
  );

  return <LoginPageClient redirectTo={redirectTo} />;
}
