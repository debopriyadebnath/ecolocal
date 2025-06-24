export function calculateCarbonFootprint(product: any) {
  // Dummy calculation: you can replace with real logic
  return product.weight ? product.weight * 0.5 : 1;
}

export function getSustainabilityScore(product: any) {
  // Dummy calculation: you can replace with real logic
  let score = 100;
  if (product.carbonFootprint > 10) score -= 20;
  if (!product.isEcoFriendly) score -= 30;
  return score;
}
