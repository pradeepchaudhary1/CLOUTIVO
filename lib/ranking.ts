export function calculateRequiredBid(
  targetRank: number,
  targetListingAmount: number,
  currentLeaderAmount: number
): number {
  if (targetRank === 1) {
    return Math.max(10, currentLeaderAmount + 5);
  }
  return targetListingAmount + 1;
}

export function calculateDifferenceToPay(newBid: number, alreadyPaid: number): number {
  return Math.max(1, newBid - alreadyPaid);
}