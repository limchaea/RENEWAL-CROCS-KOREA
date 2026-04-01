export function parsePrice(priceStr) {
    if (!priceStr) return 0;
    let price = String(priceStr).replace(/₩|,/g, '').trim();
    price = price.replace(/\([^)]*\)/g, '').trim();
    const numbers = price.match(/\d+/);
    return numbers ? parseInt(numbers[0]) : 0;
}
