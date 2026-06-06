import { FilePdfOutlined } from "@ant-design/icons";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { AsyncActionButton } from "~/components/buttons/async-action-button";
import { useGenerateResumePdf } from "./pdf/use-generate-resume-pdf";

export const ActionGeneratePdf: FunctionComponent = () => {
  const { t } = useTranslation();
  const { generateResume, isGeneratingResume } = useGenerateResumePdf();

  return (
    <AsyncActionButton
      onAction={generateResume}
      isLoading={isGeneratingResume}
      icon={<FilePdfOutlined />}
      title={t("pdf:generateResume")}
    />
  );
};
