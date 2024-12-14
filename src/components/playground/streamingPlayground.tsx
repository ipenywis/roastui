import { StreamableRoastedDesign } from '@/types/roastedDesign';
import { NewDesignForm } from '../newDesignForm';
import { container, innerContainer, title } from './common';
import { DesignImprovementsPreview } from '../designImprovementsPreview';
import { DeepPartial } from 'ai';
import { DesignPreview } from '../designPreview';

interface StreamingPlaygroundProps {
  streamableRoastedDesign: DeepPartial<StreamableRoastedDesign>;
}

export function StreamingPlayground(props: StreamingPlaygroundProps) {
  const { streamableRoastedDesign } = props;

  return (
    <div className={container()}>
      <div className={innerContainer()}>
        <h1 className={title()}>Roast New Design</h1>
        {/* <NewDesignForm /> */}
        <div>
          {streamableRoastedDesign &&
            streamableRoastedDesign.internalImprovedHtml && (
              <DesignPreview
                HTML={streamableRoastedDesign.improvedHtml}
                designId={streamableRoastedDesign.id}
                originalImageUrl={streamableRoastedDesign.originalImageUrl}
              />
            )}
        </div>
        {streamableRoastedDesign &&
          streamableRoastedDesign.improvements &&
          streamableRoastedDesign.whatsWrong && (
            <DesignImprovementsPreview
              improvements={JSON.parse(streamableRoastedDesign.improvements)}
              whatsWrong={JSON.parse(streamableRoastedDesign.whatsWrong)}
            />
          )}
      </div>
    </div>
  );
}
