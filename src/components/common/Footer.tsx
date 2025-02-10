import Image from "next/image";
import Link from "next/link";

const MEMBERS = [
  {
    name: "이준영",
    github: "https://github.com/osanThor",
  },
  {
    name: "최보아",
    github: "https://github.com/swallowedB",
  },
  {
    name: "허정민",
    github: "https://github.com/gjwjdals96",
  },
  {
    name: "박지운",
    github: "https://github.com/uoomif",
  },
  {
    name: "우정완",
    github: "https://github.com/WJoungWan",
  },
];
export default function Footer() {
  return (
    <footer className="w-full max-w-[100vw] bg-main-700/10 mt-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="py-8">
          <div className="flex items-center justify-center">
            <div className="opacity-80 hover:opacity-100 transition-opacity">
              <Image
                src="/assets/images/logo.png"
                alt="Project Logo"
                className="h-4 w-auto min-w-[66px]"
                width={66}
                height={16}
              />
            </div>
            <div className="flex flex-wrap items-center pl-8">
              {MEMBERS.map((member) => (
                <Link
                  href={member.github}
                  key={member.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative after:absolute after:w-px after:h-6 after:bg-white/10 last:after:hidden after:top-1/2 after:right-0 after:-translate-y-1/2 w-32 px-4 py-2 transition-all duration-200 hover:bg-white/10 rounded-lg cursor-pointer"
                >
                  <div className="text-center">
                    <h3 className="text-white/90 text-xs font-medium">
                      {member.name}
                    </h3>
                    <p className="text-white/40 text-[10px] mt-0.5">
                      @{member.github.split("github.com/")[1]}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
