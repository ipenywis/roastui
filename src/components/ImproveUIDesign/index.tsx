import { ShowcaseSection } from '../showcaseSection';
import { WorkFlow } from '../workFlow';

export function ImproveUIDesign() {
  return (
    <ShowcaseSection
      title="Improve Your UI Design"
      description="Provide your UI design to RoastUI and our AI powered software will help you spot the UI/UX mistakes and suggest improved designs generated with the help of AI"
      className="mt-28 lg:mt-0"
    >
      <WorkFlow />
    </ShowcaseSection>
  );
}
