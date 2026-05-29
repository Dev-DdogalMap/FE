export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-white px-6 py-10">
        <h1 className="text-2xl font-extrabold text-gray-900">이용약관</h1>

        <div className="mt-8 space-y-6 text-sm leading-7 text-gray-600">
          <section>
            <h2 className="mb-2 font-bold text-gray-900">제1조 목적</h2>
            <p>
              본 약관은 또갈지도 서비스의 이용과 관련하여 회사와 이용자 간의
              권리, 의무 및 책임사항을 정하는 것을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-gray-900">제2조 서비스의 제공</h2>
            <p>
              또갈지도는 동네 맛집 정보, 지도 기반 탐색, 사용자 리뷰 및 관련
              기능을 제공합니다. 서비스 내용은 운영 상황에 따라 변경될 수
              있습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-gray-900">제3조 회원가입 및 로그인</h2>
            <p>
              이용자는 카카오 계정을 통해 서비스에 로그인할 수 있습니다. 회사는
              서비스 제공을 위해 필요한 범위 내에서 이용자의 정보를 처리합니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-gray-900">제4조 이용자의 의무</h2>
            <p>
              이용자는 타인의 권리를 침해하거나 서비스 운영을 방해하는 행위를
              해서는 안 됩니다. 허위 리뷰, 부적절한 게시물 작성 등은 제한될 수
              있습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-gray-900">제5조 서비스 이용 제한</h2>
            <p>
              회사는 이용자가 본 약관을 위반하거나 서비스의 정상적인 운영을
              방해하는 경우 서비스 이용을 제한할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-gray-900">제6조 면책</h2>
            <p>
              서비스 내 맛집 정보와 리뷰는 이용자 또는 외부 정보에 기반할 수
              있으며, 회사는 정보의 정확성이나 이용 결과를 보장하지 않습니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}