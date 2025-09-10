
'use client';

import { useEffect, useState } from 'react';
import { getLeadsAction } from '@/app/actions';
import type { Lead } from '@/services/leads';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function CmsLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadLeads() {
            setIsLoading(true);
            const loadedLeads = await getLeadsAction();
            setLeads(loadedLeads);
            setIsLoading(false);
        }
        loadLeads();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Customer Leads</h1>
                <p className="text-muted-foreground">Overview of leads collected by the AI assistant.</p>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Collected Leads</CardTitle>
                    <CardDescription>List of potential customers who have interacted with the AI assistant.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Project Idea</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leads.length > 0 ? (
                                    leads.map(lead => (
                                        <TableRow key={lead.id}>
                                            <TableCell className="whitespace-nowrap">{format(new Date(lead.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
                                            <TableCell>{lead.name}</TableCell>
                                            <TableCell>{lead.email}</TableCell>
                                            <TableCell>{lead.phone}</TableCell>
                                            <TableCell>
                                                <Badge variant={lead.status === 'Qualified' ? 'default' : 'secondary'}>
                                                    {lead.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-xs whitespace-pre-wrap">{lead.projectIdea}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            No leads found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
