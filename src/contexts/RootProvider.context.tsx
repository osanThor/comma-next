import SWRConfigContext from "./SwrConfig.context";

type Props = {
  children: React.ReactNode;
};
export default function RootProvider({ children }: Props) {
  return (
    <>
      <SWRConfigContext>{children}</SWRConfigContext>
    </>
  );
}
