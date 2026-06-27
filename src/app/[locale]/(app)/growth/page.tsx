import { getGrowthData } from './data';
import { GrowthClient } from './growth-client';

export default async function GrowthHub() {
  const data = await getGrowthData();

  return <GrowthClient initialData={data} />;
}
