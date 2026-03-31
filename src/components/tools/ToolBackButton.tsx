import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ToolBackButton = ({ label = "হোমে ফিরুন" }: { label?: string }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className="mb-4 pl-0 pr-2 text-muted-foreground hover:text-accent"
    >
      <ArrowLeft size={16} />
      {label}
    </Button>
  );
};

export default ToolBackButton;