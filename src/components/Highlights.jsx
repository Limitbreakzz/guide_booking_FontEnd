import { Info, Search, Image as ImageIcon, FileText } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Info className="w-10 h-10 text-[#37101A]" />,
      title: "ข้อมูลครบถ้วน",
      desc: "รวบรวมข้อมูลท่องเที่ยว ประเทศ สถานที่สำคัญ อาหาร และวัฒนธรรม",
    },
    {
      icon: <Search className="w-10 h-10 text-[#37101A]" />,
      title: "คัดสรรประเทศยอดนิยม",
      desc: "เน้นประเทศที่คนไทยนิยมเดินทาง เช่น ญี่ปุ่น เกาหลี เวียดนาม",
    },
    {
      icon: <ImageIcon className="w-10 h-10 text-[#37101A]" />,
      title: "ภาพสวยสะดุดตา",
      desc: "ใช้ภาพคุณภาพสูง สร้างแรงบันดาลใจในการเดินทาง",
    },
    {
      icon: <FileText className="w-10 h-10 text-[#37101A]" />,
      title: "ใช้งานง่าย",
      desc: "ออกแบบเมนูและการนำทางให้สะดวก รองรับทั้งมือถือและคอมพิวเตอร์",
    },
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-2xl text-[#2A0C14] font-bold mb-2 ">จุดเด่นของเรา</h2>
        <p className="text-[#37101A] mb-10">
          แหล่งข้อมูลที่ครอบคลุมเกี่ยวกับสิ่งแวดล้อม ทั้งบทความ กิจกรรม และการเผยแพร่เอกสารที่น่าสนใจ
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-[#FFC5D3] w-20 h-20 flex items-center justify-center rounded-full shadow-md mb-4">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg text-[#2A0C14]">{item.title}</h3>
              <p className="text-[#37101A] text-sm mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
