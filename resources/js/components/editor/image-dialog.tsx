import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Upload, Link } from 'lucide-react';

interface ImageDialogProps {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageDialog({ editor, open, onOpenChange }: ImageDialogProps) {
  const [url, setUrl] = React.useState('');
  const [alt, setAlt] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setUrl('');
    setAlt('');
    setFile(null);
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-generate alt text from filename
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, '');
      setAlt(fileName.replace(/[-_]/g, ' '));
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) return;

    editor.chain().focus().setImage({
      src: url,
      alt: alt || 'Image',
    }).run();

    onOpenChange(false);
    resetForm();
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) return;

    setUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);

      // You can customize this endpoint based on your backend
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      editor.chain().focus().setImage({
        src: data.url,
        alt: alt || 'Uploaded image',
      }).run();

      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Upload error:', error);
      // You might want to show a toast notification here
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Insert Image
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              URL
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="space-y-4">
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageAlt">Alt Text</Label>
                <Input
                  id="imageAlt"
                  type="text"
                  placeholder="Describe the image"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                />
              </div>

              {url && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="border rounded-lg p-2">
                    <img
                      src={url}
                      alt={alt || 'Preview'}
                      className="max-w-full h-auto max-h-32 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Insert Image</Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageFile">Select Image</Label>
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="uploadAlt">Alt Text</Label>
                <Input
                  id="uploadAlt"
                  type="text"
                  placeholder="Describe the image"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                />
              </div>

              {file && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="border rounded-lg p-2">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={alt || 'Preview'}
                      className="max-w-full h-auto max-h-32 object-contain mx-auto"
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    resetForm();
                  }}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload & Insert'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
