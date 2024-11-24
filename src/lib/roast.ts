import { roastModel } from './ai';
import { getImageBase64 } from './image';
import { generateObject, generateText } from 'ai';
import { IMPROVEMENTS_PROMPTS, NEW_DESIGN_PROMPTS } from './prompt';
import { DesignImprovements } from '@/types/designImprovements';
import { NewDesign } from '@/types/newDesign';

export async function getDesignImprovements(
  image: File
): Promise<DesignImprovements> {
  const imageBase64 = await getImageBase64(image);

  const result = await generateObject({
    model: roastModel,
    schema: IMPROVEMENTS_PROMPTS.schema,
    messages: [
      {
        role: 'system',
        content: IMPROVEMENTS_PROMPTS.system,
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: IMPROVEMENTS_PROMPTS.user },
          {
            type: 'image',
            image: imageBase64,
          },
        ],
      },
    ],
  });

  console.log("What's wrong: ", result.object.whatsWrong);

  return result.object;
}

export async function getNewDesign(
  image: File,
  improvements: DesignImprovements['improvements']
): Promise<NewDesign> {
  const base64Image = await getImageBase64(image);

  const result = await generateObject({
    model: roastModel,
    schema: NEW_DESIGN_PROMPTS.schema,
    messages: [
      {
        role: 'system',
        content: NEW_DESIGN_PROMPTS.system,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: NEW_DESIGN_PROMPTS.getUserPrompt(
              improvements.map((i) => `${i.category}: ${i.description}`)
            ),
          },
          {
            type: 'image',
            image: base64Image,
          },
        ],
      },
    ],
  });

  return result.object;
}
