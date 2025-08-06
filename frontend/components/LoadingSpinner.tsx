import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
        <p className="text-gray-900 text-lg">Yükleniyor...</p>
      </div>
    </div>
  );
}
