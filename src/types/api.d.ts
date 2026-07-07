type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiConfig {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
}

interface RequestOptions {
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

interface ApiHolidayDay {
  name: string;
  date: string;
  isOffDay: boolean;
}

interface ApiResponse {
  year: number;
  days: ApiHolidayDay[];
}

interface FetchHolidaysParams {
  year: number;
}
