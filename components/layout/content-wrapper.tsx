export default function ContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grid w-full pl-[53px]">{children}</div>;
}
