"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Search, CheckCircle } from "lucide-react";
import Image from "next/image";

export function QuickGuideSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null); // Ref cho container nội dung dính
  const sliderRef = useRef<HTMLDivElement>(null); // Ref cho slider ngang
  const [activeIndex, setActiveIndex] = useState(0);

  const steps = [
    {
      number: 1,
      title: "Upload a resume",
      gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG1iY2djd3g0ajVpcjVjaHg4NXZvMGtnbWRoNmcwZDJkbmFjaXExZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7bu3abK1jsa9zUqc/giphy.gif", // Thay bằng link GIF của bạn
    },
    {
      number: 2,
      title: "Get matched with jobs",
      gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd245c3E3dXBiaWw2eDA0c3ZtMWk0bTdrMzhkM2w2bHFoc2ZkYm1ndSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l41Yk_3NfsoO322Aw/giphy.gif", // Thay bằng link GIF của bạn
    },
    {
      number: 3,
      title: "Apply with one click",
      gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2FwaTNwZXNwcjN5enZkNWNjdjV6aW5rYmhucmg4emVhcXBqdGgyOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WpTo23dpab4W6a0G3J/giphy.gif", // Thay bằng link GIF của bạn
    },
    {
      number: 4,
      title: "Apply with one click",
      gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2FwaTNwZXNwcjN5enZkNWNjdjV6aW5rYmhucmg4emVhcXBqdGgyOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WpTo23dpab4W6a0G3J/giphy.gif", // Thay bằng link GIF của bạn
    },
  ];

  // Hàm này vẫn được giữ lại để xử lý click vào các chỉ số bước
  const scrollToStep = (index: number) => {
    if (sliderRef.current) {
      const stepWidth = sliderRef.current.scrollWidth / steps.length;
      sliderRef.current.scrollTo({
        left: stepWidth * index,
        behavior: "smooth",
      });
    }
  };

  // useEffect chính để xử lý hiệu ứng cuộn ngang
  useEffect(() => {
    const handleScroll = () => {
      if (
        !sectionRef.current ||
        !sliderRef.current ||
        !sliderContainerRef.current
      )
        return;

      const sectionEl = sectionRef.current;
      const sliderEl = sliderRef.current;

      // Lấy vị trí của section so với viewport
      const { top, height } = sectionEl.getBoundingClientRect();
      const sectionHeight = height;
      const viewportHeight = window.innerHeight;

      // Hiệu ứng chỉ xảy ra khi đỉnh của section chạm đỉnh viewport (top <= 0)
      // và kết thúc khi đáy của section rời khỏi đáy viewport.
      if (top <= 0 && top >= -(sectionHeight - viewportHeight)) {
        // Tính toán tiến trình cuộn dọc bên trong section (từ 0 đến 1)
        const scrollableDistance = sectionHeight - viewportHeight;
        const progress = Math.abs(top) / scrollableDistance;

        // Ánh xạ tiến trình cuộn dọc sang cuộn ngang
        const maxScrollLeft = sliderEl.scrollWidth - sliderEl.clientWidth;
        sliderEl.scrollLeft = progress * maxScrollLeft;

        // Cập nhật activeIndex dựa trên vị trí cuộn ngang
        const stepWidth = sliderEl.scrollWidth / steps.length;
        const newActiveIndex = Math.floor(
          (sliderEl.scrollLeft + stepWidth / 2) / stepWidth
        );
        if (newActiveIndex !== activeIndex) {
          setActiveIndex(newActiveIndex);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Dọn dẹp event listener khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeIndex, steps.length]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-background"
      // 1. TẠO "ĐƯỜNG BĂNG": Đặt chiều cao lớn để có không gian cuộn dọc
      style={{ height: "300vh" }}
    >
      {/* 2. "GHIM" NỘI DUNG: Container này sẽ dính vào top khi cuộn */}
      <div
        ref={sliderContainerRef}
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
      >
        <div className="w-4/5 h-4/5 bg-[#DDDDDD] rounded-2xl flex flex-col p-8 md:p-12">
          <div className="flex flex-col md:flex-row h-full">
            <div
              ref={sliderRef}
              className="w-full md:w-3/3 overflow-x-hidden flex items-center"
            >
              <div className="flex">
                <div className="w-[600px] px-32 flex flex-col justify-center">
                  {/* Title block with Simple and guide stacked, no background */}
                  <div className="w-full">
                    <div className="flex flex-col pr-8">
                      <h2 className="text-6xl lg:text-7xl font-bold text-gray-800">
                        Simple
                      </h2>
                      <h2 className="text-6xl lg:text-7xl font-bold text-gray-800">
                        guide
                      </h2>
                    </div>
                    <p className="mt-4 text-lg text-gray-600">
                      get job recommendation with a few steps
                    </p>
                  </div>
                </div>
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="w-[800px] px-16 flex items-center justify-center"
                  >
                    <div className="bg-brand-cream rounded-xl p-8 w-full flex flex-col">
                      {/* --- PHẦN LAYOUT TRÁI/PHẢI --- */}
                      {/* div này dùng flex và justify-between để đẩy các phần tử con ra 2 phía */}
                      <div className="flex justify-between items-center mb-4">
                        {/* Phần tử này sẽ nằm BÊN TRÁI */}
                        <h3 className="text-2xl text-gray-500">
                          Step {step.number}
                        </h3>

                        {/* Phần tử này sẽ nằm BÊN PHẢI */}
                        <h4 className="text-2xl md:text-3xl text-right">
                          {step.title}
                        </h4>
                      </div>

                      {/* Phần dưới: Ảnh GIF */}
                      <div className="mt-4 w-full aspect-video">
                        <Image
                          width = {800}
                          height = {450}
                          src={step.gif}
                          alt={step.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Mobile step indicators */}
      </div>
    </section>
  );
}