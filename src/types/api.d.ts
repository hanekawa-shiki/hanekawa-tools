type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
}

interface ApiRequestOptions {
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

interface HolidayData {
  name: string;
  date: string;
  isOffDay: boolean;
}

interface HolidayApiResponse {
  year: number;
  days: HolidayData[];
}

interface HolidayFetchParams {
  year: number;
}

interface OilPriceCityData {
  dim_id: string;
  dim_date: string;
  city_name: string;
  first_letter: string;
  v0: number;
  v92: number;
  v95: number;
  v89: number;
  zde0: number;
  zde92: number;
  zde95: number;
  zde89: number;
  qe0: number;
  qe92: number;
  qe95: number;
  qe89: number;
  highlight?: boolean;
}

interface OilPriceApiResponse {
  data: OilPriceCityData[];
  total: number;
  date: string;
}
