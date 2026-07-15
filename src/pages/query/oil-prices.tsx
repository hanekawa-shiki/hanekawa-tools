import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchOilPriceApi } from '@/api';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const SKELETON_COUNT = 8;

function formatPrice(price: number): string {
  return price.toFixed(2);
}

function OilPriceTable({ data }: { data: OilPriceCityData[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>省/市</TableHead>
          <TableHead className="text-right">92#汽油</TableHead>
          <TableHead className="text-right">95#汽油</TableHead>
          <TableHead className="text-right">0#柴油</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.dim_id}>
            <TableCell className="font-medium">{item.city_name}</TableCell>
            <TableCell className="text-right">{formatPrice(item.v92)}</TableCell>
            <TableCell className="text-right">{formatPrice(item.v95)}</TableCell>
            <TableCell className="text-right">{formatPrice(item.v0)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function OilPrices() {
  const [prices, setPrices] = useState<OilPriceCityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateDate, setUpdateDate] = useState('');

  const loadPrices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchOilPriceApi();
      const sorted = [...response.data].sort((a, b) =>
        a.first_letter.localeCompare(b.first_letter, 'zh-CN')
      );
      setPrices(sorted);
      setUpdateDate(response.date);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPrices();
  }, [loadPrices]);

  const midpoint = useMemo(() => Math.ceil(prices.length / 2), [prices]);
  const leftData = useMemo(() => prices.slice(0, midpoint), [prices, midpoint]);
  const rightData = useMemo(() => prices.slice(midpoint), [prices, midpoint]);

  return (
    <div className="size-full">
      <PageHeader />
      <div className="mt-4">
        {updateDate !== '' && (
          <p className="mb-4 text-sm text-muted-foreground">数据更新日期：{updateDate}</p>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <>
            <div className="lg:hidden">
              <OilPriceTable data={prices} />
            </div>
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
              <OilPriceTable data={leftData} />
              <OilPriceTable data={rightData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
