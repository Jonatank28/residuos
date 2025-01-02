import * as React from 'react';
import { wait } from 'vision-common';
import { IContainer } from '../../../../core/domain/entities/container';
import { AuthRoutes } from '../../../routes/routes';
import { IControllerAuth } from '../../../routes/types';

interface Props extends IControllerAuth<AuthRoutes.ClienteContainers> { }

export default function Controller({ params }: Props) {
  const [containers, setContainers] = React.useState<IContainer[]>([]);
  const [somenteLocal, setSomenteLocal] = React.useState<boolean>(false);
  const [loadingData, setLoadingData] = React.useState<boolean>(true);

  const onToggleOffiline = () => setSomenteLocal(!somenteLocal);

  React.useEffect(() => {
    if (params.containers.length > 0) {
      setLoadingData(true);
      wait(2000).then(() => setContainers(params.containers));
      setLoadingData(false);
    }
  }, []);

  React.useEffect(() => {
    if (containers.length > 0 && somenteLocal) {
      wait(2000).then(() => {
        const newContainers: IContainer[] = containers.filter((item: IContainer) => !item.dataRetirada);
        setContainers(newContainers);
      });
    } else {
      setContainers(params.containers);
    }
  }, [somenteLocal]);

  return {
    somenteLocal,
    loadingData,
    containers,
    onToggleOffiline
  };
}
