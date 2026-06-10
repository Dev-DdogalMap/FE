// src/pages/myPage/AboutPage.tsx

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const members = [
    {
        name: "김준형 (팀장)",
        role: "맛집 데이터 · 검색",
        tasks: [
            "공공데이터 구축",
            "맛집 검색",
            "맛집 지수 알고리즘",
        ],
    },
    {
        name: "남수진",
        role: "인프라 · 지도 · 활동 시스템",
        tasks: [
            "AWS 인프라",
            "CI/CD",
            "맛집 지도",
            "레벨 · 배지 시스템",
        ],
    },
    {
        name: "이은성",
        role: "맛집 정보 · 사용자 경험",
        tasks: [
            "맛집 상세 정보",
            "내 동네 인증",
            "북마크",
            "마이페이지 요약 정보",
        ],
    },
    {
        name: "류호진",
        role: "채팅 서비스",
        tasks: [
            "맛잘알 목록",
            "1:1 채팅",
            "실시간 메시징",
        ],
    },
    {
        name: "이연주",
        role: "채팅 서비스",
        tasks: [
            "채팅방 관리",
            "다대다 채팅",
            "실시간 메시징",
        ],
    },
    {
        name: "김진성",
        role: "사용자 · 인증",
        tasks: [
            "카카오 로그인",
            "인증 · 인가",
            "음식점 방문 인증",
            "회원 탈퇴",
            "마이페이지 설정",
        ],
    },
    {
        name: "서성률",
        role: "리뷰 시스템",
        tasks: [
            "리뷰 작성",
            "리뷰 이미지",
            "리뷰 관리",
            "작성 리뷰 관리",
        ],
    },
];

const features = [
    "맛집 지도",
    "지역 주민 인증",
    "리뷰 시스템",
    "레벨 · 배지",
    "1:1 채팅",
    "그룹 채팅",
    "북마크",
    "마이페이지",
];

const techStacks = [
    "React",
    "TypeScript",
    "Spring Boot",
    "PostgreSQL",
    "PostGIS",
    "Kakao Map API",
    "WebSocket",
    "AWS",
];

export default function AboutPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            <header className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-100 bg-white px-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mr-2"
                >
                    <ArrowLeft size={22} />
                </button>

                <h1 className="text-lg font-bold text-gray-900">
                    앱 정보
                </h1>
            </header>

            <div className="space-y-5 p-6">
                <section className="rounded-3xl border border-gray-100 bg-white p-6">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-extrabold text-[#FF6B00]">
                            또갈지도
                        </h2>

                        <span className="rounded-full bg-[#FFF3E8] px-2.5 py-1 text-xs font-semibold text-[#FF6B00]">
                            v1.0.0
                        </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                        고객 중심의 카카오지도 API 통합 프로젝트
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                        2026.05.21 ~ 2026.06.11
                    </p>

                    <p className="mt-4 leading-7 text-gray-600">
                        또갈지도는 지역 주민 인증을 기반으로
                        믿을 수 있는 맛집 정보를 공유하고,
                        리뷰·채팅·북마크 기능을 통해
                        동네 주민들이 함께 만들어가는
                        로컬 맛집 커뮤니티 서비스입니다.
                    </p>
                </section>

                <section className="rounded-3xl border border-gray-100 bg-white p-6">
                    <h3 className="text-lg font-bold text-gray-900">
                        주요 기능
                    </h3>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        {features.map((feature) => (
                            <div
                                key={feature}
                                className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700"
                            >
                                {feature}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-3xl border border-gray-100 bg-white p-6">
                    <h3 className="text-lg font-bold text-gray-900">
                        기술 스택
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {techStacks.map((tech) => (
                            <span
                                key={tech}
                                className="rounded-full border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </section>

                <section className="rounded-3xl border border-gray-100 bg-white p-6">
                    <h3 className="text-lg font-bold text-gray-900">
                        Team 찐막
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        모든 팀원이 풀스택으로 참여했으며,
                        각자 주요 기능 영역을 맡아 설계부터 구현까지 함께 진행했습니다.
                    </p>

                    <div className="mt-5 space-y-3">
                        {members.map((member) => (
                            <div
                                key={member.name}
                                className="rounded-2xl border border-gray-100 bg-white p-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {member.name}
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-[#FF6B00]">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {member.tasks.map((task) => (
                                        <span
                                            key={task}
                                            className="rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600"
                                        >
                                            {task}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}