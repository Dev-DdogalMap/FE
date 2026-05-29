export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-white px-6 py-10">
        <h1 className="text-2xl font-extrabold text-gray-900">
          개인정보처리방침
        </h1>

        <div className="mt-8 space-y-6 text-sm leading-7 text-gray-600">
          <section>
            <h2 className="mb-2 font-bold text-gray-900">1. 수집하는 개인정보</h2>
            <p>
              또갈지도는 카카오 로그인 과정에서 제공되는 회원 식별자, 닉네임,
              프로필 정보 등 서비스 제공에 필요한 최소한의 정보를 수집할 수
              있습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-gray-900">2. 개인정보의 이용 목적</h2>
            <p>
              수집한 개인정보는 회원 식별, 로그인 유지, 서비스 이용 관리, 리뷰
              및 개인화 기능 제공을 위해 사용됩니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-gray-900">3. 개인정보의 보관 기간</h2>
            <p>
              개인정보는 회원 탈퇴 시 또는 수집 및 이용 목적이 달성된 경우
              지체 없이 파기합니다. 단, 관련 법령에 따라 보관이 필요한 경우
              해당 기간 동안 보관할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-gray-900">4. 개인정보의 제3자 제공</h2>
            <p>
              또갈지도는 이용자의 동의 없이 개인정보를 외부에 제공하지
              않습니다. 다만 법령에 따라 요구되는 경우 예외로 합니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-gray-900">5. 개인정보 보호 조치</h2>
            <p>
              또갈지도는 개인정보 보호를 위해 접근 권한 관리, 인증 정보 보호,
              보안 설정 등 필요한 기술적·관리적 조치를 수행합니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-gray-900">6. 이용자의 권리</h2>
            <p>
              이용자는 자신의 개인정보에 대한 열람, 수정, 삭제, 처리 정지를
              요청할 수 있습니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}