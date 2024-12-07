import { RoastedDesigns } from '@prisma/client';
import DOMPurify from 'isomorphic-dompurify';

export function MainDesignNode({
  data,
}: {
  data: { roastedDesign: RoastedDesigns };
}) {
  return (
    <div
      id="html-container"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(data.roastedDesign.improvedHtml),
      }}
    />
  );
}
