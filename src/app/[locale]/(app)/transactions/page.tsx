import { getTransactionsData } from './data';
import { TransactionsClient } from './transactions-client';

export default async function TransactionsPage() {
  const data = await getTransactionsData();

  return <TransactionsClient initialData={data} />;
}
