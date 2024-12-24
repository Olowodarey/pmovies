import Image from 'next/image';
import logo from "@/app/public/logo.png"

const Logo = () => {
  return (
    <div className="logo">
      <Image src={logo}
       alt="Logo" 
       width={150}
        height={50} />
    </div>
  );
};

export default Logo;
