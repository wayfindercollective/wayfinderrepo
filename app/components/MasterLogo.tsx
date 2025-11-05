import Image from "next/image";

type Props = {
  className?: string;
};

export default function MasterLogo({ className }: Props) {
  return (
    <div className={`inline-block ${className || ""}`}>
      <Image
        src="/master-logo.svg"
        alt="Master Logo"
        width={48}
        height={48}
        className="w-12 h-12"
      />
    </div>
  );
}
