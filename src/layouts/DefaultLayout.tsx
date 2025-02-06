type Props = {
  children: React.ReactNode;
};
export default function DefaultLayout({ children }: Props) {
  return (
    <div className="bg-size font-pretendard font-medium bg-main">
      <main className="w-full flex flex-col items-center">{children}</main>
    </div>
  );
}
