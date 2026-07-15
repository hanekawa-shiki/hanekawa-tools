import { createApi } from './request';

export const fetchHolidayApi = createApi<HolidayApiResponse>({
  method: 'POST',
  url: '/holidays/year',
});

export const fetchOilPriceApi = createApi<OilPriceApiResponse>({
  method: 'POST',
  url: '/oil-prices',
});
