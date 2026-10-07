import { redirect } from 'next/navigation';

export default function CompetitionsRedirectPage() {
  redirect('/events');
}
