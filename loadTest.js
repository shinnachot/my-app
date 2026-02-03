import { check, sleep } from 'k6';
import http from 'k6/http';

export default function () {
    const res = http.get('https://boyautogroup.com/');
    check(res, {
        'is status 200': (r) => r.status === 200,
    });
    sleep(1); // wait for a second before making another request
}