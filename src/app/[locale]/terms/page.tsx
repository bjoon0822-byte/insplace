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
  return { title: t(m, 'footer.terms') };
}

export default async function TermsPage({ params }: PageProps) {
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
        {t(m, 'footer.terms')}
      </h1>

      <div style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--gray-600)', wordBreak: 'keep-all' }}>
        <Section title="제1조 (목적)">
          본 약관은 인스플레이스(이하 &quot;회사&quot;)가 제공하는 K-POP 팬 광고 중개 서비스(이하 &quot;서비스&quot;)의 이용 조건 및 절차, 회사와 이용자의 권리·의무 및 기타 필요한 사항을 규정함을 목적으로 합니다.
        </Section>

        <Section title="제2조 (정의)">
          <ol style={{ paddingLeft: '20px' }}>
            <li>&quot;서비스&quot;란 회사가 운영하는 웹사이트 및 모바일 앱을 통해 제공하는 옥외광고, 장소대관, 굿즈 제작, 팝업스토어 관련 중개 서비스를 말합니다.</li>
            <li>&quot;이용자&quot;란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
            <li>&quot;회원&quot;이란 회사에 개인정보를 제공하고 회원등록을 한 자로서, 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
          </ol>
        </Section>

        <Section title="제3조 (약관의 효력 및 변경)">
          <ol style={{ paddingLeft: '20px' }}>
            <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.</li>
            <li>회사는 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수 있으며, 개정 시 적용일자 7일 전부터 공지합니다.</li>
          </ol>
        </Section>

        <Section title="제4조 (서비스의 제공)">
          회사는 다음과 같은 서비스를 제공합니다:
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li>K-POP 관련 옥외광고 매체 정보 제공 및 중개</li>
            <li>장소(카페, 이벤트홀 등) 대관 정보 제공 및 중개</li>
            <li>팬 굿즈 제작 서비스 중개</li>
            <li>팝업스토어 기획 및 운영 지원</li>
            <li>커뮤니티 서비스</li>
            <li>기타 회사가 정하는 서비스</li>
          </ul>
        </Section>

        <Section title="제5조 (이용계약의 성립)">
          이용계약은 이용자가 약관에 동의하고 회원가입을 신청한 후, 회사가 이를 승낙함으로써 성립합니다.
        </Section>

        <Section title="제6조 (회원의 의무)">
          <ol style={{ paddingLeft: '20px' }}>
            <li>회원은 서비스 이용 시 관련 법령, 약관, 이용안내 및 주의사항을 준수하여야 합니다.</li>
            <li>회원은 타인의 권리를 침해하거나 공공질서 및 미풍양속에 반하는 행위를 하여서는 안 됩니다.</li>
            <li>회원은 자신의 계정 정보를 안전하게 관리할 의무가 있습니다.</li>
          </ol>
        </Section>

        <Section title="제7조 (면책조항)">
          <ol style={{ paddingLeft: '20px' }}>
            <li>회사는 천재지변 또는 이에 준하는 불가항력으로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</li>
            <li>회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.</li>
          </ol>
        </Section>

        <Section title="제8조 (분쟁해결)">
          서비스 이용과 관련하여 발생한 분쟁에 대해 회사와 이용자는 성실히 협의하며, 협의가 이루어지지 않을 경우 관할법원은 서울중앙지방법원으로 합니다.
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
