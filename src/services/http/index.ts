import { HTTPTransport } from '@/modules/http';

const baseUrl = 'https://ya-praktikum.tech/api/v2';

const httpTransport = new HTTPTransport({ baseUrl, withCredentials: true });

export default httpTransport;
