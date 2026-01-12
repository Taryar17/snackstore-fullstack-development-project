// pages/About.tsx
import { Button } from "../components/ui/button";
import { FieldSeparator } from "../components/ui/field";
import { Card, CardContent } from "../components/ui/card";
import { CheckCircle, Heart, Shield, Star, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";

function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Founder & CEO",
      description: "Passionate foodie with 10+ years in the snack industry",
      imageColor: "bg-amber-200",
    },
    {
      name: "Maria Rodriguez",
      role: "Head of Procurement",
      description: "Global sourcing expert with connections worldwide",
      imageColor: "bg-orange-200",
    },
    {
      name: "James Wilson",
      role: "Quality Control",
      description: "Ensuring every snack meets our high standards",
      imageColor: "bg-yellow-200",
    },
    {
      name: "Sarah Lee",
      role: "Customer Experience",
      description: "Dedicated to making every order special",
      imageColor: "bg-emerald-200",
    },
  ];

  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Passion for Snacks",
      description:
        "We genuinely love snacks and want to share that joy with everyone.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Quality First",
      description:
        "Every product is carefully selected and tested for excellence.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Focused",
      description: "We build relationships, not just sell products.",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Taste",
      description: "Bringing flavors from around the world to your doorstep.",
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-0">
      <section className="py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="mb-6 text-4xl font-extrabold text-[#3b5d50] md:text-5xl">
            Our Story: Bringing Joy, One Snack at a Time
          </h1>
          <p className="mb-8 text-lg text-[#3b5d50]/80 md:text-xl">
            Welcome to Snack Break, where our passion for delicious treats meets
            your craving for something special. We're more than just a snack
            shop—we're your personal snack concierge.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              className="rounded-full bg-orange-300 px-8 py-6 text-base font-bold"
            >
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full px-8 py-6 text-base font-bold text-[#3b5d50]"
            >
              <Link to="/preorders">Browse Pre-orders</Link>
            </Button>
          </div>
        </div>
      </section>

      <FieldSeparator />

      <section className="py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-[#3b5d50]">
              Our Mission
            </h2>
            <p className="mb-4 text-lg text-[#3b5d50]/80">
              To transform snack time from a simple break into a delightful
              experience. We believe that the right snack can brighten your day,
              bring people together, and create lasting memories.
            </p>
            <p className="text-lg text-[#3b5d50]/80">
              From classic favorites to exotic discoveries, we're dedicated to
              curating the finest selection of snacks that cater to every taste
              and occasion.
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-8">
            <h3 className="mb-4 text-2xl font-bold text-[#3b5d50]">
              What Makes Us Different
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-[#3b5d50]">
                  Hand-picked selection from around the world
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-[#3b5d50]">
                  Freshness guaranteed with careful packaging
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-[#3b5d50]">
                  Exclusive pre-order access to limited editions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-[#3b5d50]">
                  Personalized snack recommendations
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <FieldSeparator />

      <section className="py-12">
        <h2 className="mb-12 text-center text-3xl font-bold text-[#3b5d50]">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card
              key={index}
              className="border-2 border-orange-100 hover:border-orange-300 transition-colors"
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-orange-100 p-3">
                  <div className="text-orange-600">{value.icon}</div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#3b5d50]">
                  {value.title}
                </h3>
                <p className="text-[#3b5d50]/80">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <FieldSeparator />

      <section className="py-12">
        <h2 className="mb-12 text-center text-3xl font-bold text-[#3b5d50]">
          Meet Our Team
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="overflow-hidden border-orange-100 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-0">
                <div
                  className={`${member.imageColor} h-48 flex items-center justify-center`}
                >
                  <div className="text-5xl font-bold text-[#3b5d50]/40">
                    {member.name.charAt(0)}
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="mb-1 text-xl font-bold text-[#3b5d50]">
                    {member.name}
                  </h3>
                  <p className="mb-3 text-sm font-semibold text-orange-600">
                    {member.role}
                  </p>
                  <p className="text-[#3b5d50]/80">{member.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl my-12">
        <div className="max-w-2xl mx-auto px-4">
          <Star className="h-12 w-12 text-orange-400 mx-auto mb-6" />
          <h2 className="mb-6 text-3xl font-bold text-[#3b5d50]">
            Join Our Snack Community
          </h2>
          <p className="mb-8 text-lg text-[#3b5d50]/80">
            Be part of a growing community of snack lovers who trust us to
            deliver happiness in every package.
          </p>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
