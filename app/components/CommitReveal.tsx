'use client';

import React, { useState } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { commit, reveal } from '../utils/anchorClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CommitReveal: React.FC = () => {
  const [oracleAddress, setOracleAddress] = useState('');
  const [vote, setVote] = useState<boolean | ''>('');
  const [nonce, setNonce] = useState('');
  const wallet = useAnchorWallet();
  const { toast } = useToast();

  const handleCommit = async () => {
    if (!wallet || vote === '') {
      toast({
        title: "Invalid input",
        description: "Please connect your wallet and select a vote.",
        variant: "destructive",
      });
      return;
    }
    try {
      const voteHash = await commit(wallet, oracleAddress, vote, nonce);
      toast({
        title: "Committed successfully",
        description: `Vote hash: ${voteHash}`,
      });
    } catch (error) {
      console.error('Error committing:', error);
      toast({
        title: "Error",
        description: "Failed to commit",
        variant: "destructive",
      });
    }
  };

  const handleReveal = async () => {
    if (!wallet || vote === '') {
      toast({
        title: "Invalid input",
        description: "Please connect your wallet and select a vote.",
        variant: "destructive",
      });
      return;
    }
    try {
      await reveal(wallet, oracleAddress, vote, nonce);
      toast({
        title: "Success",
        description: "Revealed successfully!",
      });
    } catch (error) {
      console.error('Error revealing:', error);
      toast({
        title: "Error",
        description: "Failed to reveal",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Commit and Reveal</CardTitle>
        <CardDescription>Participate in the oracle by committing and revealing your vote</CardDescription>
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
          <div>
            <label htmlFor="vote" className="block text-sm font-medium text-gray-700 mb-2">
              Vote
            </label>
            <Select onValueChange={(value) => setVote(value === 'true')}>
              <SelectTrigger id="vote">
                <SelectValue placeholder="Select your vote" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="nonce" className="block text-sm font-medium text-gray-700 mb-2">
              Nonce
            </label>
            <Input
              id="nonce"
              type="text"
              value={nonce}
              onChange={(e) => setNonce(e.target.value)}
              placeholder="Enter nonce"
              className="w-full"
            />
          </div>
          <div className="flex space-x-4">
            <Button onClick={handleCommit} className="flex-1">
              Commit
            </Button>
            <Button onClick={handleReveal} className="flex-1">
              Reveal
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommitReveal;