import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { locales } from '@/i18n/routing';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);
  return { title: t(m, 'footer.privacy') };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 120px' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '2rem',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        color: 'var(--gray-900)',
        marginBottom: '40px',
      }}>
        {t(m, 'footer.privacy')}
      </h1>

      <div style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--gray-600)', wordBreak: 'keep-all' }}>
        <Section title="1. 개인정보의 수집 항목 및 수집 방법">
          <p>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li><strong>필수 항목:</strong> 이메일 주소, 비밀번호, 닉네임</li>
            <li><strong>선택 항목:</strong> 이름, 전화번호</li>
            <li><strong>문의 시:</strong> 이름, 이메일, 전화번호, 문의 내용</li>
            <li><strong>자동 수집:</strong> IP 주소, 쿠키, 접속 로그, 서비스 이용 기록</li>
          </ul>
        </Section>

        <Section title="2. 개인정보의 수집 및 이용 목적">
          <ul style={{ paddingLeft: '20px' }}>
            <li>회원 가입 및 관리: 본인 확인, 서비스 이용, 문의 응대</li>
            <li>서비스 제공: 광고 중개, 견적 관리, 주문 처리</li>
            <li>마케팅 및 광고: 이벤트 안내, 서비스 개선을 위한 통계 분석</li>
          </ul>
        </Section>

        <Section title="3. 개인정보의 보유 및 이용 기간">
          <p>회원 탈퇴 시 즉시 파기합니다. 단, 관계 법령에 따라 아래와 같이 보관합니다:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li>계약 또는 청약철회에 관한 기록: 5년 (전자상거래법)</li>
            <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
            <li>소비자 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
            <li>접속 로그: 3개월 (통신비밀보호법)</li>
          </ul>
        </Section>

        <Section title="4. 개인정보의 제3자 제공">
          회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 이용자의 동의가 있거나 법령에 의해 요구되는 경우에 한해 제공합니다.
        </Section>

        <Section title="5. 개인정보의 파기 절차 및 방법">
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>파기 절차:</strong> 보유 기간 경과 후 지체 없이 파기</li>
            <li><strong>파기 방법:</strong> 전자적 파일은 기술적 방법으로 복구 불가능하게 삭제, 종이 문서는 분쇄 또는 소각</li>
          </ul>
        </Section>

        <Section title="6. 이용자의 권리">
          <p>이용자는 언제든지 자신의 개인정보에 대해 다음을 요청할 수 있습니다:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li>개인정보 열람 요청</li>
            <li>오류 등에 대한 정정 요청</li>
            <li>삭제 요청</li>
            <li>처리 정지 요청</li>
          </ul>
        </Section>

        <Section title="7. 개인정보 보호책임자">
          <ul style={{ paddingLeft: '20px' }}>
            <li>담당자: 개인정보 보호팀</li>
            <li>이메일: privacy@insplace.com</li>
          </ul>
        </Section>

        <Section title="8. 개인정보 처리방침의 변경">
          본 개인정보처리방침은 법령, 정책 또는 보안 기술의 변경에 따라 수정될 수 있으며, 변경 시 서비스 내 공지사항을 통해 알려드립니다.
        </Section>

        <p style={{ marginTop: '40px', color: 'var(--gray-400)', fontSize: '0.8125rem' }}>
          시행일: 2025년 1월 1일
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{
        fontSize: '1.125rem',
        fontWeight: 700,
        color: 'var(--gray-800)',
        marginBottom: '12px',
      }}>
        {title}
      </h2>
      <div>{children}</div>
    </div>
  );
}
