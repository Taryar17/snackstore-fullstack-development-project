import { Link } from "react-router-dom";

const PreviewProduct = ({
  title,
  href,
  sideText,
}: {
  title: string;
  href: string;
  sideText: string;
}) => (
  <div className="mb-10 mt-28 flex flex-col px-4 md:flex-row md:justify-between md:px-0">
    <h2 className="mb-4 text-2xl font-bold md:mb-0">{title}</h2>
    <Link to={href} className="font-semibold text-muted-foreground underline">
      {sideText}
    </Link>
  </div>
);

export default PreviewProduct;
