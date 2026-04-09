import OrderConfirmationClient from './OrderConfirmationClient';
import { getSingleSearchParam } from '../../lib/internalPaths';

type OrderConfirmationPageProps = {
  searchParams: Promise<{
    orderId?: string | string[] | undefined;
  }>;
};

export default async function OrderConfirmationPage({
  searchParams,
}: OrderConfirmationPageProps) {
  const resolvedSearchParams = await searchParams;
  const orderId = getSingleSearchParam(resolvedSearchParams.orderId) || null;

  return <OrderConfirmationClient orderId={orderId} />;
}
