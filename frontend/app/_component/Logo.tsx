import Image from "next/image";
import logo from "@/app/public/logo.png";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={'/#'}>
      <div className="logo">
        <Image src={logo} alt="Logo" width={150} height={50} />
      </div>
    </Link>
  );
};

export default Logo;
