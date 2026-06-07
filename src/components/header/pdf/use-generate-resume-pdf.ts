import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ResumePdfBuilder } from "./resume-pdf-builder";
import { type GenerateResumePdfArgs } from "./resume-pdf.utils";

interface UseGenerateResumePdfResult {
  generateResume: () => void;
  isGeneratingResume: boolean;
}

export const useGenerateResumePdf = (): UseGenerateResumePdfResult => {
  const { t, i18n } = useTranslation();

  const { mutate, isPending } = useMutation<string, Error, GenerateResumePdfArgs>({
    mutationFn: (args: GenerateResumePdfArgs) => new ResumePdfBuilder(args).build(),
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
