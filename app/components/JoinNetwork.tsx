'use client';

import React, { useState } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { joinNetwork } from '../utils/anchorClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const JoinNetwork: React.FC = () => {
  const [oracleAddress, setOracleAddress] = useState('');
  const wallet = useAnchorWallet();
  const { toast } = useToast();

  const handleJoin = async () => {
    if (!wallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to join a network.",
        variant: "destructive",
      });
      return;
    }
    try {
      await joinNetwork(wallet, oracleAddress);
      toast({
        title: "Success",
        description: "Joined network successfully!",
      });
    } catch (error) {
      console.error('Error joining network:', error);
      toast({
        title: "Error",
        description: "Failed to join network",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Join Node Network</CardTitle>
        <CardDescription>Join an existing node network by providing its address</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label htmlFor="oracleAddress" className="block text-sm font-medium text-gray-700 mb-2">
              Oracle Address
            </label>
            <Input
              id="oracleAddress"
              type="text"
              value={oracleAddress}
              onChange={(e) => setOracleAddress(e.target.value)}
              placeholder="Enter oracle address"
              className="w-full"
            />
          </div>
          <Button onClick={handleJoin} className="w-full">
            Join Network
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinNetwork;