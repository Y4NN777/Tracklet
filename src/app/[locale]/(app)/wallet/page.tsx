import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet as WalletIcon, ReceiptText } from "lucide-react";
import { getIntlayer } from "intlayer";
import { getAccountsData, getTransactionsData } from "@/components/wallet/wallet-data";
import { AccountsClient } from "@/components/wallet/accounts-client";
import { TransactionsClient } from "@/components/wallet/transactions-client";

export default async function WalletHub({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const i = getIntlayer('main-nav', locale as any);

  const [accountsData, transactionsData] = await Promise.all([
    getAccountsData(),
    getTransactionsData()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{i.wallet}</h1>
        <p className="text-muted-foreground text-lg">Manage your accounts and track transactions.</p>
      </div>

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="accounts" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <WalletIcon className="h-4 w-4" />
            {i.accounts}
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ReceiptText className="h-4 w-4" />
            {i.transactions}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="mt-0 outline-none">
          <AccountsClient initialData={accountsData} />
        </TabsContent>

        <TabsContent value="transactions" className="mt-0 outline-none">
          <TransactionsClient initialData={transactionsData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
