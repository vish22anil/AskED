import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Check } from "lucide-react";

interface FileUploadProps {
  onUpload: (file: File) => void;
  onCancel: () => void;
}

export default function FileUpload({ onUpload, onCancel }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-background rounded-xl border shadow-sm w-full max-w-md mx-auto">
      {!selectedFile ? (
        <div 
          className="w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-10 h-10 text-muted-foreground mb-4" />
          <p className="text-sm font-medium">Click to upload an image or PDF</p>
          <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, WEBP, PDF</p>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4">
          <div className="w-full border rounded-lg p-2 relative overflow-hidden flex items-center justify-center bg-muted/30">
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 h-6 w-6 rounded-full" 
              onClick={handleClear}
            >
              <X className="w-4 h-4" />
            </Button>
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-48 object-contain rounded" />
            ) : (
              <div className="flex flex-col items-center p-8">
                <FileText className="w-12 h-12 text-primary mb-2" />
                <span className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</span>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleConfirm}>
              <Check className="w-4 h-4 mr-2" /> Use File
            </Button>
          </div>
        </div>
      )}
      
      {!selectedFile && (
        <Button variant="ghost" className="mt-2 w-full" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  );
}
