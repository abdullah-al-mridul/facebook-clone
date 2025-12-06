
'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, Eye, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { User } from '@/types';
import ViewDocumentDialog from './view-document-dialog';

export type VerificationRequest = {
  id: string;
  user: User;
  date: string;
  status: 'Pending' | 'Approved' | 'Denied';
  documentUrl?: string;
  documentType?: "Passport" | "National ID Card" | "Driver's License";
};

const dummyRequests: VerificationRequest[] = [
  {
    id: '1',
    user: { name: 'David Rodriguez', avatarUrl: 'https://placehold.co/100x100.png' },
    date: '2023-10-26',
    status: 'Pending',
    documentUrl: 'https://picsum.photos/seed/doc1/800/500',
    documentType: 'Passport',
  },
  {
    id: '2',
    user: { name: 'Jessica White', avatarUrl: 'https://placehold.co/100x100/D1D5DB/374151.png' },
    date: '2023-10-25',
    status: 'Pending',
    documentUrl: 'https://picsum.photos/seed/doc2/800/500',
    documentType: "Driver's License",
  },
    {
    id: '3',
    user: { name: 'Chris Lee', avatarUrl: 'https://placehold.co/100x100/4B5563/E5E7EB.png' },
    date: '2023-10-24',
    status: 'Approved',
  },
    {
    id: '4',
    user: { name: 'Amanda Taylor', avatarUrl: 'https://placehold.co/100x100/FFFFFF/9CA3AF.png' },
    date: '2023-10-23',
    status: 'Denied',
  },
];

export default function VerificationRequestTable() {
  const [requests, setRequests] = useState<VerificationRequest[]>(dummyRequests);
  const [isViewDocOpen, setIsViewDocOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);

  const handleApprove = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
  };

  const handleDeny = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'Denied' } : r));
  };

  const handleViewDocument = (request: VerificationRequest) => {
    setSelectedRequest(request);
    setIsViewDocOpen(true);
  }

  return (
    <>
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Date Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={request.user.avatarUrl} alt={request.user.name} data-ai-hint="person portrait"/>
                    <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{request.user.name}</span>
                </div>
              </TableCell>
              <TableCell>{request.date}</TableCell>
              <TableCell>
                <Badge variant={request.status === 'Pending' ? 'secondary' : request.status === 'Approved' ? 'default' : 'destructive'}>
                    {request.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {request.status === 'Pending' ? (
                  <div className='flex gap-2 justify-end'>
                     <Button variant="outline" size="sm" onClick={() => handleViewDocument(request)}>
                        <Eye className="mr-2 h-4 w-4" /> View Documents
                    </Button>
                    <Button variant="outline" size="icon" className="text-green-500 hover:bg-green-500/10 hover:text-green-600" onClick={() => handleApprove(request.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeny(request.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                    <Button variant="ghost" size="sm" disabled>No actions</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    {selectedRequest && (
        <ViewDocumentDialog
            isOpen={isViewDocOpen}
            onOpenChange={setIsViewDocOpen}
            request={selectedRequest}
            onApprove={handleApprove}
            onDeny={handleDeny}
        />
    )}
    </>
  );
}
