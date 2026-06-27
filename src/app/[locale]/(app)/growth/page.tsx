import { getGrowthData } from './data';
import { GrowthClient } from './growth-client';

export default async function GrowthHub({ params }: { params: Promise<{ locale: string }> }) {
  const data = await getGrowthData();

  return <GrowthClient initialData={data} />;
}
