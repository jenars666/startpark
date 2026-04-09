import OrderSuccessClient from './OrderSuccessClient';
import { getSingleSearchParam } from '../../lib/internalPaths';

type OrderSuccessPageProps = {
  searchParams: Promise<{
    amount?: string | string[] | undefined;
    orderId?: string | string[] | undefined;
    paymentId?: string | string[] | undefined;
  }>;
};

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const orderId = getSingleSearchParam(resolvedSearchParams.orderId) || 'ORDER-PENDING';
  const amount = getSingleSearchParam(resolvedSearchParams.amount) || '0';
  const paymentId = getSingleSearchParam(resolvedSearchParams.paymentId) || 'N/A';

  return (
    <OrderSuccessClient amount={amount} orderId={orderId} paymentId={paymentId} />
  );
}
