import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getReportTypes, ReportType } from '@/lib/reportApi';
import { toast } from 'sonner';

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reportTypeId: number, content: string) => void;
  userName: string;
}

const ReportDialog = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: ReportDialogProps) => {
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReportTypes = async () => {
      try {
        const types = await getReportTypes();
        setReportTypes(types);
      } catch (error) {
        toast.error('Không thể tải danh sách loại báo cáo');
      }
    };

    if (isOpen) {
      fetchReportTypes();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!selectedType) {
      toast.error('Vui lòng chọn loại vi phạm');
      return;
    }
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung báo cáo');
      return;
    }
    onConfirm(Number(selectedType), content);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            Báo cáo vi phạm
          </DialogTitle>
          <DialogDescription>
            Bạn đang báo cáo vi phạm từ {userName}. Vui lòng chọn loại vi phạm và mô tả chi tiết.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Loại vi phạm</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại vi phạm" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.reportTypeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nội dung báo cáo</label>
            <Textarea
              placeholder="Mô tả chi tiết về vi phạm..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Đang gửi...' : 'Gửi báo cáo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog; 