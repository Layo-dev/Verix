import { MessageCircle } from "lucide-react";

const SupportButton = () => {
  return (
    <button className="fixed bottom-6 right-6 flex items-center gap-2 bg-[hsl(200,100%,50%)] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 z-50">
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm font-medium">Support</span>
    </button>
  );
};

export default SupportButton;
