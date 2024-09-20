'use client';

import React, { useState } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { initializeOracle } from '../utils/anchorClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const NodeNetwork: React.FC = () => {
  const [collateral, setCollateral] = useState('');
  const wallet = useAnchorWallet();
  const { toast } = useToast();

  const handleInitialize = async () => {
    if (!wallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to initialize a node network.",
        variant: "destructive",
      });
      return;
    }
    try {
      await initializeOracle(wallet, Number(collateral));
      toast({
        title: "Success",
        description: "Node network initialized successfully!",
      });
    } catch (error) {
      console.error('Error initializing node network:', error);
      toast({
        title: "Error",
        description: "Failed to initialize node network",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Create Node Network</CardTitle>
        <CardDescription>Initialize a new node network by setting the collateral amount</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label htmlFor="collateral" className="block text-sm font-medium text-gray-700 mb-2">
              Collateral Amount (USDC)
            </label>
            <Input
              id="collateral"
              type="number"
              value={collateral}
              onChange={(e) => setCollateral(e.target.value)}
              placeholder="Enter collateral amount"
              className="w-full"
            />
          </div>
          <Button onClick={handleInitialize} className="w-full">
            Initialize Node Network
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NodeNetwork;