import { RoastedDesigns } from '@prisma/client';
import DOMPurify from 'isomorphic-dompurify';
import JsxParser from 'react-jsx-parser';
import { extractJsx } from '@/lib/render';

const libsToInject = { ...require('lucide-react') };

export function MainDesignNode({
  data,
}: {
  data: { roastedDesign: RoastedDesigns };
}) {
  const extractedJsx = extractJsx(
    data.roastedDesign.internalImprovedReact ??
      data.roastedDesign.improvedReact,
  );

  if (!extractedJsx) {
    return (
      <div
        id="html-container"
        className="relative"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(data.roastedDesign.internalImprovedHtml),
        }}
      />
    );
  }

  return (
    <div id="html-container" className="relative">
      <JsxParser
        components={libsToInject}
        jsx={extractedJsx}
        renderInWrapper={false}
      />
    </div>
  );
}
