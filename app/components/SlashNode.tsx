'use client';

import React, { useState } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { slashColluding } from '../utils/anchorClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SlashNode: React.FC = () => {
  const [oracleAddress, setOracleAddress] = useState('');
  const [colludingNodeAddress, setColludingNodeAddress] = useState('');
  const [vote, setVote] = useState<boolean | ''>('');
  const [nonce, setNonce] = useState('');
  const wallet = useAnchorWallet();
  const { toast } = useToast();

  const handleSlash = async () => {
    if (!wallet || vote === '') {
      toast({
        title: "Invalid input",
        description: "Please connect your wallet and select a vote.",
        variant: "destructive",
      });
      return;
    }
    try {
      await slashColluding(wallet, oracleAddress, colludingNodeAddress, vote, nonce);
      toast({
        title: "Success",
        description: "Node slashed successfully!",
      });
    } catch (error) {
      console.error('Error slashing node:', error);
      toast({
        title: "Error",
        description: "Failed to slash node",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Slash Colluding Node</CardTitle>
        <CardDescription>Slash a node that has attempted to collude</CardDescription>
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
            <label htmlFor="colludingNodeAddress" className="block text-sm font-medium text-gray-700 mb-2">
              Colluding Node Address
            </label>
            <Input
              id="colludingNodeAddress"
              type="text"
              value={colludingNodeAddress}
              onChange={(e) => setColludingNodeAddress(e.target.value)}
              placeholder="Enter colluding node address"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="vote" className="block text-sm font-medium text-gray-700 mb-2">
              Vote
            </label>
            <Select onValueChange={(value) => setVote(value === 'true')}>
              <SelectTrigger id="vote">
                <SelectValue placeholder="Select vote" />
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
          <Button onClick={handleSlash} className="w-full">
            Slash Node
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlashNode;