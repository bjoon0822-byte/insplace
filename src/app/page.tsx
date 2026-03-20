// 루트 페이지: /ko로 리다이렉트
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/ko');
}
