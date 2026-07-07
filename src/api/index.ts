import { createApi } from './request';

export const fetchHolidaysApi = createApi<ApiResponse>({
  method: 'POST',
  url: 'https://holiday-cn-worker.angelbeast.workers.dev/api/holidays/year',
});
