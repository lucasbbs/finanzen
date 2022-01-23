import axios from 'axios';
import { urlBase64ToUint8Array } from 'helpers/functions';
import Config from './config.json';

let key;
let authSecret;
let endPoint;

function determineAppServerKey() {
  var vapidPublicKey = `BOChVD1tKTc0Of3c-0JplT1y5FPOm6oijP_4stWBXwoQe6xI4GGt6cnpdu4JLwt_Znj23bj_hku8OSois1y9fLE`;
  return urlBase64ToUint8Array(vapidPublicKey);
}

export default function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register(`/sw.js`)
      .then(function (register) {
        // console.log('worked', register);
        // return register.pushManager
        //   .getSubscription()
        //   .then(function (subscription) {
        //     if (subscription) return;
        //     return register.pushManager
        //       .subscribe({
        //         userVisibleOnly: true,
        //         applicationServerKey: determineAppServerKey(),
        //       })
        //       .then(function (subscription) {
        //         const rawKey = subscription.getKey
        //           ? subscription.getKey('p256dh')
        //           : '';
        //         key = rawKey
        //           ? btoa(
        //               String.fromCharCode.apply(null, new Uint8Array(rawKey))
        //             )
        //           : '';
        //         var rawAuthSecret = subscription.getKey
        //           ? subscription.getKey('auth')
        //           : '';
        //         authSecret = rawAuthSecret
        //           ? btoa(
        //               String.fromCharCode.apply(
        //                 null,
        //                 new Uint8Array(rawAuthSecret)
        //               )
        //             )
        //           : '';
        //         endPoint = subscription.endpoint;
        //         console.log(JSON.parse(localStorage.getItem('userInfo')).token);
        //         const config = {
        //           headers: {
        //             'Content-Type': 'application/json',
        //             Authorization: `Bearer ${
        //               JSON.parse(localStorage.getItem('userInfo')).token
        //             }`,
        //           },
        //         };
        //         axios.post(
        //           `${Config.SERVER_ADDRESS}/api/pushNotifications/`,
        //           { endpoint: endPoint, key, auth: authSecret },
        //           config
        //         );
        //       });
        //   });
      })
      .catch(function (error) {
        console.error('Error', error);
      });
  }
}
