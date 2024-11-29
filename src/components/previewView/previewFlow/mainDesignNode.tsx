import { RoastedDesigns } from '@prisma/client';
import DOMPurify from 'isomorphic-dompurify';

export function MainDesignNode({
  data,
}: {
  data: { roastedDesign: RoastedDesigns };
}) {
  // useEffect(() => {
  //   const forms = document.querySelectorAll('form');
  //   Array.from(forms).forEach((form) => {
  //     console.log('Form:', form);
  //     form.setAttribute('autocomplete', 'new-password');
  //     form.style.display = 'none';
  //     form.style.backgroundColor = 'red';
  //   });

  //   console.log(forms);
  //   console.log('MainDesignNode mounted');
  // }, []);

  return (
    <div
      id="html-container"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(data.roastedDesign.improvedHtml),
      }}
    />
  );
}
