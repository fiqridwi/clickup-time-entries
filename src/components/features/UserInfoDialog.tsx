import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface UserInfoDialogProps {
  open: boolean;
  userId: string;
  apiKey: string;
  onUserIdChange: (value: string) => void;
  onApiKeyChange: (value: string) => void;
  onSubmit: () => void;
}

export function UserInfoDialog({
  open,
  userId,
  apiKey,
  onUserIdChange,
  onApiKeyChange,
  onSubmit,
}: UserInfoDialogProps) {
  return (
    <Dialog open={open} modal>
      <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>User Info</DialogTitle>
          <DialogDescription>
            Please fill this information to perform Bulk Time Entry!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userid" className="text-right">
              User ID
            </Label>
            <Input
              id="userid"
              type="text"
              onChange={(e) => onUserIdChange(e.target.value)}
              value={userId}
              placeholder="2739759082903"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apikey" className="text-right">
              API Key
            </Label>
            <Input
              id="apikey"
              type="text"
              onChange={(e) => onApiKeyChange(e.target.value)}
              value={apiKey}
              placeholder="pk_345342345_2384ASDFHK238"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={onSubmit}
            className="hover:cursor-pointer"
            type="submit"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
