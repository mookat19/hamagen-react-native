import WifiManager from 'react-native-wifi-reborn';
import { NetworkInfo } from 'react-native-network-info';
// @ts-ignore
import { sha1 } from 'react-native-sha1';
import { IS_IOS } from '../constants/Constants';

export const getWifiList = async () => {
  try {
    let bssids;
    let bssidsToConvert = '';
    let hexBssidsString;
    if (IS_IOS) {
      bssids = await NetworkInfo.getBSSID();

      if (bssids) {
        hexBssidsString = await sha1(bssids);
        return { wifiHash: hexBssidsString, wifiList: bssids };
      }

      return { wifiHash: '', wifiList: '' };
    }
    // Android

    WifiManager.loadWifiList(
      async (wifiObjects) => {
        bssids = orderListOfMacAddresses(JSON.parse(wifiObjects));
        for (let i = 0; i < bssids.length; i += 1) {
          bssidsToConvert = bssidsToConvert.concat(
            i !== 0 ? ',' : '',
            bssids[i].BSSID.replace(/:/g, '')
          );
        }
        hexBssidsString = await sha1(bssidsToConvert);
        return { wifiHash: hexBssidsString, wifiList: bssidsToConvert };
      },
      (e) => {
        console.log('Cannot get current SSID!', e);
        throw e;
      }
    );
  } catch (e) {
    console.log('Cannot get current SSID!', e);
    throw e;
  }
};

const orderListOfMacAddresses = (list: any) => {
  return list.sort((a: any, b: any) => a.BSSID.localeCompare(b.BSSID));
};
