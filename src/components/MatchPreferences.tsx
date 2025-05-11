import { useState, useEffect } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getMatchCondition, createMatchCondition, updateMatchCondition } from '@/lib/matchConditionApi';

interface MatchPreferencesProps {
  open: boolean;
  onClose: () => void;
}

const MatchPreferences = ({ open, onClose }: MatchPreferencesProps) => {
  const [gender, setGender] = useState<string>('any');
  const [distance, setDistance] = useState<number>(25);
  const [ageRange, setAgeRange] = useState<number[]>([18, 35]);
  const [loading, setLoading] = useState(false);
  const [matchCondition, setMatchCondition] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const accountId = localStorage.getItem('accountId');
      if (!accountId) return;
      setLoading(true);
      const data = await getMatchCondition(Number(accountId));
      console.log('Kết quả getMatchCondition:', data);
      if (data && (data.id || data.accountId)) {
        setMatchCondition(data);
        setGender(
          data.genderId === 1 ? 'male' :
          data.genderId === 2 ? 'female' :
          'any'
        );
        setDistance(data.maxDistanceKm ?? 20);
        setAgeRange([data.minAge ?? 18, data.maxAge ?? 30]);
      } else {
        setMatchCondition(null);
      }
      setLoading(false);
    };
    fetchData();
  }, [open]);

  const handleSave = async () => {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) return;
    setLoading(true);

    // Mapping gender value to GenderId (nullable)
    let genderId: number | null = null;
    if (gender === 'male') genderId = 1;
    else if (gender === 'female') genderId = 2;
    else genderId = null; // any

    const dto = {
      AccountId: Number(accountId),
      MinAge: ageRange[0],
      MaxAge: ageRange[1],
      MaxDistanceKm: distance,
      GenderId: genderId
    };
    console.log('DTO gửi lên:', dto);

    try {
      if (matchCondition) {
        await updateMatchCondition(Number(accountId), dto);
        toast.success('Cập nhật tiêu chí thành công!');
      } else {
        await createMatchCondition(dto);
        toast.success('Tạo tiêu chí thành công!');
      }
      onClose();
    } catch (e) {
      toast.error('Có lỗi khi lưu tiêu chí!');
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-matchup-purple flex items-center justify-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Tiêu chí ghép đôi
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Giới tính</h3>
            <RadioGroup value={gender} onValueChange={setGender} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Nam</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Nữ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="any" />
                <Label htmlFor="any">Bất kỳ</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-foreground">Khoảng cách</h3>
              <span className="text-sm text-muted-foreground">{distance} km</span>
            </div>
            <Slider
              value={[distance]}
              onValueChange={(value) => setDistance(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-foreground">Độ tuổi</h3>
              <span className="text-sm text-muted-foreground">{ageRange[0]} - {ageRange[1]} tuổi</span>
            </div>
            <Slider
              value={ageRange}
              onValueChange={setAgeRange}
              min={18}
              max={60}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchPreferences;
