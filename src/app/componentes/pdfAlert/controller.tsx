import * as React from 'react';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import I18n from 'i18n-js';
import axios from 'axios';
import { useVSSnack } from 'vision-common';

export default function Controller() {
  const config = axios.defaults;
  const { dispatchSnack } = useVSSnack();
  const [progress, setProgress] = React.useState<number>(0);
  const [hasDownloaded, setDownloaded] = React.useState<boolean>(false);
  const [hasErrorDownloaded, setHasErrorDownloaded] = React.useState<boolean>(false);
  const [downloading, setDownloading] = React.useState<boolean>(false);
  const pdfPath = `${FileSystem.documentDirectory}orientacoes-de-uso.pdf`;

  const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
    const progressNumber = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    setProgress(progressNumber);
  };

  const downloadResumable = FileSystem.createDownloadResumable(
    `${config.baseURL}/fazerDownloadOrientacaoUso`,
    pdfPath,
    {
      headers: {
        'Client-Type': String(config.headers.common['Client-Type']),
      }
    },
    callback,
  );

  const abrirPdf = async () => {
    try {
      const uri = await FileSystem.getContentUriAsync(pdfPath);

      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: uri,
        type: 'application/pdf',
        flags: 1
      });
    } catch (e) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: I18n.t('usageTips.errors.downloadOpenlError')
      });
    }
  };

  const baixarPDF = async () => {
    setDownloading(true);

    try {
      const response = await downloadResumable.downloadAsync();

      if (response?.status === 200) {
        setDownloaded(true);
        setHasErrorDownloaded(false);
      } else {
        setHasErrorDownloaded(true);

        if (response?.status === 404) {
          dispatchSnack({
            type: 'open',
            alertType: 'error',
            message: I18n.t('usageTips.errors.downloadNotFound'),
          });
        }
      }
    } catch (e) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: I18n.t('usageTips.errors.downloadError'),
      });

      setHasErrorDownloaded(true);
    }

    setDownloading(false);
  };

  return {
    downloading,
    hasErrorDownloaded,
    hasDownloaded,
    progress,
    abrirPdf,
    baixarPDF
  };
}
