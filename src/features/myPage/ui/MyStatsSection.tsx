const MyStatsSection = () => {
  return (
    <section className="mx-6 mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="grid grid-cols-4 divide-x divide-gray-100 py-5">
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-gray-800">방문 인증</span>
          <strong className="mt-3 text-3xl font-extrabold text-orange-500">
            42
          </strong>
          <span className="mt-1 text-sm font-semibold text-gray-700">회</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-gray-800">작성한 후기</span>
          <strong className="mt-3 text-3xl font-extrabold text-gray-900">
            18
          </strong>
          <span className="mt-1 text-sm font-semibold text-gray-700">개</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-gray-800">북마크</span>
          <strong className="mt-3 text-3xl font-extrabold text-gray-900">
            36
          </strong>
          <span className="mt-1 text-sm font-semibold text-gray-700">개</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-gray-800">채팅방</span>
          <strong className="mt-3 text-3xl font-extrabold text-gray-900">
            3
          </strong>
          <span className="mt-1 text-sm font-semibold text-gray-700">개</span>
        </div>
      </div>
    </section>
  );
};

export default MyStatsSection;