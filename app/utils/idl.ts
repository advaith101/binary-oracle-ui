import { Idl } from "@project-serum/anchor";
import idl from "./binary_oracle.json";

type BinaryOracleIdl = {
  address: string;
  metadata: {
    name: string;
    version: string;
    spec: string;
    description: string;
  };
  instructions: any[]; 
  accounts: any[]; 
  types: any[]; 
  errors: any[]; 
};

// Assert that the imported IDL matches our custom type
const typedIdl = idl as BinaryOracleIdl;

// Export the IDL with a type assertion to Idl
export const IDL = typedIdl as unknown as Idl;