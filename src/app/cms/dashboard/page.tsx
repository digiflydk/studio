
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getLeadsAction } from '@/app/actions';
import { BarChart, Users } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function CmsDashboardPage() {
  const [totalLeads, setTotalLeads] = useState(0);
  const [monthlyLeads, setMonthlyLeads] = useState(0);
  
  // Dummy data for charts - replace with real data when available
  const visitorData = [
    { month: 'Jan', visitors: 186 },
    { month: 'Feb', visitors: 305 },
    { month: 'Mar', visitors: 237 },
    { month: 'Apr', visitors: 73 },
    { month: 'May', visitors: 209 },
    { month: 'Jun', visitors: 214 },
  ];
  const chartConfig = {
    visitors: {
      label: "Visitors",
      color: "hsl(var(--primary))",
    },
  }

  useEffect(() => {
    async function loadLeads() {
      const leads = await getLeadsAction();
      setTotalLeads(leads.length);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const recentLeads = leads.filter(lead => new Date(lead.createdAt) > oneMonthAgo);
      setMonthlyLeads(recentLeads.length);
    }
    loadLeads();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's a quick overview of your site.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">+15.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads (All Time)</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalLeads}</div>
            <p className="text-xs text-muted-foreground">{monthlyLeads} in the last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1%</div>
            <p className="text-xs text-muted-foreground">+1.1% from last month</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">+201 since last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visitor Overview</CardTitle>
          <CardDescription>A chart showing visitor traffic for the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="h-[300px] w-full">
               <ChartContainer config={chartConfig} className="w-full h-full">
                  <ResponsiveContainer>
                    <BarChart data={visitorData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis 
                         tickLine={false}
                         axisLine={false}
                         tickMargin={8}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                      />
                      <Bar dataKey="visitors" fill="var(--color-visitors)" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
