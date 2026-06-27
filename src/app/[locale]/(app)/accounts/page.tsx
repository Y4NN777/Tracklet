import { getAccountsData } from './data';
import { AccountsClient } from './accounts-client';

export default async function AccountsPage() {
  const data = await getAccountsData();

  return <AccountsClient initialData={data} />;
}
