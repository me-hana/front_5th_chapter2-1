export function CalculateCart(totalAmt, discRate, bonusPts) {
  return `
      총액: ${Math.round(totalAmt)}원${discRate > 0 ? `<span class="text-green-500 ml-2">(${(discRate * 100).toFixed(1)}% 할인 적용)</span>` : ''}<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${bonusPts})</span>
    `;
}
