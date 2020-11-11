import Web3 from 'web3';
import numeral from 'numeral';
export default function formatEth(ethWei) {
  if (!ethWei) {
    return '0.000';
  }
  const amount = Web3.utils.fromWei(ethWei, 'ether');
  const fmt = (v) => numeral(v).format('0,0.000');
  return fmt(amount);
  //   if (decimalPoint === -1) {
  //     return fmt(amount);
  //   } else {
  //     const decimalPlaces = 3;
  //     if (decimalPoint + decimalPlaces <= amount.length) {
  //       return fmt(amount.slice(0, decimalPoint + decimalPlaces));
  //     } else {

  //     }
  //   }
}
