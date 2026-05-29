const RestaurantBottom = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div className="w-full max-w-[430px] bg-white">
        <div className="flex gap-4 p-5">
          <button
            type="button"
            className="flex-1 h-12 border border-[#ff6b00] rounded-2xl text-[#ff6b00] font-semibold"
          >
            찜하기
          </button>

          <button
            type="button"
            className="flex-1 h-12 bg-[#ff6b00] rounded-2xl text-white font-semibold"
          >
            방문 인증
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantBottom;