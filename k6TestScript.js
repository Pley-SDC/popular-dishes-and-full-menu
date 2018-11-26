import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 30,
  duration: '60s',
  rps: 1000,
};

export default function () {
  http.get(`http://localhost:3004/restaurantName/${Math.floor(Math.random() * (10000000 - 9000000 + 1) + 9000000)}/menu`);
  sleep(1);
}
