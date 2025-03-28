
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, User, Calendar, ExternalLink } from 'lucide-react';

interface PaperCardProps {
  id: string;
  title: string;
  author: string;
  abstract: string;
  status: string;
  date: string;
  ipfsHash?: string;
  onView?: () => void;
}

const PaperCard: React.FC<PaperCardProps> = ({
  id,
  title,
  author,
  abstract,
  status,
  date,
  ipfsHash,
  onView
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'removed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="cnki-card overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <Badge className={getStatusColor(status)}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <User className="h-4 w-4 mr-1" />
          <span className="mr-4">{author}</span>
          <Calendar className="h-4 w-4 mr-1" />
          <span>{date}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-3">{abstract}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center border-t border-gray-100 py-3">
        <div className="text-xs text-gray-500">ID: {id}</div>
        {ipfsHash && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-primary"
            onClick={onView}
          >
            <FileText className="h-4 w-4 mr-1" />
            View Paper
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaperCard;
