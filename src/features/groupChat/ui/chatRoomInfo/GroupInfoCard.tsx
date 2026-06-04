interface Props {
  roomImage: string;
  roomName: string;
  participantCount: number;
  maxParticipantCount: number;
}

export default function GroupInfoCard({
  roomImage,
  roomName,
  participantCount,
  maxParticipantCount,
}: Props) {
  return (
    <div className="flex flex-col items-center">
      <img
        src={roomImage}
        alt={roomName}
        className="w-20 h-20 rounded-full object-cover"
      />

      <h2 className="mt-4 text-l font-bold">
        {roomName}
      </h2>

      <span className="mt-2 text-gray-500 text-l">
        {participantCount}/{maxParticipantCount}명
      </span>
    </div>
  );
}