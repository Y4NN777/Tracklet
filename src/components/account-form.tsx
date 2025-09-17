'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/contexts/preferences-context';

const accountSchema = z.object({
  name: z.string().min(2, {
    message: "Account name must be at least 2 characters.",
  }),
  type: z.enum(['checking', 'savings', 'credit', 'investment'], {
    required_error: "Please select an account type.",
  }),
  balance: z.coerce.number({
    required_error: "Balance is required.",
  }),
  currency: z.string().min(3, {
    message: "Currency must be selected.",
  }),
});

type AccountFormValues = z.infer<typeof accountSchema>

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
}

interface AccountFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: AccountFormValues) => void;
  editingAccount?: Account | null;
  onClose?: () => void;
}

export function AccountForm({ open, setOpen, onSubmit, editingAccount, onClose }: AccountFormProps) {
  const { toast } = useToast();
  const { currency } = useCurrency();
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: undefined,
      balance: 0,
      currency: currency,
    },
  })

  // Handle editing mode
  useEffect(() => {
    if (editingAccount) {
      form.reset({
        name: editingAccount.name,
        type: editingAccount.type,
        balance: editingAccount.balance,
        currency: editingAccount.currency,
      });
    } else {
      form.reset({
        name: "",
        type: undefined,
        balance: 0,
        currency: currency,
      });
    }
  }, [editingAccount, form, currency]);

  function handleClose() {
    form.reset();
    setOpen(false);
    if (onClose) onClose();
  }

  async function onSubmitHandler(values: AccountFormValues) {
    try {
      await onSubmit(values);
      toast({
        title: "Account added.",
        description: "Your account has been added successfully.",
      })
      handleClose();
    } catch (error) {
      console.error('Account creation failed:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingAccount ? 'Edit Account' : 'Add Account'}</DialogTitle>
          <DialogDescription>
            {editingAccount
              ? 'Update your account information.'
              : 'Add a new financial account to track your money.'
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Main Checking, Emergency Savings" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your account a descriptive name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select account type</option>
                      <option value="checking">Checking - Primary spending account</option>
                      <option value="savings">Savings - High-interest savings</option>
                      <option value="credit">Credit Card - Credit accounts</option>
                      <option value="investment">Investment - Retirement, stocks, etc.</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    What type of financial account is this?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Balance</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your current account balance. Use negative values for debt.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {/* Major Global Reserve Currencies */}
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="CHF">CHF - Swiss Franc</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="CNY">CNY - Chinese Yuan</option>

                      {/* European Currencies */}
                      <option value="SEK">SEK - Swedish Krona</option>
                      <option value="NOK">NOK - Norwegian Krone</option>
                      <option value="DKK">DKK - Danish Krone</option>
                      <option value="PLN">PLN - Polish Złoty</option>
                      <option value="CZK">CZK - Czech Koruna</option>
                      <option value="HUF">HUF - Hungarian Forint</option>
                      <option value="RON">RON - Romanian Leu</option>
                      <option value="BGN">BGN - Bulgarian Lev</option>
                      <option value="HRK">HRK - Croatian Kuna</option>
                      <option value="ISK">ISK - Icelandic Króna</option>

                      {/* North American Currencies */}
                      <option value="MXN">MXN - Mexican Peso</option>

                      {/* South American Currencies */}
                      <option value="BRL">BRL - Brazilian Real</option>
                      <option value="ARS">ARS - Argentine Peso</option>
                      <option value="CLP">CLP - Chilean Peso</option>
                      <option value="COP">COP - Colombian Peso</option>
                      <option value="PEN">PEN - Peruvian Sol</option>
                      <option value="UYU">UYU - Uruguayan Peso</option>
                      <option value="PYG">PYG - Paraguayan Guarani</option>
                      <option value="BOB">BOB - Bolivian Boliviano</option>
                      <option value="VES">VES - Venezuelan Bolívar</option>

                      {/* Asian Currencies */}
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="KRW">KRW - South Korean Won</option>
                      <option value="SGD">SGD - Singapore Dollar</option>
                      <option value="HKD">HKD - Hong Kong Dollar</option>
                      <option value="TWD">TWD - New Taiwan Dollar</option>
                      <option value="THB">THB - Thai Baht</option>
                      <option value="MYR">MYR - Malaysian Ringgit</option>
                      <option value="IDR">IDR - Indonesian Rupiah</option>
                      <option value="PHP">PHP - Philippine Peso</option>
                      <option value="VND">VND - Vietnamese Dong</option>
                      <option value="PKR">PKR - Pakistani Rupee</option>
                      <option value="BDT">BDT - Bangladeshi Taka</option>
                      <option value="LKR">LKR - Sri Lankan Rupee</option>
                      <option value="NPR">NPR - Nepalese Rupee</option>
                      <option value="MMK">MMK - Myanmar Kyat</option>
                      <option value="KHR">KHR - Cambodian Riel</option>
                      <option value="LAK">LAK - Lao Kip</option>

                      {/* Middle East & Central Asian Currencies */}
                      <option value="SAR">SAR - Saudi Riyal</option>
                      <option value="AED">AED - UAE Dirham</option>
                      <option value="QAR">QAR - Qatari Riyal</option>
                      <option value="KWD">KWD - Kuwaiti Dinar</option>
                      <option value="BHD">BHD - Bahraini Dinar</option>
                      <option value="OMR">OMR - Omani Rial</option>
                      <option value="JOD">JOD - Jordanian Dinar</option>
                      <option value="ILS">ILS - Israeli Shekel</option>
                      <option value="TRY">TRY - Turkish Lira</option>
                      <option value="EGP">EGP - Egyptian Pound</option>
                      <option value="MAD">MAD - Moroccan Dirham</option>
                      <option value="TND">TND - Tunisian Dinar</option>
                      <option value="DZD">DZD - Algerian Dinar</option>
                      <option value="LYD">LYD - Libyan Dinar</option>
                      <option value="SDG">SDG - Sudanese Pound</option>
                      <option value="SYP">SYP - Syrian Pound</option>
                      <option value="IQD">IQD - Iraqi Dinar</option>
                      <option value="IRR">IRR - Iranian Rial</option>
                      <option value="YER">YER - Yemeni Rial</option>
                      <option value="AZN">AZN - Azerbaijani Manat</option>
                      <option value="KZT">KZT - Kazakhstani Tenge</option>
                      <option value="UZS">UZS - Uzbekistani Som</option>
                      <option value="TJS">TJS - Tajikistani Somoni</option>
                      <option value="TMT">TMT - Turkmenistani Manat</option>
                      <option value="AFN">AFN - Afghan Afghani</option>

                      {/* African Currencies */}
                      <option value="ZAR">ZAR - South African Rand</option>
                      <option value="NGN">NGN - Nigerian Naira</option>
                      <option value="KES">KES - Kenyan Shilling</option>
                      <option value="TZS">TZS - Tanzanian Shilling</option>
                      <option value="UGX">UGX - Ugandan Shilling</option>
                      <option value="RWF">RWF - Rwandan Franc</option>
                      <option value="BIF">BIF - Burundian Franc</option>
                      <option value="ETB">ETB - Ethiopian Birr</option>
                      <option value="GHS">GHS - Ghanaian Cedi</option>
                      <option value="XOF">XOF - West African CFA Franc</option>
                      <option value="XAF">XAF - Central African CFA Franc</option>
                      <option value="CDF">CDF - Congolese Franc</option>
                      <option value="MGA">MGA - Malagasy Ariary</option>
                      <option value="MUR">MUR - Mauritian Rupee</option>
                      <option value="SCR">SCR - Seychellois Rupee</option>
                      <option value="MWK">MWK - Malawian Kwacha</option>
                      <option value="ZMW">ZMW - Zambian Kwacha</option>
                      <option value="BWP">BWP - Botswana Pula</option>
                      <option value="SZL">SZL - Swazi Lilangeni</option>
                      <option value="LSL">LSL - Lesotho Loti</option>
                      <option value="NAD">NAD - Namibian Dollar</option>
                      <option value="MZN">MZN - Mozambican Metical</option>
                      <option value="AOA">AOA - Angolan Kwanza</option>
                      <option value="CVE">CVE - Cape Verdean Escudo</option>
                      <option value="STN">STN - São Tomé and Príncipe Dobra</option>
                      <option value="GMD">GMD - Gambian Dalasi</option>
                      <option value="SLL">SLL - Sierra Leonean Leone</option>
                      <option value="LRD">LRD - Liberian Dollar</option>

                      {/* Oceania Currencies */}
                      <option value="NZD">NZD - New Zealand Dollar</option>
                      <option value="FJD">FJD - Fijian Dollar</option>
                      <option value="TOP">TOP - Tongan Paʻanga</option>
                      <option value="WST">WST - Samoan Tala</option>
                      <option value="VUV">VUV - Vanuatu Vatu</option>
                      <option value="SBD">SBD - Solomon Islands Dollar</option>
                      <option value="PGK">PGK - Papua New Guinean Kina</option>

                      {/* Cryptocurrencies (for completeness) */}
                      <option value="BTC">BTC - Bitcoin</option>
                      <option value="ETH">ETH - Ethereum</option>
                      <option value="USDT">USDT - Tether</option>
                      <option value="BNB">BNB - Binance Coin</option>
                      <option value="ADA">ADA - Cardano</option>
                      <option value="SOL">SOL - Solana</option>
                      <option value="DOT">DOT - Polkadot</option>
                      <option value="DOGE">DOGE - Dogecoin</option>
                      <option value="AVAX">AVAX - Avalanche</option>
                      <option value="MATIC">MATIC - Polygon</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{editingAccount ? 'Update Account' : 'Add Account'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}