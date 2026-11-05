import { notify } from '../components/ui/Toast';

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const toast = ({ title, description, variant }: ToastProps) => {
    if (variant === 'destructive') {
      notify.error(description || title || 'An error occurred', title);
    } else {
      notify.success(description || title || 'Success', title);
    }
  };

  return { toast };
}

export { notify };
export const toast = (props: ToastProps) => {
  if (props.variant === 'destructive') {
    notify.error(props.description || props.title || 'An error occurred', props.title);
  } else {
    notify.success(props.description || props.title || 'Success', props.title);
  }
};
