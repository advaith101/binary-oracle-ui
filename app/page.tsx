'use client';

import Layout from './components/Layout';
import NodeNetwork from './components/NodeNetwork';
import JoinNetwork from './components/JoinNetwork';
import CommitReveal from './components/CommitReveal';
import SlashNode from './components/SlashNode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <Layout>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Binary Oracle Dashboard</CardTitle>
          <CardDescription>Manage your node network and participate in the oracle</CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <NodeNetwork />
        <JoinNetwork />
        <CommitReveal />
        <SlashNode />
      </div>
    </Layout>
  );
}