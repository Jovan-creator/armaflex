import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supportedLanguages } from "@/i18n/config";
import { Globe, Check } from "lucide-react";

interface LanguageSwitcherProps {
  variant?: "button" | "minimal";
  showLabel?: boolean;
}

export function LanguageSwitcher({
  variant = "button",
  showLabel = true,
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage =
    supportedLanguages.find((lang) => lang.code === i18n.language) ||
    supportedLanguages[0];

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      localStorage.setItem("preferredLanguage", languageCode);

      // Apply RTL direction for Arabic
      if (languageCode === "ar") {
        document.documentElement.dir = "rtl";
        document.documentElement.lang = "ar";
      } else {
        document.documentElement.dir = "ltr";
        document.documentElement.lang = languageCode;
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  if (variant === "minimal") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {supportedLanguages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {language.nativeName}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({language.name})
                </span>
              </div>
              {currentLanguage.code === language.code && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Globe className="h-4 w-4" />
          {showLabel && <span>{t("common.language")}</span>}
          <Badge variant="secondary" className="ml-1">
            {currentLanguage.code.toUpperCase()}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-muted-foreground">
            {t("common.language")}
          </p>
        </div>
        <div className="border-t">
          {supportedLanguages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-between cursor-pointer py-2"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {language.nativeName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {language.name}
                </span>
              </div>
              {currentLanguage.code === language.code && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// RTL Support Component
export function RTLProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  // Apply RTL styles for Arabic
  const isRTL = i18n.language === "ar";

  return (
    <div className={isRTL ? "rtl" : "ltr"} dir={isRTL ? "rtl" : "ltr"}>
      {children}
    </div>
  );
}
