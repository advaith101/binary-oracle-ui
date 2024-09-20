import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { IDL } from "./idl";

const PROGRAM_ID = new PublicKey("CyJDfKuJ7aAF86dJifrKXBWLLrT2TcmoqSVvqgTJ9FR6");

export const getProgram = (wallet: AnchorWallet) => {
  const connection = new anchor.web3.Connection("https://api.devnet.solana.com");
  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });
  return new Program(IDL, PROGRAM_ID, provider);
};

export const initializeOracle = async (wallet: AnchorWallet, collateral: number) => {
  const program = getProgram(wallet);
  const oracle = anchor.web3.Keypair.generate();

  await program.methods
    .initialize(new anchor.BN(collateral))
    .accounts({
      oracle: oracle.publicKey,
      authority: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([oracle])
    .rpc();

  return oracle.publicKey;
};

export const joinNetwork = async (wallet: AnchorWallet, oracleAddress: string) => {
  const program = getProgram(wallet);
  const oracle = new PublicKey(oracleAddress);
  const node = anchor.web3.Keypair.generate();

  await program.methods
    .joinNetwork()
    .accounts({
      oracle,
      node: node.publicKey,
      nodeAuthority: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([node])
    .rpc();

  return node.publicKey;
};

export const startRequest = async (wallet: AnchorWallet, oracleAddress: string) => {
  const program = getProgram(wallet);
  const oracle = new PublicKey(oracleAddress);

  await program.methods
    .startRequest()
    .accounts({
      oracle,
      authority: wallet.publicKey,
    })
    .rpc();
};

export const commit = async (
    wallet: AnchorWallet,
    oracleAddress: string,
    vote: boolean,
    nonce: string
  ) => {
    const program = getProgram(wallet);
    const oracle = new PublicKey(oracleAddress);
    const node = await getNodeAccount(program, oracle, wallet.publicKey);
  
    const voteBuffer = new Uint8Array([vote ? 1 : 0]);
    const nonceBuffer = new Uint8Array(Buffer.from(nonce, "hex"));
    
    // Combine voteBuffer and nonceBuffer without using spread operator
    const message = new Uint8Array(voteBuffer.length + nonceBuffer.length);
    message.set(voteBuffer);
    message.set(nonceBuffer, voteBuffer.length);
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', message);
    const voteHash = new Uint8Array(hashBuffer);
  
    await program.methods
      .commit(Array.from(voteHash))
      .accounts({
        oracle,
        node,
        authority: wallet.publicKey,
      })
      .rpc();
  
    return Buffer.from(voteHash).toString('hex');
};

export const reveal = async (
  wallet: AnchorWallet,
  oracleAddress: string,
  vote: boolean,
  nonce: string
) => {
  const program = getProgram(wallet);
  const oracle = new PublicKey(oracleAddress);
  const node = await getNodeAccount(program, oracle, wallet.publicKey);

  await program.methods
    .reveal(vote, Buffer.from(nonce, "hex"))
    .accounts({
      oracle,
      node,
      authority: wallet.publicKey,
    })
    .rpc();
};

export const slashColluding = async (
  wallet: AnchorWallet,
  oracleAddress: string,
  colludingNodeAddress: string,
  vote: boolean,
  nonce: string
) => {
  const program = getProgram(wallet);
  const oracle = new PublicKey(oracleAddress);
  const colludingNode = new PublicKey(colludingNodeAddress);
  const slasherNode = await getNodeAccount(program, oracle, wallet.publicKey);

  await program.methods
    .slashColluding(vote, Buffer.from(nonce, "hex"))
    .accounts({
      oracle,
      colludingNode,
      slasherNode,
      slasher: wallet.publicKey,
    })
    .rpc();
};

export const resolve = async (wallet: AnchorWallet, oracleAddress: string) => {
  const program = getProgram(wallet);
  const oracle = new PublicKey(oracleAddress);

  // Fetch all nodes associated with this oracle
  const nodes = await program.account.node.all([
    {
      memcmp: {
        offset: 8, // Discriminator size
        bytes: oracle.toBase58(),
      },
    },
  ]);

  await program.methods
    .resolve()
    .accounts({
      oracle,
      authority: wallet.publicKey,
    })
    .remainingAccounts(
      nodes.map((node) => ({
        pubkey: node.publicKey,
        isWritable: true,
        isSigner: false,
      }))
    )
    .rpc();
};

async function getNodeAccount(
  program: Program,
  oracle: PublicKey,
  authority: PublicKey
): Promise<PublicKey> {
  const [nodeAccount] = await PublicKey.findProgramAddress(
    [Buffer.from("node"), oracle.toBuffer(), authority.toBuffer()],
    program.programId
  );
  return nodeAccount;
}