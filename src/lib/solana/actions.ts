export const PROGRAM_ID = "7GEibaWAAFwANcfSaCfGwpLocKcEfrnhpxK2cwRp9q7W";
export const connection = { getSlot: async () => 1, getBalance: async () => 0 };

export const createAuctionOnChain = async (...args: any[]) => {
  console.log("Mock createAuction", args);
  return { success: true, mintAddress: "MockMintAddress", auctionPda: "MockPdaAddress" };
};

export const submitBidOnChain = async (...args: any[]) => {
  console.log("Mock submitBid", args);
  return "mockSignature123";
};

export const refundBidOnChain = async (...args: any[]) => {
  console.log("Mock refundBid", args);
  return "mockSignature456";
};

export const waitForConfirmation = async (sig: string) => true;
export const createAuction = createAuctionOnChain;
