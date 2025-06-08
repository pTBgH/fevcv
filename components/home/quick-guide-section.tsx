"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Search, CheckCircle } from "lucide-react";

export function QuickGuideSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null); // Ref cho container nội dung dính
  const sliderRef = useRef<HTMLDivElement>(null); // Ref cho slider ngang
  const [activeIndex, setActiveIndex] = useState(0);

  const steps = [
    {
      number: 1,
      title: "Upload a resume",
      description: "Upload your resume in PDF, DOC, or DOCX format",
      icon: <Upload className="h-12 w-12 text-gray-600" />,
    },
    {
      number: 2,
      title: "Get matched with jobs",
      description: "Our AI analyzes your skills and matches you with relevant job opportunities",
      icon: <Search className="h-12 w-12 text-gray-600" />,
    },
    {
      number: 3,
      title: "Apply with one click",
      description: "Apply to jobs with a single click and track your applications",
      icon: <CheckCircle className="h-12 w-12 text-gray-600" />,
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
      if (!sectionRef.current || !sliderRef.current || !sliderContainerRef.current) return;

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
        const newActiveIndex = Math.floor((sliderEl.scrollLeft + stepWidth / 2) / stepWidth);
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
      className="relative bg-gray-100"
      // 1. TẠO "ĐƯỜNG BĂNG": Đặt chiều cao lớn để có không gian cuộn dọc
      style={{ height: "300vh" }}
    >
      {/* 2. "GHIM" NỘI DUNG: Container này sẽ dính vào top khi cuộn */}
      <div ref={sliderContainerRef} className="sticky top-0 h-screen overflow-hidden">
        <div className="container mx-auto px-4 h-full">
          <div className="flex flex-col md:flex-row h-full">
            {/* Left side - Fixed title */}
            <div className="w-full md:w-1/3 flex flex-col justify-center pr-8">
              <h2 className="text-5xl md:text-7xl font-bold mb-6">
                Simple
                <br />
                guide
              </h2>
              <p className="text-xl text-gray-600 mb-8 md:mb-12">
                Get job recommendations with a few simple steps
              </p>

              {/* Step indicators */}
              <div className="hidden md:flex flex-col space-y-4 mt-8">
                {steps.map((step, index) => (
                  <button
                    key={index}
                    className={`flex items-center text-left transition-all duration-300 ${
                      index === activeIndex ? "opacity-100" : "opacity-50"
                    }`}
                    onClick={() => scrollToStep(index)}
                  >
                    <div
                      className={`w-3 h-3 rounded-full mr-3 transition-all duration-300 ${
                        index === activeIndex ? "bg-black scale-125" : "bg-gray-400"
                      }`}
                    />
                    <span className="text-sm font-medium">Step {index + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right side - Scrollable steps */}
            <div
              ref={sliderRef}
              // Ngăn người dùng cuộn ngang thủ công, chỉ cho phép cuộn qua JS
              className="w-full md:w-2/3 overflow-x-hidden flex items-center"
            >
              <div className="flex">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="min-w-full px-4 flex items-center justify-center"
                  >
                    <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 w-full max-w-md">
                      <div className="mb-6 text-center">
                        <h3 className="text-2xl font-semibold mb-2">Step {step.number}</h3>
                        <h4 className="text-3xl md:text-4xl font-bold mb-6">{step.title}</h4>
                        <p className="text-lg text-gray-600 mb-8">{step.description}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                          {step.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile step indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex justify-center space-x-4 md:hidden">
          {steps.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex ? "bg-black scale-125" : "bg-gray-400"
              }`}
              onClick={() => scrollToStep(index)}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}