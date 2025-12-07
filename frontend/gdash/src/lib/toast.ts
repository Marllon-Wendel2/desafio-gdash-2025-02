import { toast } from "react-toastify";

export const showToast = (
  message: string,
  type: "success" | "error" | "info" = "info"
) => {
  let bgColor = "";
  let textColor = "text-white";

  switch (type) {
    case "success":
      bgColor = "bg-[hsl(var(--accent))]";
      textColor = "text-[hsl(var(--accent-foreground))]";
      break;
    case "error":
      bgColor = "bg-[hsl(var(--destructive))]";
      textColor = "text-[hsl(var(--destructive-foreground))]";
      break;
    case "info":
      bgColor = "bg-[hsl(var(--primary))]";
      textColor = "text-[hsl(var(--primary-foreground))]";
      break;
  }

  toast(message, {
    className: `${bgColor} ${textColor} rounded-[var(--radius)] shadow-lg`,
  });
};
