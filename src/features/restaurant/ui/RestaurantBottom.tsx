
const RestaurantBottom = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-white border-t">
      <div className="w-full max-w-[430px] flex gap-4 p-5">
        <button className="flex-1 h-12 border border-[#ff6b00] rounded-2xl text-[#ff6b00] font-semibold flex items-center justify-center gap-2">
          찜하기
        </button>

        <button className="flex-1 h-12 bg-[#ff6b00] rounded-2xl text-white font-semibold flex items-center justify-center gap-2">
          방문 인증
        </button>
      </div>
    </div>
  );
};

export default RestaurantBottom;