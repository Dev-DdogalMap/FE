import { motion } from "framer-motion";

import splashBg from "@/assets/images/splash-bg.png";
import splashChick from "@/assets/images/splash-chick.png";
import logo from "@/assets/images/logo.png";

export default function SplashScreen() {
    return (
        <div className="h-dvh w-full bg-gray-100">
            <div className="relative mx-auto h-dvh w-full max-w-[430px] overflow-hidden bg-[#FFF3E8]">
                <img
                    src={splashBg}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="relative z-10 flex h-full flex-col items-center">
                    <motion.img
                        src={logo}
                        alt="또갈지도"
                        className="mt-[14vh] w-[58%] max-w-[250px]"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    />

                    <motion.p
                        className="mt-4 text-center text-lg font-semibold text-[#7A5138]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.45 }}
                    >
                        우리 동네 또 가고 싶은 맛집 지도
                    </motion.p>

                    <div className="flex-1" />

                    <motion.img
                        src={splashChick}
                        alt="또갈지도 병아리"
                        className="mb-[18vh] w-[52%] max-w-[230px]"
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: [0, -6, 0],
                        }}
                        transition={{
                            opacity: {
                                duration: 0.4,
                                delay: 0.25,
                            },
                            scale: {
                                duration: 0.4,
                                delay: 0.25,
                            },
                            y: {
                                delay: 0.7,
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}