// https://github.com/solana-labs/solana-program-library/blob/master/token/js/examples/createMintAndTransferTokens.ts
import { getOrCreateAssociatedTokenAccount, getTokenMetadata, mintTo, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, Keypair,PublicKey } from "@solana/web3.js";
import bs58 from 'bs58';

// Instead of reading from file, store the keypair data directly
const MINT_KEYPAIR_DATA = {
  publicKey: "8v8UWDce5GvxjjbNf8g3XmLP1fkPQ2oNTZbysGYS2W1r",
  secretKey: "3Cc5DMCRa2DNqGve4bsJPDNnsb66PPUZbgYmkXTHuG3BwHLKXKnSW8oFYp7Ke5LQpAkppmUuQY9LUbtUNKWeFgcL"
};

const privKeyString = "92LwquA7wkbTwbzfPTt23jvwbvYjDQD6ZwgQU3fzg79F4rcv78tBHHaSXvPPJNs3BUv8m7g76Uh1UryxTukxQsc";
const privUint8arr = bs58.decode(privKeyString);
const payer = Keypair.fromSecretKey(privUint8arr);

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const loadKeypair = (): Keypair => {
  try {
    const secretKey = bs58.decode(MINT_KEYPAIR_DATA.secretKey);
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    console.error('Error loading keypair:', error);
    throw error;
  }
};

const mint = loadKeypair();

export const mintTokens = async (fromAddress: string, toAddress: string, amount: number) => {
    if(amount === 0){
      return 0;
    }
    const fromAddressPubKey = new PublicKey(fromAddress);
    const toAddressPubKey = new PublicKey(toAddress);
    const metadata = await getTokenMetadata(connection, mint.publicKey);
    console.log("Minting tokens");

    const fromAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint.publicKey, fromAddressPubKey,false, undefined, undefined, TOKEN_2022_PROGRAM_ID);
    const toAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint.publicKey, toAddressPubKey,false, undefined, undefined, TOKEN_2022_PROGRAM_ID);

    console.log("From account is: ", fromAccount);
    console.log("To account is: ", toAccount);
    console.log("Amount is: ", amount)
    const mintTokenToAccount = await mintTo(
      connection,
      payer,
      mint.publicKey,
      toAccount.address,
      payer,
      amount,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    )

    console.log(mintTokenToAccount);
    console.log("Token minted");

}

// export const burnTokens = async (fromAddress: string, toAddress: string, amount: number) => {
//     console.log("Burning tokens");
// }

// export const sendNativeTokens = async (fromAddress: string, toAddress: string, amount: number) => {
//     console.log("Sending native tokens");
// }