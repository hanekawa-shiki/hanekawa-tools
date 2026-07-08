import { createApi } from './request';

export const fetchHolidaysApi = createApi<ApiResponse>({
  method: 'POST',
  url: '/holidays/year',
});
