import { Link } from "react-router-dom";
import { siteConfig } from "../../config/site";
import { Icons } from "../icons";
import NewsLetterForm from "../news-letter";
function Footer() {
  return (
    <footer className="w-full border-t ml-4 lg:ml-0">
      <div className="container mx-auto pb-8 pt-6 lg:py-6">
        <section className="flex flex-col lg:flex-row gap-10 lg:gap-20 justify-between">
          <section className="flex space-x-2">
            <Link to="/" className="flex items-center space-x-2"></Link>
            <Icons.cookie className="size-6" aria-hidden="true" />
            <span className="font-bold">{siteConfig.name}</span>
            <span className="sr-only">Home</span>
          </section>
          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-10">
            {siteConfig.footerNav.map((foot) => (
              <div key={foot.title} className="space-y-3">
                <h4 className="font-medium">{foot.title}</h4>
                <ul className="">
                  {foot.items.map((item) => (
                    <li key={item.title} className="">
                      <Link
                        className="text-muted-foreground text-sm hover:text-foreground"
                        to={item.href}
                        target={item.external ? "_blank" : undefined}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
          <section className="space-y-3">
            <h4 className="">Subscribe to our newsletter</h4>
            <NewsLetterForm />
          </section>
        </section>
      </div>
    </footer>
  );
}

export default Footer;
