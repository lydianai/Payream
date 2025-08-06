import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Settings, Heart, History, LogOut, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserMenu() {
  const { t } = useTranslation();

  // For now, show a simple login button since auth is not implemented
  return (
    <Button
      variant="outline"
      className="border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
      aria-label="Giriş Yap"
    >
      <User className="h-4 w-4 mr-2" aria-hidden="true" />
      Giriş Yap
    </Button>
  );
}
