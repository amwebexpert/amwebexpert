import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { type GenerateResumePdfArgs, generateResumePdf } from "./resume-pdf.utils";

export const useGenerateResumePdf = () => {
  const { t, i18n } = useTranslation();

  const { mutate, isPending } = useMutation<string, Error, GenerateResumePdfArgs>({
    mutationFn: generateResumePdf,
    onSuccess: (filename: string) => {
      toast.success(t("pdf:success"), { description: t("pdf:exportFileDescription", { filename }) });
    },
    onError: () => {
      toast.error(t("pdf:error"));
    },
  });

  return {
    generateResume: () => mutate({ locale: i18n.language }),
    isGeneratingResume: isPending,
  };
};
