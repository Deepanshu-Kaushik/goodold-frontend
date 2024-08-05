import { DateTime } from 'luxon';

export default function formatDate(date: string | null | undefined) {
  if (!date) return 'a while ago...';
  const messageDate = DateTime.fromISO(date);
  const now = DateTime.local();

  if (messageDate.hasSame(now, 'day')) {
    return messageDate.toFormat('hh:mm a');
  } else if (messageDate.hasSame(now.minus({ days: 1 }), 'day')) {
    return `Yesterday, ${messageDate.toFormat('hh:mm a')}`;
  } else if (messageDate.hasSame(now, 'year')) {
    return messageDate.toFormat('dd/MM, hh:mm a');
  } else {
    return messageDate.toFormat('dd/MM/yyyy, hh:mm a');
  }
}
