import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';

const buttonsContainer = cva('flex gap-x-3 items-center');

export function AccessControls() {
  return (
    <div className={buttonsContainer()}>
      <Button variant="ghost">Login</Button>
      <Button variant="default">Signup</Button>
    </div>
  );
}
